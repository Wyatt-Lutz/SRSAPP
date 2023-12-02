import { doc, collection, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db, auth, app, useNavigate } from '../../imports.js';


export async function fetchDueCards(docRef) {
    const currTime = new Date().getTime();
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error('Error getting doc');
        return;
    }
    const cardsData = docSnap.data().cards;

    const realDueCards = cardsData.filter((card) => card.nextReview <= currTime);
    const dueCards = realDueCards.length != 0 ? realDueCards : cardsData.filter((card) => !card.isGraduated);
    return dueCards;
}


export async function handleReview(docRef, card, rating, iModifer) {
    console.log('handleReview ran');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('doc doesnt exist');
      return;
    }
    const currTime = new Date().getTime();
    const retainedCard = Math.min(rating / 2, 1);

    const intervals = [
        60000, // 1 minute
        330000, // 5.5 minutes
        600000, // 10 minutes
        86400000, // 1 day
        172800000 // 2 days
    ];

    const updatedCard = {...card};
    const {
      lastInterval: lastInterval,
      lapses: lapses,
      isGraduated: isGraduated,
    } = card;

    let isLeech = false;
    let graduatedBool = false;
    let nextInterval = 0;
    let currLapses = lapses;

    
    if (!isGraduated) {
        graduatedBool = (lastInterval === 60000 && rating === 2) || rating === 3;
        nextInterval = graduatedBool ? intervals[rating + 1] : intervals[rating];
        
        

    } else {
        
        if (rating === 0 && currLapses < 5) {
            currLapses++;
            nextInterval = intervals[1];
        } else if (rating === 1) {
            nextInterval = (lastInterval / 2) * iModifer;
        } else if (rating === 2) {
            nextInterval = (lastInterval * 1.5) * iModifer;
        } else if (rating === 3) {
            nextInterval = (lastInterval * 2.5) * iModifer;
        } else {
          isLeech = true;
          currLapses = 0;
        }
    }
    updatedCard.nextReview = (nextInterval + currTime);
    updatedCard.lastInterval = (Math.min(nextInterval, 31556926000));
    updatedCard.lapses = currLapses;
    updatedCard.isLeech = isLeech;
    updatedCard.isGraduated = graduatedBool;
    


      
      const { retained, studied, cards } = docSnap.data();
      const updatedCards = [...cards];
      updatedCards[updatedCard.cardIndex] = updatedCard;


      await updateDoc(docRef, {
        retained: retained + retainedCard,
        studied: studied + 1,
        cards: updatedCards,
      });
}



