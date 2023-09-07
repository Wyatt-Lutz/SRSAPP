import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db, auth, app } from '../firebase.js';
import Buttons from '../components/Buttons.jsx';
import Inputs from '../components/Inputs.jsx';

export default function App() {
  const Button = React.memo(Buttons);
  const Input = React.memo(Inputs);

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const parsedData = JSON.parse(JSON.stringify(data));
    const email = parsedData.Email;
    const username = parsedData.Username;
    const password = parsedData.Password;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
          email: email,
          username: username,
          userId: user.uid,
        });
        navigate('/decks');
      })
      .catch((error) => {
        console.error(error.code + ' ' + error.message);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center justify-center h-screen'>
          <div className='bg-gray-700 rounded-lg max-w-md shadow-2xl'>
            <div className='p-8 space-y-6'>
              <h1 className='font-bold text-indigo-400 text-3xl'>
                Create an Account
              </h1>
              <Input register={register} name='Email' />

              <Input register={register} name='Username' />

              <Input register={register} name='Password' type='password' />

              <div className='flex justify-between items-center'>
                <a
                  class='font-bold text-indigo-300 hover:text-indigo-400'
                  href='/'
                >
                  Signin
                </a>
              </div>

              <Button color='indigo' text='Signup' isLong={true} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}