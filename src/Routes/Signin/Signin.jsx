import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDoc, doc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

import { db, auth, app } from '../../firebase.js';
import { useForm } from 'react-hook-form';
import { issueCookie } from './cookies.js';
import { decodeCookie } from './cookies.js';

import Inputs from '../../components/Inputs.jsx';
import Buttons from '../../components/Buttons.jsx';
import LoadingOverlays from '../../components/LoadingOverlays.jsx';

export default function App() {
  const navigate = useNavigate();

  const Button = React.memo(Buttons);
  const Input = React.memo(Inputs);
  const checkboxRef = useRef(false);
  const isMounted = useRef(false);
  const servKey = getServKey();

  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isMounted.current) {
      if (document.cookie === '') {
        return;
      }

      setLoading(true);
      const getCookieData = async () => {
        const cookieData = await decodeCookie(servKey);
        const [email, password] = cookieData.split(',');
        signIn(email, password);
      };
      getCookieData();
    } else {
      isMounted.current = false;
    }
  }, []);

  async function getServKey() {
    const keyDocRef = doc(collection(db, 'serv_key'), 'serv_key');
    const docSnap = await getDoc(keyDocRef);
    const servKey = docSnap.data().serv_key;
    return servKey;
  }

  const onSubmit = (data) => {
    setLoading(true);
    const parsedData = JSON.parse(JSON.stringify(data));
    const email = parsedData.Email;
    const password = parsedData.Password;

    if (checkboxRef.current.checked) {
      issueCookie(parsedData, servKey);
    }

    signIn(email, password);
  };

  function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        (async () => {
          await setPersistence(auth, browserLocalPersistence);
        })();
        setTimeout(() => {
          setLoading(false);
          navigate('/decks');
        }, 440);
      })
      .catch((error) => {
        console.log(error.code + ' ' + error.message);
      });
  }

  return (
    <>
      <LoadingOverlays isLoading={loading} />

      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mx-auto flex flex-col items-center justify-center h-screen'>
            <div className='bg-gray-700 rounded-lg max-w-md shadow-2xl'>
              <div className='space-y-4 p-8'>
                <h1 className='text-3xl mb-6 font-bold text-indigo-400'>
                  Sign in to Your Account
                </h1>

                <div className='space-y-6'>
                  <Input register={register} name='Email' />
                  <Input register={register} name='Password' type='password' />

                  <div className='flex items-center justify-between'>
                    <label className='flex items-center'>
                      <input
                        ref={checkboxRef}
                        type='checkbox'
                        className='h-4 mr-2 w-4 border border-gray-300 bg-gray-50'
                      />
                      <span className='text-sm font-semibold text-indigo-100'>
                        Remember me
                      </span>
                    </label>
                    <a
                      href='/signup'
                      className='font-bold text-indigo-300 hover:text-indigo-400'
                    >
                      Sign up
                    </a>
                  </div>
                  <Button color='indigo' text='Sign in' isLong={true} />
                </div>
                <div className='flex justify-center'>
                  <a
                    href='/'
                    className='font-bold text-indigo-300 hover:text-indigo-400'
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
