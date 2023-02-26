import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import '../index.css'

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBu1ALA2a6W2CF_3GXhFCwL_yUSFare5qg",
    authDomain: "srsappv2.firebaseapp.com",
    projectId: "srsappv2",
    storageBucket: "srsappv2.appspot.com",
    messagingSenderId: "814430664725",
    appId: "1:814430664725:web:51f71304f5a33a8cbb761c",
    measurementId: "G-P9NFXSNWG1"
  
  };
  
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

/*
  var navigate = useNavigate();
  function toSigninRoute() {
    navigate('/signin'); 
  }
  function toFrontRoute() {
    navigate('/front');
  }
*/



  const [EmailValue, setEmailValue] = useState("");
  const [UserValue, setUserValue] = useState("");
  const [PassValue, setPassValue] = useState("");
  
  var username;
  var email;
  var pass;
  const auth = getAuth();

  function handleValueStates() {
    username = UserValue;
    email = EmailValue;
    pass = PassValue;
    createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ..
    });
  }

  



  

  //email input checks
  



  /*
  async function createUserData(Email, Pass, User) {
    //Emails
    const emails = doc(firestore, "Users", Email);
    const snapshot = await getDoc(emails);
    var ifEmailUsed = snapshot.exists() ? true : false;
    if (ifEmailUsed) {
      alert('Email is already in use');
    } else {
      try {
        await setDoc(doc(firestore, "Users", Email) ,{
          password: Pass,
          username: User
        });

        await setDoc(doc(firestore, "Users", Email, "Sets", "Spanish"), {
          front: 'Hola',
          back: 'Hello'
        })

        document.cookie = "Username=" + User + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";







        
  
        //Email Verification

        
        toSigninRoute();
      } catch(e) {
        console.error('Error adding document', e);
      }
    }
  }
  */
  
  return (
<section class="bg-gray-900">
  <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
    <div class="w-full rounded-lg drop-shadow-2xl border border-gray-600 bg-gradient-to-l from-gray-900 to-gray-700 sm:max-w-md md:mt-0 xl:p-0">
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-indigo-400 md:text-3xl">Create an Account</h1>
        <div id='signupForm' class="space-y-4 md:space-y-6">
          <div>
            <label class="text-s mb-2 block font-semibold text-indigo-300" htmlFor="username-input">Username</label>
            <input onChange={(e) => {setUserValue(e.target.value)}} value={UserValue} class="w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white" placeholder="Jimmy1234" />
          </div>
          <div>
            <label class="text-s mb-2 block font-semibold text-indigo-300" htmlFor="email-input">Your Email</label>
            <input onChange={(e) => {setEmailValue(e.target.value)}} value={EmailValue} class="w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white" placeholder="user@company.com" />
          </div>
          <div>
            <label class="text-s mb-2 block font-semibold text-indigo-300" htmlFor="password">Create a Password</label>
            <input onChange={(e) => {setPassValue(e.target.value)}} value={PassValue} class="w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white" placeholder="••••••••" type="password" />
          </div>


          <div class="flex items-center">
            <input id="remember" type="checkbox" class='h-4 mr-2 w-4 rounded border border-gray-300 bg-gray-50'/>
            <div class='mr-52 text-sm font-semibold text-indigo-100'>Remember me</div>
            <a class="font-bold text-indigo-300 hover:underline" href="/">Signin</a>
          </div>

          <button onClick={handleValueStates} id='signupButton' class="w-full rounded-l bg-indigo-400 p-2 text-gray-800">Signup</button>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}