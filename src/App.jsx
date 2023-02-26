import React, { Suspense, lazy } from "react"
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";


function Layout() {
  return(
    <>
        <Outlet />
    </>
  )
}




export default function App() {
  const loading = () => (
    <div>
      Loading...
    </div>
  );

  const Signin = lazy(() => import('./components/Signin.jsx'));
  const Signup = lazy(() => import('./components/Signup.jsx'));
  const Settings = lazy(() => import('./components/Settings.jsx'));
  const Back = lazy(() => import('./components/Back.jsx'));
  const Front = lazy(() => import('./components/Front.jsx'));
  const Menu = lazy(() => import('./components/Menu.jsx'));
  const DeckCreation = lazy(() => import('./components/DeckCreation.jsx'));
  const Home = lazy(() => import('./components/Home.jsx'));
  const Decks = lazy(() => import('./components/Decks.jsx'));
  





  return(
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
    
            <Route path='/' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/home' element={<Home />} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/front' element={<Front />} />
            <Route path='/back' element={<Back />} />
            <Route path='/createDeck' element={<DeckCreation />} />
            <Route path='/decks' element={<Decks />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}