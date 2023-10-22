import { doc, collection, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db, auth, app, useNavigate } from '../../imports.js';


export async function fetchDueCards(docRef, noDue, retainRate) {
    const currTime = new Date().getTime();
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error('Error getting doc');
        return;
    }
    const cardsData = docSnap.data().cards;
    const timeSinceDeckStart = docSnap.data().start;
    let iModifer = 0;
    
    if (currTime - timeSinceDeckStart === 907200000) { //10.5 days 
        
      iModifer = (Math.log(85) / Math.log(retainRate));


    }
    const realDueCards = cardsData.filter((card) => card.nextReview <= currTime());
    const dueCards = realDueCards.length != 0 ? realDueCards : cardsData.filter((card) => !card.isGraduated);
    console.log(dueCards);
    //Fix for noDue

    return [dueCards, iModifer];
}


export async function handleReview(card, rating, iModifer) {
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

    

        updatedCard.nextReview = (nextInterval + currTime);
        updatedCard.lastInterval = nextInterval;
        updatedCard.lapses = currLapses;
        updatedCard.isLeech = isLeech;
        updatedCard.isGraduated = graduatedBool;
      }



      return [updatedCard, retainedCard];

      
    




}



