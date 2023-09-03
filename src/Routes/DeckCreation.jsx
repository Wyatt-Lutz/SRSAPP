import React, { useEffect, useState } from 'react';
import {
  getDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import ReactModal from 'react-modal';
import { db, auth, app } from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import Inputs from '../components/Inputs.jsx';
import Buttons from '../components/Buttons.jsx';
import { useForm } from 'react-hook-form';

ReactModal.setAppElement('#root');
//xX8%*c8T!Kc$5C%
function App() {
  const [cardData, setCardData] = useState({
    frontValue: '',
    backValue: '',
    nameValue: '',
  });
  const [tempCardData, setTempCardData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);

  const navigate = useNavigate();
  const user = auth.currentUser;
  const { register, handleSubmit } = useForm();
  const Button = React.memo(Buttons);
  const Input = React.memo(Inputs);
  const guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const localID = useState(guid())[0];

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    setIsOpen(true);
  }, []);

  const handleAddCard = async () => {
    let frontVal = cardData.frontValue;
    let backVal = cardData.backValue;
    let nameVal = cardData.nameValue;

    if (!frontVal || !backVal || !nameVal) {
      alert('please enter data');
      return;
    }

    const newCard = {
      frontText: frontVal,
      backText: backVal,
      isGraduated: false,
      nextReview: Date.now(),
      lastInterval: 60000,
      lapses: 0,
      isLeech: false,
      consecGood: 0,
      currIndex: currIndex,
      lapsedStartingInterval: 0,

    };

    
    const docRef = doc(collection(db, 'users', user.uid, 'decks'), localID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const currCardData = snap.data().cards;
      await updateDoc(docRef, {
        cards: [...currCardData, newCard],
      });
    } else {
      await setDoc(docRef, {
        name: nameVal,
        cards: [newCard],
      });
    }
    setCurrIndex(currIndex + 1);

    setTempCardData((prev) => {
      const newData = [...prev, newCard];
      return newData;
    });

    setCardData((prevState) => ({
      ...prevState,
      frontValue: '',
      backValue: '',
    }));
  };

  const handleFinishDeck = async () => {
    //Could make some save popup just for ux
    navigate('/decks');
  };

  const onSubmit = (data) => {
    const parsedData = JSON.parse(JSON.stringify(data));
    const deckName = parsedData.DeckName;
    cardData.nameValue = deckName;


  };

  return (
    <section class="flex h-screen flex-col justify-center">
      {isOpen ? (
        <ReactModal
          className="flex items-center justify-center h-screen"
          isOpen={isOpen}
        >
          
          <div class="flex h-1/4 w-2/5 flex-col items-center justify-center rounded-lg bg-gray-700 p-8 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input register={register} name='DeckName' />

              <Button color='indigo' text='continue' isLong={true} onClick={() => setIsOpen(false)} />

            </form>

          </div>
        </ReactModal>
      ) : null}
      {isOpen ? null : (
        <>
          <div class="flex justify-center items-center h-1/6">
            <h1 class="text-5xl font-bold text-white">{cardData.nameValue}</h1>
          </div>
          <div class="flex items-center justify-center divide-x">
            <div class="flex flex-col w-1/3">
              <div class="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow">
                <h1 class="text-3xl font-bold text-white">Create a Card</h1>
       
                  <form className="space-y-6">
                      <Input register={register} name='FrontText' />
                      <Input register={register} name="BackText" />
                      <div className='flex justify-between '>
                      <Button color='indigo' text='Add Card' onClick={handleAddCard} />
                      <Button color='indigo' text='Finish Deck' onClick={handleFinishDeck}/>

                      </div>

      


                  </form>
    
              </div>
            </div>
            <div class="p-4 m-4">
              <h1 class="text-2xl font-bold text-indigo-400">Current Cards</h1>
              {tempCardData.map((card, index) => (
                <div className="grid space-y-4 p-6">
                  <div
                    key={index}
                    className="rounded-lg border border-gray-700 bg-gray-800 shadow"
                  >
                    <div className="space-y-6 p-4">
                      <div>
                        <p className="text-2xl font-bold text-indigo-400">
                          {card.frontText}
                        </p>
                      </div>
                      <div>
                        <p className="text-l font-bold text-white">
                          {card.backText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
export default App;