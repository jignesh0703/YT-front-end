import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import axios from 'axios'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify'
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsVertical } from 'react-icons/hi'

const Playlist_Page = () => {

    const { URL } = useContext(StoreContext);
    const { playlistid } = useParams()
    const [PlayListVideos, setPlayListVideos] = useState([])
    const [sawvideos, setsawvideos] = useState(false)
    const [sawremovevideo, setsawremovevideo] = useState({})
    const dropdownRef = useRef(null)
    const [trackplaylist, settrackplaylist] = useState(false)

    useEffect(() => {
        const GetPlayListVideos = async () => {
            try {
                const responce = await axios.get(`${URL}/api/playlist/getplaylistvideos/${playlistid}`, {
                    withCredentials: true
                })
                setPlayListVideos(responce.data.videos)
                setsawvideos(true)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        GetPlayListVideos()
    }, [trackplaylist])

    const ToggleOptions = (e, index) => {
        e.preventDefault();
        setsawremovevideo((prev) => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setsawremovevideo({});
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const RemoveVideoInPlayList = async (e, videoid) => {
        e.stopPropagation();
        try {
            const responce = await axios.delete(`${URL}/api/playlist/removevideoinplaylist/${playlistid}/removevideo/${videoid}`, {
                withCredentials: true
            })
            setsawremovevideo({})
            toast.success(responce.data.message)
            settrackplaylist(!trackplaylist)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <div className='flex w-full h-max flex-col'>
                    <div className='flex justify-center w-full text-[1.5rem] -ml-[6rem] font-bold'>
                        Playlist Name : {PlayListVideos &&
                            PlayListVideos.Playlistname
                        }
                    </div>
                    <div className='w-full mt-[2rem] flex gap-4 flex-wrap ml-auto mr-auto'>
                        {
                            sawvideos ?
                                PlayListVideos.Videos.length > 0 ?
                                    (
                                        PlayListVideos.Videos.map((item, index) => {

                                            const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })?.replace(/^about/, '')
                                            const sawtitle = item.title.length > 60 ? item.title.slice(0, 60) + '...' : item.title

                                            return <div key={index}>
                                                <Link to={`/video/:${item._id}`}>
                                                    <div className='w-[22rem]'>
                                                        <div className='flex'>
                                                            <img src={item.thumbnail} alt="thimbnail" className=' w-[22rem] h-[12rem] object-cover cursor-pointer rounded-[15px]' />
                                                        </div>
                                                        <div className='flex mt-2 items-start gap-2'>
                                                            <div className='w-[3rem]'>
                                                                <img src={item.owner.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] ml-2 rounded-full' />
                                                            </div>
                                                            <div className='flex flex-col ml-2 w-[20rem]'>
                                                                <div className='font-bold'>
                                                                    {sawtitle}
                                                                </div>
                                                                <div className='text-[0.8rem]'>
                                                                    <h1>{item.owner.channel_name}</h1>
                                                                </div>
                                                                <div className='flex gap-2 text-[0.8rem]'>
                                                                    <h1>{item.views} views</h1>
                                                                    <hr className='w-[3px] h-[3px] bg-gray-800 rounded-full mt-[10px]' />
                                                                    <h1>{timeAgo}</h1>
                                                                </div>
                                                            </div>
                                                            <div className='text-[1.3rem] mt-1 p-2 rounded-full cursor-pointer hover:bg-gray-200' onClick={(e) => ToggleOptions(e, index)}>
                                                                <HiOutlineDotsVertical />
                                                            </div>
                                                            {
                                                                sawremovevideo[index] ? <div className='absolute ml-[12rem] mt-[1rem] bg-white shadow-lg p-2 px-4' 
                                                                ref={dropdownRef} 
                                                                onClick={(e)=>{
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    RemoveVideoInPlayList(e,item._id)
                                                                }}>
                                                                    <h1 className='font-semibold text-center'>Remove From <br /> Playlist</h1>
                                                                </div> : <></>
                                                            }
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        })
                                    ) : (
                                        <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem] mr-[9rem]'>Playlist is Empty</p>
                                    )
                                : <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Playlist_Page