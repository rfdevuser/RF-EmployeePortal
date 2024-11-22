import React, { useState } from 'react'

const DailyActivity = ({empid}) => {
    const [activity , setActivity] = useState('')
    const handleActivityChange=(e)=>{
        e.preventDefault();
        setActivity(e.target.value);
    }
    const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  const handleOnClick=()=>{
    console.log(activity,date,empid)
  }
  return (
    <>
    <div className='bg-red-50 mt-2'>
    <div className='flex justify-center lg:text-xl text-white mt-2 '><p className='bg-[#4a044e] p-1 rounded-xl mt-2'>  Date :- {date}</p> </div>
 
    <div className='flex flex-col lg:flex-row justify-center mt-3 mb-3 bg-red-50 p-4'>
       
    <label className='flex items-center justify-center m-3 text-3xl text-red-800'>𝑫𝒂𝒊𝒍𝒚 𝑨𝒄𝒕𝒊𝒗𝒊𝒕𝒚</label>
    <input
    id='activity'
    type='text'
    value={activity}
    onChange={handleActivityChange}
    className='border-2 border-gray-400 hover:bg-blue-50 w-full lg:w-1/2 h-32'
placeholder='Please Write Detail Work '
    />
    <button className='bg-gray-600 text-white hover:bg-gray-900 p-2 rounded-md mt-2 lg:mt-0 lg:mx-2 ' onClick={handleOnClick}>Submit</button>
    </div>
    </div>
    </>
  )
}

export default DailyActivity
