import React, { useState } from 'react';
import { getDoc, collection, doc, setDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';

import { useNavigate, Input, ParagraphInput, Button, useForm, toast, db, auth, app } from '../imports.js';






//xX8%*c8T!Kc$5C%
function App() {

  const [isOpen, setIsOpen] = useState(true);

  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();
  const user = auth.currentUser;





  const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const deckID = useState(guid())[0];

  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckID);






  async function createCard(front, back) {

    const snap = await getDoc(docRef);
    const cardID = guid();

    if(!snap.exists() ) {
      toast.error('The deck doesn\'t exist.');
      return;
    }



    const docData = snap.data();
    const isDupe = docData.cards?.find(card => card.frontText === front && card.backText === back);
    if (isDupe) {
      toast.error('A duplicate card already exists.');
      return;
    }

    //const currIndex = docData.cards?.length || 0;

    const newCard = {
      frontText: front,
      backText: back,
      isGraduated: false,
      nextReview: Date.now(),
      lastInterval: 60000,
      lapses: 0,
      isLeech: false,
      isNew: true,
      cardID: cardID,
    };


    console.log(newCard, docRef);
    await updateDoc(docRef, {
      cards: arrayUnion(newCard),
    });




    reset({ FrontText: '', BackText: '' });
  }


  const onNameSubmit = async ({ DeckName }) => {
    setIsOpen(false);
    console.log(DeckName);
    await setDoc(docRef, {
      name: DeckName,
      retained: 0,
      studied: 0,
      start: new Date().getTime(),
    });
  };

  const onCardSubmit = ({ FrontText, BackText }) => {
    createCard(FrontText, BackText);
    reset({ FrontText: '', BackText: '' });
  }

  function onFinish() {
    navigate('/decks');
  }

  return (
    <section className="flex h-screen flex-col justify-center">

      {isOpen ? (
        <div className="flex items-center justify-center h-screen bg-transparent" isOpen={isOpen}>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700 w-full max-w-md space-y-6 py-8 shadow-lg">
              <h1 className='font-bold text-3xl text-indigo-400'>Enter Deck Name</h1>
              <form className="space-y-4 px-6" onSubmit={handleSubmit(onNameSubmit)}>
                <Input register={register} name='DeckName' placeholder="Deck Name"/>

                <button className='shadow-indigo-500/50 shadow-2xl w-full rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => setIsOpen(true)}>Continue</button>



              </form>
            </div>
        </div>
      ) : null}





      {isOpen ? null : (

        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <div className="rounded-lg bg-gray-700 p-6 shadow-2xl">
              <div className='flex pb-3 justify-between'>
                  <div className="text-3xl text-center font-bold text-white">Create a Card</div>



                  <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={onFinish}>Finish Deck</button>

              </div>
              <form onSubmit={handleSubmit(onCardSubmit)} className='space-y-4 flex flex-col' >

                <div className="space-y-6">
                  <ParagraphInput register={register} name='FrontText' placeholder="Front Text" />
                  <ParagraphInput register={register} name="BackText" placeholder="Back Text" />

                </div>

                <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>Add Card</button>
              </form>


            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default App;