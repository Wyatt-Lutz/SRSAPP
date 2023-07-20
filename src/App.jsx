
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const Signin = lazy(() => import('./Routes/Signin/Signin.jsx'));
const Signup = lazy(() => import('./Routes/Signup.jsx'));
const Settings = lazy(() => import('./Routes/Settings.jsx'));
const Cards = lazy(() => import('./Routes/Cards.jsx'));
const DeckCreation = lazy(() => import('./Routes/DeckCreation.jsx'));
const Home = lazy(() => import('./Routes/Home.jsx'));
const Decks = lazy(() => import('./Routes/Decks/Decks.jsx'));
const DeckEditation = lazy(() => import('./Routes/DeckEditation.jsx'));



const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/home' element={<Home />} />
          <Route path='decks'>
            <Route index element={<Decks />} />
            <Route path='create' element={<DeckCreation />} />
            <Route path='study' element={<Cards />} />
            <Route path='edit' element={<DeckEditation />} />
          </Route>
          <Route path='/cards' element={<Cards />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
