import { doc, collection, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db, auth, app, useNavigate } from '../../imports.js';


export async function fetchDueCards(docRef, noDue, retainRate) {
    const currTime = new Date().getTime();
    const docSnap = await getDoc(docRef);
    let iModifer = 0;

    if (!docSnap.exists()) {
        console.error('Error getting doc');
        return;
    }
    const cardsData = docSnap.data().cards;
    const timeSinceDeckStart = docSnap.data().start;
    
    if (currTime - timeSinceDeckStart === 907200000) { //10.5 days in milliseconds
        
        iModifer = (Math.log(85) / Math.log(retainRate));


    }

    const dueCards = !noDue ? cardsData.filter((card) => card.nextReview <= new Date().getTime()) : cardsData.filter((card) => !card.isGraduated);
    return [dueCards, iModifer];
}


export async function handleReview(card, rating, iModifer) {
    const currTime = new Date().getTime();
    const lastInterval = card.lastInterval;
    const currLapses = card.lapses;

    const intervals = [
        //in milliseconds
        60000, // 1 minute
        330000, // 5.5 minutes
        600000, // 10 minutes
        86400000, // 1 days
        172800000 // 2 days
    ];

    const retainedCard = Math.min(rating / 2, 1);
    if (!card.isGraduated) {
        const graduatedBool = (lastInterval === 60000 && rating === 2) || rating === 3;
        const newInterval = graduatedBool ? intervals[rating + 1] : intervals[rating];
        const nextReview = currTime + newInterval;
        const updatedCard = {
          ...card,
          isGraduated: graduatedBool,
          lastInterval: newInterval,
          nextReview: nextReview,
    
        };
        
  

      } else {



        let nextInterval = 0;
        if (rating === 0 && currLapses < 5) {
            const graduatedBool = false;
            currLapses++;
            nextInterval = intervals[2];
        } else if (rating === 1) {
            nextInterval = lastInterval / 2 * iModifer;
        } else if (rating === 2) {
            nextInterval = lastInterval * 1.5 * iModifer;
        } else if (rating === 3) {
            nextInterval = lastInterval * 2.5 * iModifer;
        } else {
            nextInterval

        }
        

        

        var lapses = n === 0 ? lapses++ : lapses;
  
        const nextInterva =
          n === 0 && currLapses < lapses
            ? intervals[2]
            : n === 1
            ? lastInterval * 1.3
            : n === 2
            ? lastInterval * 2.5
            : lastInterval * 1.3 * 2.5;
  
        const lapsedStartingInterval =
          currLapses < lapses ? lastInterval * 0.4 : 0;
        const nextReview = nextInterval + currTime;
        const isLeech = lapses > 5;

        updatedCard.nextReview = nextReview;
        updatedCard.lastInterval = nextInterval;
        updatedCard.lapses = lapses;
        updatedCard.isLeech = isLeech;
        updatedCard.lapsedStartingInterval = lapsedStartingInterval;
  /*
        const updatedCard = {
          ...card,
          nextReview: nextReview,
          lastInterval: nextInterval,
          lapses: lapses,
          isLeech: isLeech,
          lapsedStartingInterval: lapsedStartingInterval,
        };
        */

        
  
      }



      return [updatedCard, retainedCard];

      
    




}



