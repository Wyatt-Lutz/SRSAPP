import React, { useEffect, useState } from 'react';
import { doc, collection, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, app } from '../firebase.js';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';

ReactModal.setAppElement('#root');

function App() {
  const [cards, setCards] = useState([]);
  const [isEditing, setIsEdit] = useState(Array(cards.length).fill(false));
  const [textFields, setTextFields] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newValues, setNewValues] = useState({ frontText: '', backText: '' });

  const navigate = useNavigate();
  const user = auth.currentUser;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const deckId = urlParams.get('id');
  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckId);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const deckData = docSnap.data();
        const cardsData = deckData.cards.map((card) => ({ ...card }));
        setCards(cardsData);
        setTextFields(
          cardsData.map((card) => ({
            frontText: card.frontText,
            backText: card.backText,
          }))
        );
      } else {
        console.error('deck not found');
      }
    };
    fetchData();
  }, []);

  function handleEdit(index) {
    setIsEdit((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  }

  async function handleDelete(index) {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const deckData = docSnap.data();
      const cardsData = deckData.cards.filter(
        (cardIndex) => cardIndex !== index
      );
      await setDoc(docRef, { cards: cardsData }, { merge: true });
      setCards(cardsData);
      setTextFields(
        cardsData.map((card) => ({
          frontText: card.frontText,
          backText: card.backText,
        }))
      );
    } else {
      alert('doc doenst exist');
    }
  }

  async function createNewCard() {
    const newCardData = {
      frontText: newValues.frontText,
      backText: newValues.backText,
    };
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const deckData = docSnap.data();
      const newCardsData = [...deckData.cards, newCardData];
      await setDoc(docRef, { cards: newCardsData }, { merge: true });
      setCards(newCardsData);
      setTextFields(
        newCardsData.map((card) => ({
          frontText: card.frontText,
          backText: card.backText,
        }))
      ); //Can this be optimized?
    } else {
      console.error('deck not found');
    }
    setIsOpen(false);
  }

  function handleTextChange(index, side, event) {
    if (index < 0 || index >= textFields.length) {
      console.log('error on handleTextChange');
      return;
    }
    const newFields = [...textFields];
    side === 1
      ? (newFields[index].frontText = event.target.value)
      : (newFields[index].backText = event.target.value);
    setTextFields(newFields);
  }

  async function handleSave(index, event) {
    event.preventDefault();

    setIsEdit((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });

    setCards((prev) => {
      const newCards = [...prev];
      newCards[index].frontText = textFields[index].frontText;
      newCards[index].backText = textFields[index].backText;
      return newCards;
    });

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const deckData = docSnap.data();
      const cardsData = [...deckData.cards];
      cardsData[index].frontText = textFields[index].frontText;
      cardsData[index].backText = textFields[index].backText;
      await setDoc(docRef, { cards: cardsData }, { merge: true });
    } else {
      console.error('deck not found');
    }
  }

  return (
    <section>
      <ReactModal
        className="flex items-center justify-center h-screen"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-2/4 h-1/3 flex flex-col flex-items-center justify-center">
          <label class="text-2xl mb-2 block font-semibold text-indigo-300">
            Front
          </label>
          <input
            onChange={(e) => {
              setNewValues({ ...newValues, frontText: e.target.value });
            }}
            value={newValues.frontText}
            class="w-full appearance-none rounded border border-gray-400 bg-gray-500 py-2 px-3 mb-2 text-sm text-white"
          />
          <label class="text-2xl mb-2 block font-semibold text-indigo-300">
            Back
          </label>
          <input
            onChange={(e) => {
              setNewValues({ ...newValues, backText: e.target.value });
            }}
            value={newValues.backText}
            class="w-full appearance-none rounded border border-gray-400 bg-gray-500 py-2 px-3 mb-2 text-sm text-white"
          />
          <button
            class="rounded-lg bg-indigo-400 p-2 m-3 text-gray-800"
            onClick={createNewCard}
          >
            OK
          </button>
        </div>
      </ReactModal>

      <div class="flex flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0">
        <div class="w-full max-w-xl overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          <div class="p-6">
            <div class="flex justify-between">
              <h1 class="mb-2 mt-2 text-center text-4xl font-bold text-indigo-400">
                Edit Deck: {cards.deckName}
              </h1>
            </div>

            {cards.map((card, index) => (
              <div key={card.id} class="mb-7 rounded-lg bg-gray-700">
                <div class="p-4">
                  <div>
                    {isEditing[index] ? (
                      <div class="flex flex-col">
                        <input
                          class="mb-4 font-bold w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-2xl text-indigo-400"
                          type="text"
                          value={textFields[index].frontText}
                          onChange={(e) => handleTextChange(index, 1, e)}
                        ></input>
                        <input
                          class="mb-4 font-bold w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-lg text-white"
                          type="text"
                          value={textFields[index].backText}
                          onChange={(e) => handleTextChange(index, 2, e)}
                        ></input>
                        <button
                          onClick={(event) => handleSave(index, event)}
                          class="focus:shadow-outline-indigo mr-2 rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div class="flex flex-col">
                        <div class="mb-5 ml-3 text-2xl font-bold text-indigo-400">
                          {card.frontText}
                        </div>
                        <div class="mb-3 ml-3 flex text-white font-bold text-lg">
                          {card.backText}
                        </div>
                        <div class="flex justify-between">
                          <button
                            onClick={() => handleEdit(index)}
                            class="focus:shadow-outline-indigo mr-2 rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            class="focus:shadow-outline-red rounded-lg bg-red-500 px-5 py-2 text-xl font-bold text-white hover:bg-red-600 focus:outline-none active:bg-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              class="focus:shadow-outline-indigo mr-2 rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800"
              onClick={() => navigate('/decks')}
            >
              Finish
            </button>
            <button
              onClick={() => setIsOpen(true)}
              class="focus:shadow-outline-indigo mr-2 rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800"
            >
              Create New Card
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default App;