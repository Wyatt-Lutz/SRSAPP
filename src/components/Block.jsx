export default function Block({children, width}) {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className={`bg-gray-700 p-8 rounded-lg ${width} shadow-2xl`}>
                {children}
            </div>
        </div>

    )
}


/*Signin
        <div className="mx-auto flex flex-col items-center justify-center h-screen">
          <div className="bg-gray-700 p-8 rounded-lg w-[27rem] shadow-2xl">
            <div className="space-y-6">

Signup
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='bg-gray-700 p-8 space-y-6 rounded-lg w-[27rem] shadow-2xl'>

Decks
        <div className="flex flex-col items-center justify-center px-6 py-8 h-screen">
            <div className="w-full max-w-xl p-6 rounded-lg bg-gray-700 shadow-2xl">
                <div className="flex justify-between">


*/