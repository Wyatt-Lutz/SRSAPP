export default function Button({ color, text, onClick, isLong }) {
  const long = isLong ? 'w-full' : '';

  const theColor = color;
  return (
    <button
      className={`shadow-${theColor}-500/50 shadow-2xl rounded-lg bg-${theColor}-500 px-5 py-2 text-xl font-bold text-white hover:bg-${theColor}-600 focus:outline-none active:bg-${theColor}-800 ${long} `}
      onClick={onClick}
    >
      {text}
    </button>
  );
}