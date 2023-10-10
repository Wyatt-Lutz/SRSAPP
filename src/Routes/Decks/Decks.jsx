import React, { useEffect, useState } from 'react';
import { fetchDecks, deleteDeck } from './getDecks.js';
import { auth, app, Button, useNavigate } from '../../imports.js';

function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    fetchDecks(user.uid).then((fetchedDecks) => {
      setDecks(fetchedDecks);
    });
  }, []);

  
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
  <div className="w-full max-w-xl overflow-hidden rounded-lg bg-gray-700 shadow-2xl">
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="mb-2 mt-2 text-center text-4xl font-bold text-indigo-400">
          Your Decks
        </h1>
        <Button text="Create Deck" color="indigo" onClick={() => handleButtonClick('create')} />



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

            <Button color="indigo" text="Study" onClick={() => handleButtonClick('study', deck.id)} />
            <Button color="gray" text="Edit" onClick={() => handleButtonClick('edit', deck.id)} />
            <Button color="red" text="Delete" onClick={() => handleButtonClick('delete', deck.id)} />
          

            
                


      




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
