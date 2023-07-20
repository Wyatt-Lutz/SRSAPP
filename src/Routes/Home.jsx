
import { db, auth, app } from './firebase.js';
import { useNavigate } from "react-router-dom";
//xX8%*c8T!Kc$5C%
function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  if (!user) {
    navigate('/');
  }


  return (
    <button onClick={bruh}>Sign out</button>
  )
}
export default App;
