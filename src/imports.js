import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Inputs from './components/inputs/Inputs.jsx';
import ParagraphInputs from './components/inputs/ParagraphInputs.jsx';
import PasswordInputs from './components/inputs/PasswordInputs.jsx';
import Buttons from './components/Buttons.jsx';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

const firebaseConfig = {
  apiKey: 'AIzaSyBu1ALA2a6W2CF_3GXhFCwL_yUSFare5qg',
  authDomain: 'srsappv2.firebaseapp.com',
  projectId: 'srsappv2',
  storageBucket: 'srsappv2.appspot.com',
  messagingSenderId: '814430664725',
  appId: '1:814430664725:web:51f71304f5a33a8cbb761c',
  measurementId: 'G-P9NFXSNWG1',
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


export { db, auth, app, useForm, toast, Inputs, ParagraphInputs, PasswordInputs, Buttons, useNavigate, ReactModal };

