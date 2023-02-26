
function App() {
  var cardStyle = {
    width: '50vw',
    height: '70vh',
    position: 'relative',
    left:'24.5vw', 
    top: '8vh',
  }
  return (
    <div>
    <Box
      component="span"
      sx={{mx: '2px', textAlign: 'center'}}
      >
      <Card style = {cardStyle} sx={{boxShadow: '5'}}>
        <CardContent>
          <Box sx={{height:'3vh'}}></Box>
          <Typography variant='h2'>
            "translation"
          </Typography>
          <Box sx={{height:'47vh'}}></Box>
          <Button size='large' variant='outlined' sx={{m:2}}>1</Button>
          <Button size='large' variant='outlined' sx={{m:2}}>2</Button>
          <Button size='large' variant='outlined' sx={{m:2}}>3</Button>
          <Button size='large' variant='outlined' sx={{m:2}}>4</Button>
          <Button size='large' variant='outlined' sx={{m:2}}>5</Button>
        </CardContent>
      </Card>
    </Box>
    </div>
  )
}
export default App;
