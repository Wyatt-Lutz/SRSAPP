import React, { useState } from 'react';
import { getDoc, collection, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import ReactModal from 'react-modal';
import { db, auth, app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import Inputs from '../components/inputs/Inputs.jsx';
import ParagraphInputs from '../components/inputs/ParagraphInputs.jsx';
import Buttons from '../components/Buttons.jsx';
import { useForm } from 'react-hook-form';

ReactModal.setAppElement('#root');
//xX8%*c8T!Kc$5C%
function App() {

  const [isOpen, setIsOpen] = useState(true);
  const [currIndex, setCurrIndex] = useState(0);
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();
  const user = auth.currentUser;

  const Button = React.memo(Buttons);
  const Input = React.memo(Inputs);
  const ParagraphInput = React.memo(ParagraphInputs);


  
  const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const localID = useState(guid())[0];
  const docRef = doc(collection(db, 'users', user.uid, 'decks'), localID);






  async function createCard(front, back) {

    const newCard = {
      frontText: front,
      backText: back,
      isGraduated: false,
      nextReview: Date.now(),
      lastInterval: 60000,
      lapses: 0,
      isLeech: false,
      consecGood: 0,
      currIndex: currIndex,
      lapsedStartingInterval: 0,
    };


    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      await updateDoc(docRef, {
        cards: arrayUnion(newCard),
      });
      setCurrIndex(currIndex + 1);
    } else {
      console.error('deck doesnt exist');
    }
  }

  function finishDeck() {
    navigate('/decks');
  }

  const onNameSubmit = async (data) => {
    setIsOpen(false);
    const parsedData = JSON.parse(JSON.stringify(data));
    const deckName = parsedData.DeckName;
    await setDoc(docRef, {
      name: deckName,
    });
  };

  const onCardSubmit = (data) => {
    const parsedData = JSON.parse(JSON.stringify(data));
    const front = parsedData.FrontText;
    const back = parsedData.BackText;
    createCard(front, back);
  }

  return (
    <section className="flex h-screen flex-col justify-center">
      {isOpen ? (
        <ReactModal
          className="flex items-center justify-center h-screen bg-gray-500"
          isOpen={isOpen}
        >
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700 w-full max-w-md space-y-6 py-8 shadow-lg">
            <h1 className='font-bold text-3xl text-indigo-400'>Enter Deck Name</h1>
            <form className="space-y-4 px-6" onSubmit={handleSubmit(onNameSubmit)}>
              <Input register={register} name='DeckName' placeholder="Deck Name"/>
              <Button color='indigo' text='Continue' isLong={true} />
            </form>
          </div>
        </ReactModal>
      ) : null}



      {isOpen ? null : (
        <div className="flex items-center justify-center">
          <div className="flex flex-col">
            <div className="rounded-lg bg-gray-700 p-6 shadow-2xl">
              
              <form onSubmit={handleSubmit(onCardSubmit)} className='space-y-4' >
                <div className='flex justify-between'>
                  <div className="text-3xl font-bold text-white">Create a Card</div>
          
                  <Button color='indigo' text='Add Card'/>
                </div>
                <div className="space-y-6">
                  <ParagraphInput register={register} name='FrontText' placeholder="Front Text" />
                  <ParagraphInput register={register} name="BackText" placeholder="Back Text" />

                </div>
              </form>
              
              <div className='space-y-6 space-x-[150px]'>
                
                <Button color='indigo' text='Finish Deck' onClick={finishDeck} />
                <Button color='red' text="Cancel" onClick={finishDeck} />


              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default App;