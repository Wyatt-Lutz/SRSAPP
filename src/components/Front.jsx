
import { useNavigate } from "react-router-dom";
import Menu from './Menu.jsx';
//xX8%*c8T!Kc$5C%



/*
Front Has
  - word to translate
  - audio
  - picture
  - Turn over button
  - example sentences

Back Has
  - definition
  - audio
  - example sentences
  - Review buttons

  /user/[deck]/c=1
*/
function App() {
  var cardStyle = {
    width: '50vw',
    height: '70vh',
    position: 'relative',
    left:'24.5vw', 
    top: '8vh',
  }

  var navigate = useNavigate();
  function toBackRoute() {
    navigate('/back');
  }
  return (
    <>
    <Menu />
    <Box
      component="span"
      sx={{mx: '2px', textAlign: 'center'}}
      >
      <Card style={cardStyle} sx={{boxShadow:'5'}}>
        <CardContent>
          <Box sx={{height:'3vh'}}></Box>
          <Typography variant='h2'>
            "Word"
          </Typography>
          <Box sx={{height:'47vh'}}></Box>
          <Button size='large' variant='outlined' sx={{m:2}}
            onClick={toBackRoute}
          >
              Show Answer
          </Button>
        </CardContent>
      </Card>
    </Box>
    </>
  )
}
export default App;
