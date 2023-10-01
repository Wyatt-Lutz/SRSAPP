
export default function PasswordInputs({ register, name, placeholder }) {


  return (
    <div className="relative">
      <input
        {...register(name, { required: true })}
        className='w-full focus:outline-none focus:ring-gray-500 focus:ring-2 rounded border border-gray-500 bg-gray-600 py-2 px-3 text-sm text-white'
        placeholder={placeholder}

      />

    
    </div>

  );
}