export default function Button({ color, text, onClick, isLong }) {
  const long = isLong ? 'w-full' : '';
  const buttonStyling = `focus:shadow-outline-${color} rounded-lg bg-${color}-500 px-5 py-2 text-xl font-bold text-white hover:bg-${color}-600 focus:outline-none active:bg-${color}-800`;
  return (
    <button
      className={`${long} ${buttonStyling}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}