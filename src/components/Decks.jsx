
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocs, getDoc, collection} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FixedSizeList } from 'react-window';


export function App() {
    var cardStyle = {
        width: '40vw',
        height: '80vh',
        position: 'relative',
        left:'29vw', 
        top: '7.7vh',
    }
    var navigate = useNavigate();
    function toDeckCreationRoute() {
      navigate('/createDeck');
    }
      /*
        const listEl = React.createElement({List}.toString());
        const listItemEl = document.createElement('ListItem');
        const listButtEl = document.createElement('ListItemButton');
        const listItemTextEl = document.createElement('ListItemText');
        const sList = document.getElementById('bList');
        const parentDiv = document.getElementById('e');
        listItemTextEl.innerText = docID;
        sList.insertBefore(listEl, sList.children[0]);
        listEl.insertBefore(listItemEl, listEl.children[0]);
        listItemEl.insertBefore(listButtEl, listItemEl.children[0]);
        listButtEl.insertBefore(listItemTextEl, listButtEl.children[0]);
        console.log('done');
      */
    
  return (
    <>
    <Box id = 'e'
      component="span"
      sx={{mx: '2px', textAlign: 'center'}}
      >
      <Card style={cardStyle} sx={{boxShadow:'5'}}>
        <CardContent>
            <Button onClick={toDeckCreationRoute}>Create Deck</Button>
            <Box>
              <FixedSizeList
                itemCount={1}
              >
                {renderRow}
              </FixedSizeList>
            </Box>

        </CardContent>
      </Card>
    </Box>
    </>
  )
}
function renderRow() {
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

    function getCookie(cookieName) {
      let cookie = {};
      document.cookie.split(';').forEach(function(el) {
        let [key,value] = el.split('=');
        cookie[key.trim()] = value;
      })
      return cookie[cookieName];
    }
    var email = getCookie("Username"); 
    function callGetDeck() {
      getDeck();
    }
    var docID = '';
    async function getDeck() {
      const userDecks = collection(firestore, "Users", email, "Sets");
      const userSnapshot = await getDocs(userDecks);
      userSnapshot.forEach((doc) => {
        var docID = doc.id;
        console.log(docID);
      });
    }

  return(

    <ListItem>
      <ListItemButton>
        <ListItemText primary={docID}/>
      </ListItemButton>
    </ListItem>

  )
}

