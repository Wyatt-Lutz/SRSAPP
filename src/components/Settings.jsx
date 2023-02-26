import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";


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
    const auth = getAuth();
    const navigate = useNavigate();
    const user = auth.currentUser;
    if (user) {
        console.log('bro is signed in'); 
    } else {
        console.log('bro is signed out'); 
        navigate('/signin')
    }

    return (
<section class="bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
    <div class="w-full rounded-lg border border-gray-700 bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0">
      <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">Settings</h1>
        <form class="space-y-4 md:space-y-6">
          <div class="flex justify-between">
            <div class="text-white">Cards per day</div>
            <input id="dailyCards" type="number" class="appearance-none rounded border border-gray-600 bg-gray-700 text-sm" />
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
    )
}