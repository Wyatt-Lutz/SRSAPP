import React, { useEffect, useState } from 'react';
import { doc, collection, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';


import { db, auth, app, useForm, toast, ParagraphInput, Button, useNavigate, ReactModal } from '../imports.js';

ReactModal.setAppElement('#root');

function App() {
  const [cards, setCards] = useState([]);
  const [isEditing, setIsEdit] = useState(Array(cards.length).fill(false));
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const user = auth.currentUser;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const deckId = urlParams.get('id');
  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckId);
  const { register, handleSubmit, reset } = useForm();



  useEffect(() => {

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
    const front = data.editFrontText;
    const back = data.editBackText;

    
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
    console.log('new card func ran');
    setIsOpen(false);
    reset({ frontText: '', backText: '' });
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error('deck not found');
      return;
    }
    const deckData = docSnap.data();

    
    const newCard = {
      frontText: data.createFrontText,
      backText: data.createBackText,
      isGraduated: false,
      nextReview: Date.now(),
      lastInterval: 60000,
      lapses: 0,
      isLeech: false,
      cardIndex: deckData.cards.length,
      lapsedStartingInterval: 0,
    };
    setCards((prevCards) => [...prevCards, newCard]);
    
    
    await updateDoc(docRef, {
      cards: arrayUnion(newCard),
    });

  }

  function handleEdit(index, bool) {
    setIsEdit((prev) => {
      prev[index] = bool;
      return [...prev];
    });

  }

  async function handleDelete(index) {
    console.log(index)

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('doc doenst exist');
      return;
    }
    const deckData = docSnap.data();
    const cardsData = deckData.cards.filter(
      (card) => card.cardIndex !== index
    );
    await setDoc(docRef, { cards: cardsData }, { merge: true });


    setCards(cardsData);


  }


  return (
    <section>
      {isOpen ? (

                <div className="flex bg-transparent h-screen items-center justify-center" isOpen={isOpen}>
              
                  <div className="rounded-lg bg-gray-700 p-6 shadow-2xl">
                  <div className="text-3xl text-center font-bold text-white">Create a Card</div>

                    <form onSubmit={handleSubmit(onNewCardSubmit)} className='space-y-4 flex flex-col' >
      
                      <div className="space-y-6">
                        <ParagraphInput register={register} defaultValue="" name='createFrontText' placeholder="Front Text" />
                        <ParagraphInput register={register} defaultValue="" name="createBackText" placeholder="Back Text" />
      
                      </div>
                      <Button color='indigo' text='Add Card'/>
                    </form>
      
             
                  </div>
                
              </div>
      ) : null}
      

      <div className="flex flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0">
        <div className="w-full max-w-xl overflow-hidden rounded-lg bg-gray-700 shadow-lg">
          <div className="p-6">
            <div className="flex justify-between">
              <h1 className="mb-2 mt-2 text-center text-4xl font-bold text-indigo-400">
                Edit Deck
              </h1>
            </div>

            {cards.map((card, index) => (
            
              
              <div key={card.id} className="mb-7 rounded-lg bg-gray-600">
                <div className="p-4">
                  <div>
                    {isEditing[index] ? (
                      <div className="flex flex-col">
                        <form onSubmit={(e) => {e.preventDefault(); handleSubmit((data) => onEditSubmit(data, index))(e)}}>
                          <ParagraphInput
                            register={register}
                            name='editFrontText'
                            defaultValue={cards[index].frontText}
                            
                          />
                          <ParagraphInput
                            register={register} 
                            name='editBackText'
                            defaultValue={cards[index].backText}
                            
                          />
                          <Button
                            color="indigo"
                            text="Save"
                          />
                        </form>
                        
                      </div>
                    ) : (
                      <div className="flex flex-col font-bold text-2xl ml-3">
                        <div className="whitespace-pre-wrap mb-5 font-bold text-indigo-400">
                          {card.frontText}
                        </div>
                        <div className="mb-3 whitespace-pre-wrap text-white">
                          {card.backText}
                        </div>
                        <div className="flex justify-between">
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