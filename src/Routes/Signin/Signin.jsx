import React, {useRef, useEffect, useState} from 'react';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {issueCookie} from './cookies.js';
import {decodeCookie} from './cookies.js';
import {
  getDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  auth,
  useForm,
  toast,
  Input,
  db,
  PasswordInput,
  useNavigate,
  LoadingOverlays,
} from '../../imports.js';

export default function App() {
  const navigate = useNavigate();
  const checkboxRef = useRef(false);
  const {register, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async () => {
      const cookieData = await decodeCookie();
      if (cookieData) {
        setLoading(true);
        const [email, password] = cookieData.split(',');
        signIn(email, password);
      }
    };
  }, []);

  const onSubmit = ({Email, Password}) => {
    if (checkboxRef.current.checked) {
      issueCookie(parsedData);
    }
    signIn(Email, Password);
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      await setPersistence(auth, browserLocalPersistence);
      setLoading(false);
      navigate('/decks');
    } catch (error) {
      console.error(error.code);
    }
  };

  const forgotPassword = async (email) => {
    try {
      sendPasswordResetEmail(auth, email).then(() => {
        console.log('password reset sent');
      });
    } catch (error) {
      console.error(error.code);
    }
  };

  const submitForgotPassword = async ({Email}) => {
    setIsOpen(true);

    const docRef = collection(db, 'users');
    const snap = await getDocs(docRef);
    if (!snap.exists()) {
      console.error('snapshot doesnt exist');
      return;
    }
    snap.forEach((doc) => {
      if (doc.data().email === Email) {
        forgotPassword(Email);
      }
    });
  };

  return (
    <>
      {isOpen ? (
        <div>
          <div className="text-3xl text-center font-bold text-white">
            Enter Account Email
          </div>
          <form
            onSubmit={handleSubmit(submitForgotPassword)}
            className="space-y-4 flex flex-col"
          >
            <Input register={register} name="Email" placeholder="Email" />

            <button className="shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800">
              Send Reset Email
            </button>
          </form>
          <button
            onClick={() => setIsOpen(false)}
            className="font-bold text-center text-indigo-300 hover:text-indigo-400"
          >
            Return
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto flex flex-col items-center justify-center h-screen">
          <div className="bg-gray-700 p-8 rounded-lg w-[27rem] shadow-2xl">
            <div className="space-y-6">
              <div className="text-3xl font-bold pb-4 text-indigo-400">
                Sign in to Your Account
              </div>
              <Input register={register} name="Email" placeholder="Email" />
              <PasswordInput
                register={register}
                name="Password"
                placeholder="Password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    ref={checkboxRef}
                    type="checkbox"
                    className="h-4 mr-2 w-4 border border-gray-300 bg-gray-50"
                  />
                  <span className="text-sm font-semibold text-indigo-100">
                    Remember me
                  </span>
                </label>
                <a
                  href="/signup"
                  className="font-bold text-indigo-300 hover:text-indigo-400"
                >
                  Sign up
                </a>
              </div>

              <button className="shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white w-full hover:bg-indigo-600 focus:outline-none active:bg-indigo-800">
                Signin
              </button>
            </div>
            <div className="pt-5 flex justify-center">
              <a
                onClick={submitForgotPassword}
                className="font-bold text-indigo-300 hover:text-indigo-400"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
        {loading && <LoadingOverlays isLoading={loading} />}
      </form>
    </>
  );
}
