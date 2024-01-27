import React, {useRef, useEffect, useState} from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, sendPasswordResetEmail } from 'firebase/auth';
import { issueCookie } from './cookies.js';
import { decodeCookie } from './cookies.js';
import { collection, getDocs } from 'firebase/firestore';
import { auth, useForm, Input, db, PasswordInput, useNavigate, LoadingOverlays, Block } from '../../imports.js';

export default function App() {
  const navigate = useNavigate();
  const checkboxRef = useRef(false);
  const {register, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    ifCookieSignin();


    async function ifCookieSignin() {
      const cookieData = await decodeCookie();
      if (cookieData) {
        setLoading(true);
        const [email, password] = cookieData.split(',');
        await signIn(email, password);
      }
    }
  }, []);

  const onSubmit = async ({Email, Password}) => {
    if (checkboxRef.current.checked) {
      await issueCookie(Email, Password);
    }
    await signIn(Email, Password);
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await setPersistence(auth, browserLocalPersistence);
      navigate('/decks');
    } catch (error) {
      console.error(error.code);
    } finally {
      setLoading(false);
    }
  };


  const submitForgotPassword = async ({ Email }) => {
    try {
      setIsOpen(true);
      const docRef = collection(db, 'users');
      const snap = await getDocs(docRef);

      const isEmailFound = snap.docs.find((doc) => doc.data().email === Email);
      console.log(isEmailFound);

      if (isEmailFound) {
        await sendPasswordResetEmail(auth, Email);
        console.log('password reset sent');
        setIsOpen(false);
      } else {
        console.log('no account with that email');
      }


    } catch (error) {
      console.error(error.message);
    }

  };

  return (
    <Block width="w-1/4">
    {isOpen ? (
      <div>
        <form
          onSubmit={handleSubmit(submitForgotPassword)}
          className='space-y-4 flex flex-col'
        >
          <div className='text-3xl text-center font-bold text-white'>
            Enter Account Email
          </div>

          <Input register={register} name='Email' placeholder='Email' />
          <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>
            Send Reset Email
          </button>
        </form>
        <button
          onClick={() => setIsOpen(false)}
          className='pt-2 font-bold text-center text-indigo-300 hover:text-indigo-400'
        >
          Return
        </button>
      </div>
    ) : (
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className='text-3xl font-bold pb-4 text-indigo-400'>
          Sign in to Your Account
        </div>
        <Input register={register} name='Email' placeholder='Email' />
        <PasswordInput
          register={register}
          name='Password'
          placeholder='Password'
        />

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

        <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white w-full hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>
          Signin
        </button>

        <div className='pt-2 flex justify-center'>
          <a
            onClick={submitForgotPassword}
            className='font-bold text-indigo-300 hover:text-indigo-400'
          >
            Forgot password?
          </a>
        </div>
        {loading && <LoadingOverlays isLoading={loading} />}
      </form>
    )}
  </Block>

  );
}
