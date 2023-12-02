import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Input, PasswordInput, useForm, toast, db, auth, Block } from "../imports.js";


export default function App() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ Email, Password }) => {
    try {
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
    <Block width="w-1/4">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className='font-bold text-indigo-400 text-3xl'>Create an Account</div>
        <Input register={register} name='Email' placeholder='Email' />
    
        <div>
          <PasswordInput
            register={register}
            name='Password'
            placeholder='Password'
          />
          <div className='text-gray-500 text-sm italic'>
            *Must be at least 6 characters
          </div>
        </div>
        <div className='font-bold text-lg text-indigo-300 hover:text-indigo-400'>
          <a href="/">Signin</a>
        </div>

        <div>
          <button className='shadow-indigo-500/50 shadow-2xl w-full rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 active:bg-indigo-800'>
            Signup
          </button>

        </div>

      </form>


    </Block>
  
  );
}