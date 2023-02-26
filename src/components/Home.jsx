
import { useNavigate } from "react-router-dom";
//xX8%*c8T!Kc$5C%
function App() {
  var cardStyle = {
    width: '50vw',
    height: '70vh',
    position: 'relative',
    left:'24.5vw', 
    top: '12vh',
  }

  var navigate = useNavigate();
  function toDecksRoute() {
    navigate('/decks');
  }
  function toSettingsRoute() {
    navigate('/settings');
  }
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
  var user = getCookie('Username');

  

  return (
    <>
    <Box
      component="span"
      sx={{mx: '2px', textAlign: 'center'}}
      >
      <Card style={cardStyle} sx={{boxShadow:'5'}}>
        <CardContent>
            <Typography>Welcome {user} </Typography>
            <Button onClick={toDecksRoute}>Decks</Button>
            <Button onClick={toSettingsRoute}>Settings</Button>

        </CardContent>
      </Card>
    </Box>
    </>
  )
}
export default App;
