import React, { useEffect, useState, useRef} from 'react';
import { doc, collection, getDoc, setDoc, updateDoc, arrayUnion, query } from 'firebase/firestore';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { db, auth, useForm, toast, ParagraphInput, LoadingOverlays, useNavigate, ReactModal } from '../imports.js';

ReactModal.setAppElement('#root');

function App() {
  const [isEditing, setIsEdit] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();


  const navigate = useNavigate();
  const user = auth.currentUser;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const deckId = urlParams.get('id');
  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckId);

  const queryClient = useQueryClient();
  const hasMountedRef = useRef(false);




  const cardsQuery = useQuery({
    queryKey: ['cards'],
    queryFn: fetchData,
  });



  const editCardMutation = useMutation({
    mutationFn: (data, index) =>
      onEditSubmit(data, index),

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['cards']});
      }, 110);
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: index => {
      handleDelete(index);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['cards']});
      }, 120);
    }
  });

  const addCardMutation = useMutation({
    mutationFn: data => {
      onNewCardSubmit(data);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['cards']});
      }, 120);

    }
  })


  if (cardsQuery.isPending) {
    return <LoadingOverlays isLoading={true} />
  }

  if (cardsQuery.isError) {
    return <div>{cardsQuery.error.message}</div>
  }

//-143 -21



  async function fetchData() {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error('deck not found');
      return [];
    }
    const { cards } = docSnap?.data();
    console.log(cards.map( ({ frontText, backText, cardIndex }) => ({ frontText, backText, cardIndex }) ));
    return cards.map( ({ frontText, backText, cardIndex }) => ({ frontText, backText, cardIndex }) );

  }





  async function onEditSubmit({data, index}) {

      console.info('onEditSubmit ran');
      console.log(data);
      console.log(index);
      const newCards = [...cardsQuery.data];
      newCards[index] = { frontText: data.editFrontText, backText: data.editBackText };

      handleEdit(index, false);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error('deck not found');
        return;
      }
      const deckData = docSnap.data();
      deckData.cards[index] = { ...deckData.cards, frontText: data.editFrontText, backText: data.editBackText };
      console.log(deckData);
      await setDoc(docRef, deckData, { merge: true });

  }

  const onNewCardSubmit = async (data) => {
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
    };


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
    const { cards } = docSnap.data();
    const cardsData = cards.filter((card) => card.cardIndex !== index);
    console.log(cardsData);
    await setDoc(docRef, { cards: cardsData }, { merge: true });

  }



  return (
    <section>
      {isOpen ? (

                <div className="flex bg-transparent h-screen items-center justify-center" isOpen={isOpen}>

                  <div className="rounded-lg bg-gray-700 p-6 shadow-2xl">
                  <div className="text-3xl text-center font-bold text-white">Create a Card</div>

                    <form onSubmit={(e) => {e.preventDefault(); handleSubmit((data) => addCardMutation.mutate(data))(e)}} className='space-y-4 flex flex-col' >

                      <div className="space-y-6">
                        <ParagraphInput register={register} defaultValue="" name='createFrontText' placeholder="Front Text" />
                        <ParagraphInput register={register} defaultValue="" name="createBackText" placeholder="Back Text" />

                      </div>

                      <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>Add Card</button>
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

            {cardsQuery.data?.map((card) => (


              <div key={card.cardIndex} className="mb-7 rounded-lg bg-gray-600">
                <div className="p-4">
                  <div>
                    {isEditing[card.cardIndex] ? (
                      <div className="flex flex-col">
                        <form onSubmit={(e) => {e.preventDefault(); handleSubmit((data) => editCardMutation.mutate({data, index: card.cardIndex}))(e)}}>
                          <ParagraphInput
                            register={register}
                            name='editFrontText'
                            defaultValue={card.frontText}

                          />
                          <div>{card.cardIndex}</div>
                          <ParagraphInput
                            register={register}
                            name='editBackText'
                            defaultValue={card.backText}

                          />

                          <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>Save</button>
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

                          <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => handleEdit(card.cardIndex, true)}>Edit</button>
                          <button className='shadow-red-500/50 shadow-2xl rounded-lg bg-red-500 px-5 py-2 text-xl font-bold text-white hover:bg-red-600 focus:outline-none active:bg-red-800' onClick={() => deleteCardMutation.mutate(card.cardIndex)}>Delete</button>


                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}


            <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => navigate('/decks')}>Finish</button>
            <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => setIsOpen(true)}>Create New Card</button>



          </div>
        </div>
      </div>
    </section>
  );
}
export default App;