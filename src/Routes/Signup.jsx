import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Input, PasswordInput, useForm, toast, db, auth } from "../imports.js";

export default function App() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const { Email, Password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, Email, Password);
      const { user } = userCredential;
      await setDoc(doc(db, "users", user.uid), {
        email: Email,
        userId: user.uid,
      });
      navigate("/decks");
    } catch (error) {
      console.error(error.code);
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("Email is already in use");
          break;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col justify-center items-center h-screen'>
        <div className='bg-gray-700 p-8 space-y-6 rounded-lg w-[27rem] shadow-2xl'>
          <h1 className='font-bold text-indigo-400 text-3xl'>
            Create an Account
          </h1>
          <Input register={register} name='Email' placeholder='Email' />

          <div>
            <PasswordInput
              register={register}
              name='Password'
              placeholder='Password'
            />
            <p className='text-gray-500 text-sm italic'>
              *Must be at least 6 characters
            </p>
          </div>

          <div className='flex justify-between items-center'>
            <a
              className='font-bold text-indigo-300 hover:text-indigo-400'
              href='/'
            >
              Signin
            </a>
          </div>

          <button className='shadow-indigo-500/50 shadow-2xl w-full rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800'>
            Signup
          </button>
        </div>
      </div>
    </form>
  );
}