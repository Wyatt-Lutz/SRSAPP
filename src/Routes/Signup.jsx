import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';


import { useNavigate, Inputs, PasswordInputs, Buttons, useForm, toast, db, auth, app } from '../imports.js';

export default function App() {
  const Button = React.memo(Buttons);
  const Input = React.memo(Inputs);
  const PasswordInput = React.memo(PasswordInputs);

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const parsedData = JSON.parse(JSON.stringify(data));
    const email = parsedData.Email;
    //const username = parsedData.Username;
    const password = parsedData.Password;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
          email: email,
          //username: username,
          userId: user.uid,
        });
        navigate('/decks');
      })
      .catch((error) => {
        console.error(error.code + ' ' + error.message);
        toast.error('Error creating account.')

      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col justify-center items-center h-screen'>
          <div className='bg-gray-700 rounded-lg w-[27rem] shadow-2xl'>
            <div className='p-8 space-y-6'>
              <h1 className='font-bold text-indigo-400 text-3xl'>
                Create an Account
              </h1>
              <Input register={register} name='Email' placeholder="Email" />

              {/*<Input register={register} name='Username' placeholder={} /> */}

              
              <div>
                <PasswordInput register={register} name='Password' placeholder="Password" />
                <p className="text-gray-500 text-sm italic">*Must be at least 6 characters</p>
              </div>

              <div className='flex justify-between items-center'>
                <a
                  className='font-bold text-indigo-300 hover:text-indigo-400'
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