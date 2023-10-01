import React, { useState } from 'react';
import { getDoc, collection, doc, setDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import ReactModal from 'react-modal';
import { db, auth, app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import Inputs from '../components/inputs/Inputs.jsx';
import ParagraphInputs from '../components/inputs/ParagraphInputs.jsx';
import Buttons from '../components/Buttons.jsx';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



ReactModal.setAppElement('#root');
//xX8%*c8T!Kc$5C%
function App() {

  const [isOpen, setIsOpen] = useState(true);
  const [currIndex, setCurrIndex] = useState(0);
  const { register, handleSubmit, reset } = useForm();

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

    if(!snap.exists() ) {
      toast.error('The deck doesn\'t exist.');
      return;
    }
    const docData = snap.data();
    if (docData.cards) {
      const isDupe = docData.cards.some((card) => card.frontText === front && card.backText === back);
      if (isDupe) {
        toast.error('A duplicate card already exists.');
        return;
      }
    }

    reset({ FrontText: '', BackText: '' });

    await updateDoc(docRef, {
      cards: arrayUnion(newCard),
    });
    setCurrIndex(currIndex + 1);
 
   



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
    reset({ FrontText: '', BackText: '' });

  }

  return (
    <section className="flex h-screen flex-col justify-center">
      {isOpen ? (
        <div className="flex items-center justify-center h-screen bg-transparent" isOpen={isOpen}>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-700 w-full max-w-md space-y-6 py-8 shadow-lg">
              <h1 className='font-bold text-3xl text-indigo-400'>Enter Deck Name</h1>
              <form className="space-y-4 px-6" onSubmit={handleSubmit(onNameSubmit)}>
                <Input register={register} name='DeckName' placeholder="Deck Name"/>
                <Button color='indigo' text='Continue' isLong={true} />
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
          
                  
                  <Button color='indigo' text='Finish Deck' onClick={finishDeck} />
              </div>
              <form onSubmit={handleSubmit(onCardSubmit)} className='space-y-4 flex flex-col' >

                <div className="space-y-6">
                  <ParagraphInput register={register} name='FrontText' placeholder="Front Text" />
                  <ParagraphInput register={register} name="BackText" placeholder="Back Text" />

                </div>
                <Button color='indigo' text='Add Card'/>
              </form>
              <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default App;