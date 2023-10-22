import React, { useRef, useEffect, useState } from 'react';
import { collection, getDoc, doc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { issueCookie } from './cookies.js';
import { decodeCookie } from './cookies.js';
import { db, auth, app, useForm, toast, Input, PasswordInput, Button, useNavigate, LoadingOverlays } from '../../imports.js';

export default function App() {
  const navigate = useNavigate();

 
  const checkboxRef = useRef(false);
  const isMounted = useRef(false);


  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!isMounted.current) {
      if (document.cookie === '') {
        return;
      }

      setLoading(true);
      const getCookieData = async () => {
        const cookieData = await decodeCookie(privKey);
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
    const parsedData = JSON.parse(JSON.stringify(data));
    const email = parsedData.Email;
    const password = parsedData.Password;

    if (checkboxRef.current.checked) {
      issueCookie(parsedData, privKey);
    }

    signIn(email, password);
  };

  function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(true);
        (async () => {
          await setPersistence(auth, browserLocalPersistence);
        })();
        setTimeout(() => {
          setLoading(false);
          navigate('/decks');
        }, 300);
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
            <div className='bg-gray-700 rounded-lg w-[27rem] shadow-2xl'>
              <div className='p-8'>

                <div className='space-y-6'>
                  <div className='text-3xl font-bold pb-4 text-indigo-400'>
                    Sign in to Your Account
                  </div>
                  <Input register={register} name='Email' placeholder="Email" />
                  <PasswordInput register={register} name='Password' placeholder="Password" />

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

                  <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white w-full hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => setIsOpen(true)}>Study</button>
             
                  
 
                </div>
                <div className='pt-5 flex justify-center'>
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
