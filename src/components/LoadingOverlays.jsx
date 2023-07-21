import PulseLoader from 'react-spinners/PulseLoader';


export default function LoadingOverlays({ isLoading }) {
    if (!isLoading) {
        return null;
    } 
    
    return (
        <div className='flex items-center justify-center h-screen'>
          <PulseLoader
            color={"#000000"}
            size={70}
            speedMultiplier={0.5}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
    );
  }