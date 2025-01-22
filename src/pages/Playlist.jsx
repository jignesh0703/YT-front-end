import React, { useContext, useEffect, useRef, useState } from 'react'
import Options from '../Components/Options'
import Navbar from '../Components/Navbar'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';
import axios from 'axios';
import Default from '../images/default.png'
import { CgPlayList } from "react-icons/cg";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Mobile_Option from '../Components/Mobile_Option'

const Playlist = () => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [PlayLists, setPlayLists] = useState(null)
    const [sawplaylist, setsawplaylist] = useState({})
    const dropdownRef = useRef(null)
    const [trackplaylist, settrackplaylist] = useState(false)
    const [sawOption, setsawOption] = useState(false)

    useEffect(() => {
        const FetchAllPlayLists = async () => {
            if (!isLoggedin) {
                return;
            }
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
    }, [trackplaylist, isLoggedin])

    const ToogleOptions = (e, index) => {
        e.preventDefault();
        setsawplaylist((prev) => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setsawplaylist({})
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const DeletePlayList = async (e, playlistid) => {
        e.preventDefault()
        try {
            const responce = await axios.delete(`${URL}/api/playlist/deleteplaylist/${playlistid}`, {
                withCredentials: true
            })
            setsawplaylist({})
            settrackplaylist(!trackplaylist)
            toast.success(responce.data.message)
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
            <Navbar setsawOption={setsawOption} sawOption={sawOption}/>
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption} />
                }
                <div className='flex w-full gap-8 flex-wrap h-max justify-center md:justify-start sm:ml-[3rem]'>
                    {
                        isLoggedin ? (
                            PlayLists
                                ? (
                                    PlayLists.map((item, index) => {
                                        const lastVideoThumbnail = item.Videos.length > 0 ? item.Videos[item.Videos.length - 1].thumbnail : Default;
                                        const SetVideoLength = item.Videos.length > 0 ? item.Videos.length : 'No';
                                        return <Link to={`/playlist/:${item._id}`}><div className='flex w-max h-max flex-col' key={index}>
                                            <div className='mt-4 cursor-pointer w-max h-max'>
                                                <div className='w-max h-max'>
                                                    <img src={lastVideoThumbnail} alt="thumbanil" className='w-[20rem] 4xl:w-[22rem] h-[11rem] 4xl:h-[12rem] object-cover rounded-[15px]' />
                                                </div>
                                                <div className='w-[20rem] 4xl:w-[22rem] h-[11rem] 4xl:h-[12rem] rounded-[15px] absolute -mt-[12rem] flex justify-end items-end'>
                                                    <div className='flex mb-2 mr-2 items-center bg-black bg-opacity-75 rounded-[5px] p-1 pr-2'>
                                                        <CgPlayList className='text-[1.5rem] text-white' />
                                                        <h1 className='font-semibold text-[0.9rem] text-white'>{SetVideoLength} Videos</h1>
                                                    </div>
                                                </div>
                                                <div className='ml-4 flex justify-between mt-2 w-[19rem] 4xl:w-[21rem]'>
                                                    <div className='font-bold flex flex-col text-[0.8rem]'>
                                                        <h1>{item.Playlistname}</h1>
                                                        <h1 className='font-semibold text-gray-600'>View full playlist</h1>
                                                    </div>
                                                    <div className='text-[1.3rem] flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-300 duration-300 cursor-pointer 3xl:mr-[2rem] 4xl:mr-0' onClick={(e) => ToogleOptions(e, index)}>
                                                        <HiOutlineDotsVertical />
                                                    </div>
                                                    {
                                                        sawplaylist[index] ? <div className='absolute ml-[11rem] mt-[1rem] bg-white shadow-lg p-2 px-4'
                                                            ref={dropdownRef}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                DeletePlayList(e, item._id)
                                                            }}
                                                        >
                                                            <h1 className='font-semibold text-center'>Remove Playlist</h1>
                                                        </div> : <></>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        </Link>
                                    })
                                )
                                : <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem] lg:mr-[9rem]'>Playlist is Empty</p>
                        ) :
                            <div className='flex justify-center w-full mt-[3rem]'>
                                <h1 className='text-[2rem] font-bold lg:mr-[11.5rem]'>Login is required</h1>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Playlist