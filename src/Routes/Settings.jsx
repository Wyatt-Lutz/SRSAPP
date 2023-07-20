import { signOut } from "firebase/auth";
import { db, auth, app } from './firebase.js';
import { useNavigate } from "react-router-dom";

export default function App() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    if (!user) {
      navigate('/');
    }

    function onSignOut() {
      signOut(auth).then(() => {
        navigate('/');
      }).catch((error) => {
        console.log(error);
      });
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
            <button onClick={onSignOut}>Sign out</button>
          </div>  
        </form>
      </div>
    </div>
  </div>
</section>
    )
}