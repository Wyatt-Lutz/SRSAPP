
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc} from "firebase/firestore";
import React, {useState} from 'react';

//xX8%*c8T!Kc$5C%
function App() {
    var cardStyle = {
        width: '40vw',
        height: '80vh',
        position: 'relative',
        left:'29vw', 
        top: '7.7vh',
    }

  

  

  var navigate = useNavigate();
  const [FrontValue, setFrontValue] = useState("");
  const [BackValue, setBackValue] = useState("");
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const firebaseConfig = {
    apiKey: "AIzaSyCgqUIPvexk1ZMnL9h69XicaQ7vLyXgWio",
    authDomain: "srsapp-ef3e7.firebaseapp.com",
    projectId: "srsapp-ef3e7",
    storageBucket: "srsapp-ef3e7.appspot.com",
    messagingSenderId: "910724341943",
    appId: "1:910724341943:web:1e8a9a1870413b6e11ad32",
    measurementId: "G-HG9T2QB1VS",
  };
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  var emailFromUrl = params.user; 

  function runCreateDecks() {
    createDecks(FrontValue, BackValue);
  }
  async function createDecks(front, back) {
    const userDecks = doc(firestore, "Users", emailFromUrl, "Sets");
    const userSnapshot = await getDoc(userDecks);
    try {
        const docRef = await setDoc(userDecks ,{
          frontCard: front,
          backCard: back
        });
        console.log('Document written');

    
      } catch(e) {
        console.error('Error adding document', e);
      }

  }

  return (
    <>
    <Box
      component="span"
      sx={{mx: '2px', textAlign: 'center'}}
      >
      <Card style={cardStyle} sx={{boxShadow:'5'}}>
        <CardContent>
            <Box>
                <TextField variant='outlined' label='Front' value={FrontValue} onChange={(newValue) => setFrontValue(newValue.target.value)}></TextField>
            </Box>
            <Box>
                <TextField variant='outlined' label='Back' value={BackValue} onChange={(newValue) => setBackValue(newValue.target.value)}></TextField>
            </Box>
            <Button onClick={runCreateDecks}>Create Card</Button>

        </CardContent>
      </Card>
    </Box>
    </>
  )
}
export default App;
