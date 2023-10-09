
export default function ParagraphInput({ register, name, placeholder, defaultValue }) {

    


  return (

      <textarea
        {...register(name, { required: true })}
        className='w-full resize-none focus:outline-none focus:ring-gray-500 focus:ring-2 rounded border border-gray-500 bg-gray-600 py-2 px-3 text-sm text-white'
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows="4"

      />





  );
}