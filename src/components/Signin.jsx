import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import '../index.css'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc} from "firebase/firestore";

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

    const [EmailValue, setEmailValue] = useState("");
    const [PassValue, setPassValue] = useState("");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    var email;
    var pass;
    function handleStateValues() {
        email = EmailValue;
        pass = PassValue;
        signInWithEmailAndPassword(auth, email, pass)
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
        });

        if (user) {
            console.log('bro is signed in');
            navigate('/settings') 
        } else {
            console.log('bro is signed out!!'); 
        }
    }


    



    
    




   /*

    function getCookie(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
          begin = dc.indexOf(prefix);
          if (begin != 0) return null;
      } else {
          begin += 2;
          var end = document.cookie.indexOf(";", begin);
          if (end == -1) {
            end = dc.length;
          }
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    function runReadData() {
        findUserData(EmailValue, PassValue);
    }


    async function findUserData(Email, Pass) {
        const emails = doc(firestore, "Users", Email);
        const snapshot = await getDoc(emails);  
        var ifEmailUsed = snapshot.exists() && snapshot.data().password === Pass ? true : false;
        if (ifEmailUsed) {
            console.log('Email and Password Correct.')
            navigate('/home');
            var res = document.cookie;
            var multiple = res.split(";");
            for(var i = 0; i < multiple.length; i++) {
               var key = multiple[i].split("=");
               document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
            }

            document.cookie = "User=" + Email + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            document.cookie = "Username=" + username + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";


          
        } else {
            alert('Email or password do not match.')
        }
    }
    */

    return (
<section class="bg-gray-900">
  <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
    <div class="w-full rounded-lg border border-gray-600 bg-gradient-to-l from-gray-900 to-gray-700 drop-shadow-2xl sm:max-w-md md:mt-0 xl:p-0">
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-indigo-400 md:text-3xl">Sign in to Your Account</h1>
        <div class="space-y-4 md:space-y-6">
          <div>
            <label class="mb-2 block font-semibold text-indigo-300" htmlFor="email">Your Email</label>
            <input onChange={(e) => {setEmailValue(e.target.value)}} value={EmailValue} class="w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white" placeholder="user@company.com" />
          </div>
          <div>
            <label class="text-s mb-2 block font-semibold text-indigo-300" htmlFor="password">Password</label>
            <input onChange={(e) => {setPassValue(e.target.value)}} value={PassValue} class="w-full appearance-none rounded border border-gray-600 bg-gray-700 py-2 px-3 text-sm text-white" placeholder="••••••••" type="password" />
          </div>

          <div class="flex items-center justify-between">
            <a href="/signup" class="font-bold text-indigo-300 hover:underline">Signup</a>
            <a class="font-bold text-indigo-300 hover:underline">Forgot password?</a>
          </div>

          <button onClick={handleStateValues} class="w-full rounded-l bg-indigo-400 p-2 text-gray-800">Sign in</button>
        </div>
      </div>
    </div>
  </div>
</section>






    )
}