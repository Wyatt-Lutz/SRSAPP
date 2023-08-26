import React, { useState } from 'react';

export default function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [text, setText] = useState('Open');

  function handleClick() {
    const currentText = text;
    setText(currentText);
    setIsOpen(!isOpen);
    setIsTransitioning(true);
    setTimeout(() => {
      setText(isOpen ? 'Open' : 'Close');
      setIsTransitioning(false);
    }, 420);
  }

  return (
    <div className='ring'>
      <div className="ring fixed inset-0 bg-black bg-opacity-0"></div>
      <div
        className={`rounded-lg transition-all duration-500 fixed left-1/2 bottom-2 w-1/2 h-32 bg-gray-700 transform -translate-x-1/2 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between p-2">
          <div className="ring">Hello</div>
        </div>
      </div>

      <div
        className={`left-1/2 transform transition-all duration-500 -translate-x-1/2 absolute group ${
          isOpen ? 'translate-y-0 bottom-36' : 'translate-y-full bottom-24'
        }`}
      >
        <button
          className={`transition ease-in-out flex flex-col items-center  ${
            isOpen && !isTransitioning && 'hover:translate-y-2 px-4'
          } ${!isOpen && !isTransitioning && 'hover:-translate-y-3 px-4'} }`}
          onClick={handleClick}
        >
          <div className="text-2xl font-bold py-1 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-500">
            {text}
          </div>
          {isOpen ? (
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              className=""
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
