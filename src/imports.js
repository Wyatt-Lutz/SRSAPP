import { initializeApp } from 'firebase/app';
import { browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Input from './components/inputs/Input.jsx';
import ParagraphInput from './components/inputs/ParagraphInput.jsx';
import PasswordInput from './components/inputs/PasswordInput.jsx';
import Button from './components/Button.jsx';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import LoadingOverlays from './components/LoadingOverlays.jsx';
import Block from './components/Block.jsx'

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
await setPersistence(auth, browserSessionPersistence);



export { db, auth, app, Block, useForm, toast, Input, ParagraphInput, PasswordInput, Button, useNavigate, ReactModal, LoadingOverlays };

