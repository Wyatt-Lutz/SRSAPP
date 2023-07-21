import React from 'react';
import { auth, app } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';
import Buttons from '../../components/Buttons.jsx';
import { fetchDecks, deleteDeck } from './getDecks.js';

function App() {
  const Button = React.memo(Buttons);
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) {
    navigate('/');
  }
  const decks = fetchDecks(user.uid);

  return (
    <section class='bg-gray-900'>
      <div class='flex flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0'>
        <div class='w-full max-w-xl overflow-hidden rounded-lg bg-gray-800 shadow-lg'>
          <div class='p-6'>
            <div class='flex justify-between'>
              <h1 class='mb-2 mt-2 text-center text-4xl font-bold text-indigo-400'>
                Your Decks
              </h1>
              <Button
                color='indigo'
                text='Create Deck'
                onClick={() => navigate('/decks/create')}
              />
            </div>
            <div class='mb-6'></div>
            {decks.map((deck) => (
              <div key={deck.id} class='mb-7 rounded-lg bg-gray-700'>
                <div class='p-4'>
                  <h2 class='mb-5 text-center text-xl font-bold text-white'>
                    {deck.name}
                  </h2>
                  <div class='mb-2 flex items-center justify-around'>
                    <Button
                      color='indigo'
                      text='Study'
                      onClick={() => navigate(`/decks/study?id=${deck.id}`)}
                    />

                    <Button
                      color='gray'
                      text='Edit'
                      onClick={() => navigate(`/decks/edit?id=${deck.id}`)}
                    />

                    <Button
                      color='red'
                      text='Delete'
                      onClick={deleteDeck(user.uid, deck.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default App;