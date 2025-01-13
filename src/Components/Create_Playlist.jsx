import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

const Create_Playlist = () => {

    const [handletitlesaw, sethandletitlesaw] = useState(false)
    const [title, settitle] = useState('')

    return (
        <>
            <div className='bg-overlay w-full h-full top-0 fixed flex justify-center items-center'>
                <div className='w-[13rem] h-max bg-white rounded-[10px] p-4'>
                    <div className='flex items-center justify-between font-semibold text-[1.2rem]'>
                        <h1>New Playlist</h1>
                        <IoClose className='text-[1.5rem] cursor-pointer' />
                    </div>
                    <form className='mt-2'>
                        {
                            handletitlesaw && (
                                <h1 className='absolute ml-2 font-semibold text-[0.8rem]'>
                                    Title
                                </h1>
                            )
                        }
                        <input
                            type="text"
                            name='title'
                            placeholder={`${!handletitlesaw ? 'Choose a title' : ''}`}
                            className={`w-full pl-2 h-[2.7rem] border border-gray-400 rounded-[5px] outline-none ${handletitlesaw ? 'pt-3' : ''}`}
                            onFocus={() => sethandletitlesaw(true)}
                            onBlur={() => sethandletitlesaw(false)}
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                        />
                        <div className='flex gap-1 mt-4'>
                            <button className='border border-black py-1 px-6 rounded-full font-semibold text-[.8rem] hover:bg-gray-300 duration-300'>Cancel</button>
                            <button
                                className={`py-1 px-6 rounded-full font-semibold text-[.8rem] ${title ? 'bg-[#3ea6ff] text-black' : 'bg-gray-300 text-gray-600'} `}
                                disabled={!title.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Create_Playlist