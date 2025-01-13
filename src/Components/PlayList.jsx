import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import axios from 'axios';
import { StoreContext } from "../context/Context";
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const PlayList = ({ setsawplaylist, setsawcreateplaylist }) => {

    const { URL } = useContext(StoreContext);
    const [PlayLists, setPlayLists] = useState(null)
    const { id } = useParams()
    const [checkedPlaylists, setCheckedPlaylists] = useState({}); // Tracks the checked state for each playlist

    useEffect(() => {
        const FetchAllPlayLists = async () => {
            try {
                const responce = await axios.get(`${URL}/api/playlist/getuserplaylist`, {
                    withCredentials: true
                })
                setPlayLists(responce.data.playlist)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        FetchAllPlayLists()
    }, [])

    const AddVideoInPlayList = async (playlistid, videoid) => {
        try {
            const responce = await axios.post(`${URL}/api/playlist/addvideoinplaylist/:${playlistid}/addvideo/${videoid}`, {}, {
                withCredentials: true
            })
            toast.success(responce.data.message)
            // Toggle the checkbox state based on the action
            setCheckedPlaylists((prev) => ({
                ...prev,
                [playlistid]: !prev[playlistid], // Toggle the checkbox state
            }));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    useEffect(() => {
        const CheckVideoAlredyPrecent = async () => {
            const updatedCheckedPlaylists = { ...checkedPlaylists };
            try {
                for (const playlist of PlayLists) {
                    const response = await axios.get(`${URL}/api/playlist/checkvideo/:${playlist._id}/alredypresent/${id}`, {
                        withCredentials: true
                    });
                    updatedCheckedPlaylists[playlist._id] = response.data.AlredyAdded;
                }
                setCheckedPlaylists(updatedCheckedPlaylists);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        };
        if (PlayLists) {
            CheckVideoAlredyPrecent();
        }
    }, [PlayLists, id, URL]);

    return (
        <>
            <div className='bg-overlay w-full h-full top-0 fixed flex justify-center items-center' onClick={() => setsawplaylist(false)}>
                <div className='w-[13rem] h-max bg-white rounded-[10px] p-4' onClick={(e) => e.stopPropagation()}>
                    <div className='flex items-center justify-between font-semibold text-[1.2rem]'>
                        <h1>Save Video to...</h1>
                        <IoClose className='text-[1.5rem] cursor-pointer' onClick={() => setsawplaylist(false)} />
                    </div>
                    <div className='mt-4 min-h-[5rem] max-h-[15rem] overflow-hidden overflow-y-auto ml-6 flex flex-col gap-2'>
                        {PlayLists &&
                            PlayLists.map((item, index) => {
                                return <div className='flex items-center gap-4' key={index}>
                                    <input
                                        type="checkbox"
                                        name={item.Playlistname}
                                        id={item._id}
                                        checked={checkedPlaylists[item._id] || false} // Set checked state from checkedPlaylists
                                        className='w-4 h-4 mt-[.15rem] cursor-pointer'
                                        onChange={() => AddVideoInPlayList(item._id, id)}
                                    />
                                    <h1 className='text-[1.2rem] font-medium'>{item.Playlistname}</h1>
                                </div>
                            })
                        }
                    </div>
                    <div className='flex justify-center items-center mt-4 py-1'>
                        <div className='flex justify-center items-center border border-black rounded-full py-1 px-2 w-[10rem] gap-2 cursor-pointer hover:bg-gray-300 duration-300'
                            onClick={() => {
                                setsawcreateplaylist(true)
                                setsawplaylist(false)
                            }}>
                            <BsPlusLg className='text-[1.5rem]' />
                            <h1 className='text-[0.9rem] font-bold'>New PlayList</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlayList