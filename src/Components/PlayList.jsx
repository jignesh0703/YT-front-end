import React from 'react'
import { IoClose } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import Create_Playlist from './Create_Playlist';

const PlayList = () => {
    return (
        <>
            <div className='bg-overlay w-full h-full top-0 fixed flex justify-center items-center'>
                <div className='w-[13rem] h-max bg-white rounded-[10px] p-4'>
                    <div className='flex items-center justify-between font-semibold text-[1.2rem]'>
                        <h1>Save Video to...</h1>
                        <IoClose className='text-[1.5rem] cursor-pointer' />
                    </div>
                    <div className='mt-4 min-h-[5rem] max-h-[15rem] overflow-hidden overflow-y-auto ml-6 flex flex-col gap-2'>
                        <div className='flex items-center gap-4'>
                            <input type="checkbox" name="playlist" id="playlist" className='w-4 h-4 mt-[.15rem]' />
                            <h1 className='text-[1.2rem] font-medium'>Jigs</h1>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type="checkbox" name="playlist" id="playlist" className='w-4 h-4 mt-[.15rem]' />
                            <h1 className='text-[1.2rem] font-medium'>Jigs</h1>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type="checkbox" name="playlist" id="playlist" className='w-4 h-4 mt-[.15rem]' />
                            <h1 className='text-[1.2rem] font-medium'>Jigs</h1>
                        </div>
                        <div className='flex items-center gap-4'>
                            <input type="checkbox" name="playlist" id="playlist" className='w-4 h-4 mt-[.15rem]' />
                            <h1 className='text-[1.2rem] font-medium'>Jigs</h1>
                        </div>
                    </div>
                    <div className='flex justify-center items-center mt-4 py-1'>
                        <div className='flex justify-center items-center border border-black rounded-full py-1 px-2 w-[10rem] gap-2 cursor-pointer hover:bg-gray-300 duration-300'>
                            <BsPlusLg className='text-[1.5rem]'/>
                            <h1 className='text-[0.9rem] font-bold'>New PlayList</h1>
                        </div>
                    </div>
                </div>
            </div>
            <Create_Playlist />
        </>
    )
}

export default PlayList