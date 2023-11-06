import React, { useEffect, useState } from 'react';
import { fetchDecks, deleteDeck } from './deckLogic.js';
import { auth, useNavigate, LoadingOverlays } from '../../imports.js';
import { useQuery } from 'react-query';

function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;


  //const { data: decks, isLoading, isError } = useQuery('decksKey', () => fetchDecks(user.uid));
  const { data: decks, isLoading, isError, error } = useQuery({
    queryKey: ['deckQueryKey'],
    queryFn: () => fetchDecks(user.uid),
  })

  if (isLoading) {
    return <LoadingOverlays isLoading={true} />
  }
  if (isError) {
    return <p>Error: {error.message}</p>
  }


  
  function handleButtonClick(action, deckId) {
    switch (action) {
      case 'study':
        navigate(`/decks/study?id=${deckId}`);
        break;
      case 'edit':
        navigate(`/decks/edit?id=${deckId}`);
        break;
      case 'delete':
        deleteDeck(user.uid, deckId);
        break;
      case 'create':
        navigate('/decks/create');
        break;
    }
  }




  return (
<div className="flex flex-col items-center justify-center px-6 py-8 h-screen">
  <div className="w-full max-w-xl rounded-lg bg-gray-700 shadow-2xl">
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="mb-2 mt-2 text-center text-4xl font-bold text-indigo-400">
          Your Decks
        </h1>
        
        <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => handleButtonClick('create')}>Create Deck</button>




      </div>
      <div className="mb-3"></div>
      {decks.length === 0 && (
        <div>You don't have any decks created🤣🤣🤣</div>
      )}
      {decks.map((deck) => (
        <div key={deck.id} className="mb-7 rounded-lg bg-gray-600">
          <div className="p-4">
            <h2 className="mb-5 text-center text-xl font-bold text-white">
              {deck.name}
            </h2>
            <div className="mb-2 flex items-center justify-around">

            <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => handleButtonClick('study', deck.id)}>Study</button>
            <button className='shadow-gray-500/50 shadow-2xl rounded-lg bg-gray-500 px-5 py-2 text-xl font-bold text-white hover:bg-gray-600 focus:outline-none active:bg-gray-800' onClick={() => handleButtonClick('edit', deck.id)}>Edit</button>
            <button className='shadow-red-500/50 shadow-2xl rounded-lg bg-red-500 px-5 py-2 text-xl font-bold text-white hover:bg-red-600 focus:outline-none active:bg-red-800' onClick={() => handleButtonClick('delete', deck.id)}>Delete</button>
          

            
                


      




            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    
    

  

  );
}
export default App;
