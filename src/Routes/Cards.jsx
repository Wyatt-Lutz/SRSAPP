import {
  doc,
  collection,
  getDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { db, auth, app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
//xX8%*c8T!Kc$5C%

function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [rating, setRating] = useState(null);

  const isMounted = useRef(false);

  const urlParams = new URLSearchParams(window.location.search);
  const deckId = urlParams.get('id');

  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckId);

  const buttonData = [
    { text: 'Again', value: 0 },
    { text: 'Hard', value: 1 },
    { text: 'Good', value: 2 },
    { text: 'Easy', value: 3 },
  ];

  useEffect(() => {
    console.log('onMount useEffect run');

    async function fetchDecks() {
      if (!user) {
        console.error('Invalid User');
        navigate('/');
        return;
      }

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Error getting doc');
        return;
      }

      const cardsData = docSnap.data().cards;

      const leechFilteredCardsData = cardsData.filter((card) => !card.isLeech);
      setCards(leechFilteredCardsData);

      const dueCards = leechFilteredCardsData.filter(
        (card) => card.nextReview <= new Date().getTime(),
      );
      if (dueCards.length === 0) {
        noDueCards();
      } else {
        setDueCards(dueCards);
      }
    }
    fetchDecks();
  }, []);

  useEffect(() => {
    const updateDB = async () => {
      await updateDoc(docRef, {
        cards: cards,
      });
    };

    if (isMounted.current) {
      updateDB();

      if (
        dueCards.length === 1 &&
        ((dueCards[currentIndex].consecGood > 0 && rating === 2) ||
          rating === 3)
      ) {
        setIsFinished(true);
      }
    } else {
      isMounted.current = true;
    }
  }, [cards]);

  function noDueCards() {
    const newDueCards = cards.filter((card) => !card.isGraduated);
    setDueCards(newDueCards);
    setCurrentIndex(0);
    handleFlipCard();
  }

  function handleNextCard() {
    if (dueCards.length > currentIndex + 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleFlipCard();
    } else {
      noDueCards();
    }
  }

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  });

  function handleReview(n) {
    setRating(n);
    const currTime = new Date().getTime();
    const currentCard = dueCards[currentIndex];
    const lastInterval = currentCard.lastInterval;
    const currLapses = currentCard.lapses;
    const currConsecGood = currentCard.consecGood;

    const intervals = [
      //in milliseconds
      60000, // 1 minute
      330000, // 5.5 minutes
      600000, // 10 minutes
      172800000, // 2 days
      86400000, // 1 days
    ];

    if (!currentCard.isGraduated) {
      const graduatedBool = (currConsecGood > 0 && n === 2) || n === 3;
      const consecGood = n === 2 && !graduatedBool ? currConsecGood + 1 : 0;

      const newInterval =
        n === 0 || n === 1
          ? intervals[n]
          : graduatedBool
          ? intervals[4]
          : !graduatedBool
          ? intervals[2]
          : n === 3
          ? intervals[3]
          : null;

      const nextReview = currTime + newInterval;

      const updatedReviewCard = {
        ...currentCard,
        isGraduated: graduatedBool,
        consecGood: consecGood,
        lastInterval: newInterval,
        nextReview: nextReview,
      };

      setCards((prev) => {
        const updatedCards = [...prev];
        updatedCards[currentCard.currIndex] = updatedReviewCard;
        return updatedCards;
      });
      console.log(cards);
    } else {
      var lapses = n === 0 ? lapses++ : lapses;

      const nextInterval =
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

      const updatedGradCard = {
        ...currentCard,
        nextReview: nextReview,
        lastInterval: nextInterval,
        lapses: lapses,
        isLeech: isLeech,
        lapsedStartingInterval: lapsedStartingInterval,
      };

      setCards((prev) => {
        const updatedCards = [...prev];
        updatedCards[currentCard.currIndex] = updatedGradCard;
        return updatedCards;
      });
    }
    handleNextCard();
  }

  return (
    <section class='bg-gray-900'>
      <div class='flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
        <div class=' w-full rounded-lg border border-gray-700 bg-gray-800 shadow-sm max-w-md md:mt-0 xl:p-0'>
          <div class='space-y-4 p-6 sm:p-8 md:space-y-6 flex flex-col'>
            {dueCards.length > 0 && !isFinished ? (
              <div class='flex justify-between text-gray-200'>
                {!isFlipped ? (
                  <div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].frontText}
                    </div>
                    <button
                      class='focus:outline-none focus:shadow-outline-indigo rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 active:bg-indigo-800'
                      onClick={handleFlipCard}
                    >
                      Flip Card
                    </button>
                  </div>
                ) : (
                  <div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].frontText}
                    </div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].backText}
                    </div>
                    <div class='flex justify-between'>
                      {buttonData.map((button) => (
                        <button
                          key={button.value}
                          class='m-2 focus:outline-none focus:shadow-outline-indigo rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 active:bg-indigo-800'
                          onClick={() => handleReview(button.value)}
                        >
                          {button.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div class='text-gray-200'>No Cards Due</div>
            )}
          </div>
        </div>
        <button
          class='focus:outline-none focus:shadow-outline-indigo rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 active:bg-indigo-800'
          onClick={() => navigate('/decks')}
        >
          Exit{' '}
        </button>
      </div>
    </section>
  );
}
export default App;
