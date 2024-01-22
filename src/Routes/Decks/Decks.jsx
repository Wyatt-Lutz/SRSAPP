import React, { useEffect, useState } from 'react';

import { auth, useNavigate, LoadingOverlays, Block} from '../../imports.js';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { collection, query, doc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';

import { db } from '../../imports.js';

function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const queryClient = useQueryClient();

  const [settingsOpen, setSettingsOpen] = useState(null);


  //const { data: decks, isLoading, isError } = useQuery('decksKey', () => fetchDecks(user.uid));
  const { data: decks, isLoading, isError, error } = useQuery({
    queryKey: ['deckQueryKey'],
    queryFn: () => fetchDecks(user.uid),
  });

  const deleteDeckMutation = useMutation((deckId) => deleteDeck(user.uid, deckId), {
    onSuccess: () => {
      queryClient.invalidateQueries('deckQueryKey');
    },
  }
  );

  if (isLoading) {
    return <LoadingOverlays isLoading={true} />
  }
  if (isError) {
    return <p>Error: {error.message}</p>
  }

  async function getNumberDue(cardsData) {
    const currTime = new Date().getTime();
    let dueCount = 0;
    let newCount = 0;
    cardsData.forEach((card) => {
      if (card.nextReview < currTime) {
        dueCount++;
      }
      if (card.isNew) {
        newCount++
      }
    })
    dueCount = dueCount.toString();
    newCount = newCount.toString();
    return { dueCount, newCount };

  }


  async function fetchDecks(userId) {
    const decksRef = collection(db, 'users', userId, 'decks');
    const decksQuery = query(decksRef);
    const snapshot = await getDocs(decksQuery);


    const fetchedDecks = snapshot.docs.map((doc) => {
      const { dueCount, newCount } = getNumberDue(doc.data().cards);
      console.log(dueCount);

      return {
        id: doc.id,
        name: doc.data().name,
        dueCount: dueCount,
        newCount: newCount
      }

    });
    return fetchedDecks;
  }

  async function deleteDeck(userId, deckId) {
    const deckRef = doc(collection(db, 'users', userId, 'decks'), deckId);
    await deleteDoc(deckRef);
  }




  function handleButtonClick(action, deckId, e) {
    e.preventDefault();
    switch (action) {
      case 'study':
        navigate(`/decks/study?id=${deckId}`);
        break;
      case 'edit':
        navigate(`/decks/edit?id=${deckId}`);
        break;
      case 'delete':
        deleteDeckMutation.mutate(deckId);
        break;
      case 'create':
        navigate('/decks/create');
        break;
      case 'settings':
        setSettingsOpen((prev) => (prev === deckId ? null : deckId));
        break;
    }
  }




  return (
  <Block width='w-2/5'>
    <div className='flex justify-between mb-3'>
      <div className='text-center text-4xl font-bold text-indigo-400'>
        Your Decks
      </div>
      <button
        className='shadow-indigo-500/50 duration-200 shadow-2xl rounded-lg bg-indigo-500 px-5 py-3 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'
        onClick={(e) => handleButtonClick('create', null, e)(e)}
      >
        Create Deck
      </button>


    </div>

    {decks.length === 0 && <div>You don't have any decks created🤣🤣🤣</div>}


    {decks.length != 0 &&(
          <div className='flex mb-2'>
          <div className='indent-64 text-lg font-bold text-white '>
            Learn
          </div>
          <div className='indent-8 text-lg font-bold text-white'>
            Due
          </div>
        </div>

    )}



    {decks.map((deck) => (
      <div key={deck.id} onClick={(e) => {handleButtonClick('study', deck.id, e)(e)}} className='flex duration-200 border-4 border-gray-500 justify-around min-h-14 group/edit mb-6 hover:bg-slate-700 group/item rounded-lg bg-gray-600'>

        <div className='text-2xl font-bold text-white'>
            {deck.name}
          </div>


          <div className=''>
            <div className='text-white'>
              {deck.newCount}
            </div>
            <div className='text-white'>
              {deck.dueCount}
            </div>

          </div>

          <div className={`invisible group-hover/item:visible ${settingsOpen === deck.id ? 'visible' : ''}`} onClick={(e) => {e.stopPropagation()(e)}}>


            <div className='flex items-center justify-center p-2'>
              <button className='hover:rotate-90 transition duration-500' onClick={(e) => {handleButtonClick('settings', deck.id, e)(e)}}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 24 24">
                  <path d="M 9.6660156 2 L 9.1757812 4.5234375 C 8.3516137 4.8342536 7.5947862 5.2699307 6.9316406 5.8144531 L 4.5078125 4.9785156 L 2.171875 9.0214844 L 4.1132812 10.708984 C 4.0386488 11.16721 4 11.591845 4 12 C 4 12.408768 4.0398071 12.832626 4.1132812 13.291016 L 4.1132812 13.292969 L 2.171875 14.980469 L 4.5078125 19.021484 L 6.9296875 18.1875 C 7.5928951 18.732319 8.3514346 19.165567 9.1757812 19.476562 L 9.6660156 22 L 14.333984 22 L 14.824219 19.476562 C 15.648925 19.165543 16.404903 18.73057 17.068359 18.185547 L 19.492188 19.021484 L 21.826172 14.980469 L 19.886719 13.291016 C 19.961351 12.83279 20 12.408155 20 12 C 20 11.592457 19.96113 11.168374 19.886719 10.710938 L 19.886719 10.708984 L 21.828125 9.0195312 L 19.492188 4.9785156 L 17.070312 5.8125 C 16.407106 5.2676813 15.648565 4.8344327 14.824219 4.5234375 L 14.333984 2 L 9.6660156 2 z M 11.314453 4 L 12.685547 4 L 13.074219 6 L 14.117188 6.3945312 C 14.745852 6.63147 15.310672 6.9567546 15.800781 7.359375 L 16.664062 8.0664062 L 18.585938 7.40625 L 19.271484 8.5917969 L 17.736328 9.9277344 L 17.912109 11.027344 L 17.912109 11.029297 C 17.973258 11.404235 18 11.718768 18 12 C 18 12.281232 17.973259 12.595718 17.912109 12.970703 L 17.734375 14.070312 L 19.269531 15.40625 L 18.583984 16.59375 L 16.664062 15.931641 L 15.798828 16.640625 C 15.308719 17.043245 14.745852 17.36853 14.117188 17.605469 L 14.115234 17.605469 L 13.072266 18 L 12.683594 20 L 11.314453 20 L 10.925781 18 L 9.8828125 17.605469 C 9.2541467 17.36853 8.6893282 17.043245 8.1992188 16.640625 L 7.3359375 15.933594 L 5.4140625 16.59375 L 4.7285156 15.408203 L 6.265625 14.070312 L 6.0878906 12.974609 L 6.0878906 12.972656 C 6.0276183 12.596088 6 12.280673 6 12 C 6 11.718768 6.026742 11.404282 6.0878906 11.029297 L 6.265625 9.9296875 L 4.7285156 8.59375 L 5.4140625 7.40625 L 7.3359375 8.0683594 L 8.1992188 7.359375 C 8.6893282 6.9567546 9.2541467 6.6314701 9.8828125 6.3945312 L 10.925781 6 L 11.314453 4 z M 12 8 C 9.8034768 8 8 9.8034768 8 12 C 8 14.196523 9.8034768 16 12 16 C 14.196523 16 16 14.196523 16 12 C 16 9.8034768 14.196523 8 12 8 z M 12 10 C 13.111477 10 14 10.888523 14 12 C 14 13.111477 13.111477 14 12 14 C 10.888523 14 10 13.111477 10 12 C 10 10.888523 10.888523 10 12 10 z"></path>
                </svg>
              </button>
              {settingsOpen === deck.id && (
                <div className='flex transition translate-y-1 border rounded-lg bg-gray-800 border-gray-900'>
                  <button className='bg-indigo-500 duration-200 text-s mx-2 p-2 font-bold text-white rounded-lg' onClick={(e) => handleButtonClick('edit', deck.id, e)(e)}>
                    Edit
                  </button>
                  <button className='bg-red-500 text-s duration-200 p-2 mx-2 font-bold text-white rounded-lg' onClick={(e) => handleButtonClick('delete', deck.id, e)(e)}>
                    Delete
                  </button>
                </div>

              )}




            </div>
          </div>
        </div>




    ))}
  </Block>

  );

}
export default App;
