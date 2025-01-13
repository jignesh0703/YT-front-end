import React, { useContext, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import axios from 'axios';
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';

const Create_Playlist = ({ setsawcreateplaylist }) => {

    const { URL } = useContext(StoreContext);

    const [handletitlesaw, sethandletitlesaw] = useState(false)
    const [title, settitle] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const CreatePlayList = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const responce = await axios.post(`${URL}/api/playlist/add`, { playlist: title }, {
                withCredentials: true
            })
            toast.success(responce.data.message)
            setsawcreateplaylist(false)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && (
                <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
                    <Oval type="Oval" color="#00BFFF" height={50} width={50} />
                </div>
            )}
            <div className='bg-overlay w-full h-full top-0 fixed flex justify-center items-center' onClick={() => setsawcreateplaylist(false)}>
                <div className='w-[13rem] h-max bg-white rounded-[10px] p-4' onClick={(e) => e.stopPropagation()}>
                    <div className='flex items-center justify-between font-semibold text-[1.2rem]'>
                        <h1>New Playlist</h1>
                        <IoClose className='text-[1.5rem] cursor-pointer' onClick={() => setsawcreateplaylist(false)} />
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
                            <button className='border border-black py-1 px-6 rounded-full font-semibold text-[.8rem] hover:bg-gray-300 duration-300'
                                onClick={(e) => {
                                    e.preventDefault()
                                    setsawcreateplaylist(false)
                                }}
                            >Cancel</button>
                            <button
                                className={`py-1 px-6 rounded-full font-semibold text-[.8rem] ${title ? 'bg-[#3ea6ff] text-black' : 'bg-gray-300 text-gray-600'} `}
                                disabled={!title.trim()}
                                onClick={CreatePlayList}
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