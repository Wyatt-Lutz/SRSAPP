
import React, { useState } from 'react';


export default function Drawers() {
  const [isOpen, setIsOpen] = useState(false);
  const [opaque, setOpaque] = useState(false);




  return (
    <div className=''>
      {isOpen ? (
        <div onMouseEnter={() => setOpaque(true)} className=''>
        
            <div className="fixed inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition ease-in-out duration-500"></div>
            <div className="rounded-t-lg fixed bottom-0 w-full h-1/6 bg-gray-700">
              <div className='flex items-center justify-between p-2'>
                <div className='ring'>Hello</div>
              </div>  
            </div>  
      
            
    
          <button className="transition ease-in-out hover:translate-y-1 absolute bottom-0 left-1/2 my-40 py-1" onClick={() => setIsOpen(false)}>
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.75745 10.5858L9.17166 9.17154L12.0001 12L14.8285 9.17157L16.2427 10.5858L12.0001 14.8284L7.75745 10.5858Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                fill="currentColor"
              />
            </svg>
          </button>
          
        </div>

      
      ) : <div className="ring-indigo-400 rounded-lg py-1 left-1/2 bottom-0 absolute group">
            <button className="transition ease-in-out hover:-translate-y-5" onClick={() => setIsOpen(true)}>
              <div className='flex flex-col items-center'>
                <div className='text-2xl font-bold ring py-1 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-400'>Menu</div>
          
                <svg
                  className='ring'
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.8285 14.8284L16.2427 13.4142L12.0001 9.17161L7.75745 13.4142L9.17166 14.8285L12.0001 12L14.8285 14.8284Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                    fill="currentColor"
                  />
                </svg>

              </div>
           

            </button>
          </div> }



    </div>
  



  )
}