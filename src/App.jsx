import React, { Suspense, lazy, Profiler } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';

const Signin = lazy(() => import('./Routes/Signin/Signin.jsx'));
const Signup = lazy(() => import('./Routes/Signup.jsx'));
const Cards = lazy(() => import('./Routes//Cards/Cards.jsx'));
const DeckCreation = lazy(() => import('./Routes/DeckCreation.jsx'));
const Decks = lazy(() => import('./Routes/Decks/Decks.jsx'));
const DeckEditation = lazy(() => import('./Routes/DeckEditation.jsx'));


const App = () => {
  return (
    <Profiler id="App">
        <Layout />
          <Suspense>
            <Routes>
              <Route path="/" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="decks">
                <Route index element={<Decks />} />
                <Route path="create" element={<DeckCreation />} />
                <Route path="study" element={<Cards />} />
                <Route path="edit" element={<DeckEditation />} />
              </Route>
            </Routes>
          </Suspense>
    </Profiler>
  );
};

export default App;
