import React, { useEffect, useState } from 'react';
import { doc, collection, getDoc, setDoc } from 'firebase/firestore';


import { db, auth, app, useForm, toast, ParagraphInputs, Buttons, useNavigate, ReactModal } from '../imports.js';

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
  const { register, handleSubmit } = useForm();
  const Button = React.memo(Buttons);
  const ParagraphInput = React.memo(ParagraphInputs);


  useEffect(() => {
    if (!user) {
      navigate('/');
    }

    async function fetchData() {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error('deck not found');
        return;
      }

      const deckData = docSnap.data();
      const cardsData = deckData.cards.map((card) => ({ frontText: card.frontText, backText: card.backText }));
      setCards(cardsData);

    }

    
    fetchData();
  }, []);


  async function onEditSubmit (data, index) {
    const front = data.frontText;
    const back = data.backText;

    
    setCards((prev) => {
  
    
      prev[index].frontText = front;
      prev[index].backText = back;
      return [...prev];
    });
    handleEdit(index, false);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('deck not found');
      return;
    }
    const deckData = docSnap.data();
    deckData.cards[index].frontText = front;
    deckData.cards[index].backText = back;
    await setDoc(docRef, deckData, { merge: true });

  }

  async function onNewCardSubmit (data) {
    setIsOpen(false);
    const newCard = {
      frontText: data.frontText,
      backText: data.backText,
    }

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('deck not found');
      return;
    }
    const deckData = docSnap.data();
    const newDeckData = [...deckData, newCard];
    await setDoc(docRef, newDeckData, { merge: true });


  }

  function handleEdit(index, bool) {
    setIsEdit((prev) => {
      prev[index] = bool;
      return [...prev];
    });

  }

  async function handleDelete(index) {

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('doc doenst exist');
      return;
    }
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

  return (
    <section>
      {isOpen ? (

                <div className="flex bg-transparent h-screen items-center justify-center" isOpen={isOpen}>
              
                  <div className="rounded-lg bg-gray-700 p-6 shadow-2xl">
                  <div className="text-3xl text-center font-bold text-white">Create a Card</div>

                    <form onSubmit={handleSubmit(onNewCardSubmit)} className='space-y-4 flex flex-col' >
      
                      <div className="space-y-6">
                        <ParagraphInput register={register} name='frontText' placeholder="Front Text" />
                        <ParagraphInput register={register} name="backText" placeholder="Back Text" />
      
                      </div>
                      <Button color='indigo' text='Add Card'/>
                    </form>
      
             
                  </div>
                
              </div>
      ) : null}
      

      <div class="flex flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0">
        <div class="w-full max-w-xl overflow-hidden rounded-lg bg-gray-700 shadow-lg">
          <div class="p-6">
            <div class="flex justify-between">
              <h1 class="mb-2 mt-2 text-center text-4xl font-bold text-indigo-400">
                Edit Deck
              </h1>
            </div>

            {cards.map((card, index) => (
              
              <div key={card.id} class="mb-7 rounded-lg bg-gray-600">
                <div class="p-4">
                  <div>
                    {isEditing[index] ? (
                      <div class="flex flex-col">
                        <form onSubmit={(e) => {e.preventDefault(); handleSubmit((data) => onEditSubmit(data, index))(e)}}>
                          <ParagraphInput
                            register={register}
                            name='frontText'
                            defaultValue={cards[index].frontText}
                            
                          />
                          <ParagraphInput
                            register={register} 
                            name='backText'
                            defaultValue={cards[index].backText}
                            
                          />
                          <Button
                            color="indigo"
                            text="Save"
                          />
                        </form>
                        
                      </div>
                    ) : (
                      <div class="flex flex-col font-bold text-2xl ml-3">
                        <div class="whitespace-pre-wrap mb-5 font-bold text-indigo-400">
                          {card.frontText}
                        </div>
                        <div class="mb-3 whitespace-pre-wrap text-white">
                          {card.backText}
                        </div>
                        <div class="flex justify-between">
                          <Button
                            onClick={() => handleEdit(index, true)}
                            color="indigo"
                            text="Edit"
                          />

                          <Button
                            onClick={() => handleDelete(index)}
                            color="red"
                            text="Delete"
                      
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              color="indigo"
              text="Finish"
              onClick={() => navigate('/decks')}
            />
            <Button
              onClick={() => setIsOpen(true)}
              text="Create New Card"
              color="indigo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default App;