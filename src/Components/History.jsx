import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify'
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';
import { HiOutlineDotsVertical } from "react-icons/hi";

const History = () => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [history, sethistory] = useState(null)
    const [loading, setloading] = useState(false)
    const [sawhistory, setsawhistory] = useState({})
    const dropdownRef = useRef(null);
    const [tarckhistory, settarckhistory] = useState(false)

    const FetchHistory = async () => {
        setloading(true)
        try {
            const responce = await axios.get(`${URL}/api/user/fetchwatchHistory`, {
                withCredentials: true
            })
            sethistory(responce.data.watchHistory)
        } catch (error) {
        } finally {
            setloading(false)
        }
    }
    useEffect(() => {
        if (isLoggedin) {
            FetchHistory()
        }
    }, [tarckhistory, isLoggedin])

    const toggleOptions = (e, index) => {
        e.preventDefault();
        setsawhistory((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setsawhistory({});
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const RemoveFromWatchHistory = async (videoid, e) => {
        e.stopPropagation();
        try {
            const responce = await axios.post(`${URL}/api/user/deletevideofromwatchhistory/${videoid}`, {}, {
                withCredentials: true
            })
            setsawhistory({})
            toast.success(responce.data.message)
            settarckhistory(!tarckhistory)
        } catch (error) {
        }
    }

    const DeleteHistory = async () => {
        try {
            const responce = await axios.post(`${URL}/api/user/clearwatchhistory`, {}, {
                withCredentials: true
            })
            toast.success(responce.data.message)
            settarckhistory(!tarckhistory)
        } catch (error) {
        }
    }

    if (loading) return (
        <div className='flex justify-center'>
            <h1 className='text-[2rem] font-bold mr-[11.5rem]'>History</h1>
        </div>
    )

    if (!isLoggedin) return (
        <div className='flex justify-center w-full mt-[3rem]'>
            <h1 className='text-[2rem] font-bold lg:mr-[11.5rem]'>Login is required</h1>
        </div>
    )

    return (
        <>
            <div className='w-full'>
                {
                    history?.length > 0 ? <div className='flex justify-center'>
                        <h1 className='text-[2rem] font-bold mr-[11.5rem]'>History</h1>
                    </div> : <></>
                }
                {
                    history?.length > 0
                        ? <div className='absolute justify-end right-0 cursor-pointer mr-[2.5rem] sm:mr-[5rem] lg:mr-[10.2rem] -my-[3rem] xl:-mt-[1.5rem] border-b border-blue-500' onClick={DeleteHistory}>
                            <h1 className='text-[1.2rem] font-bold text-blue-500 z-0'>Clear History</h1>
                        </div>
                        : <></>
                }

                <div className='w-full h-max flex justify-center mt-4'>
                    <div className='w-[90%]'>
                    <div className='flex gap-6 lg:gap-8 justify-center lg:justify-start xl:gap-4 2xl:gap-8 flex-wrap 2xl:ml-[3rem] 3xl:ml-0'>
                            {
                                history?.length > 0 ? (
                                    history.map((item, index) => {

                                        const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })?.replace(/^about/, '')
                                        const sawtitle = item.title.length > 60 ? item.title.slice(0, 60) + '...' : item.title

                                        return <div key={index}>
                                            <Link to={`/video/:${item.videoId}`}>
                                                <div className='w-[20rem] 4xl:w-[22rem]'>
                                                    <div className='flex'>
                                                        <img src={item.thumbnail} alt="thumbnail" className='w-[20rem] 4xl:w-[22rem] h-[11rem] 4xl:h-[12rem] object-cover cursor-pointer rounded-[15px]' />
                                                    </div>
                                                    <div className='flex mt-2 items-start gap-2'>
                                                        <div className='w-[3rem]'>
                                                            <img src={item.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] ml-2 rounded-full' />
                                                        </div>
                                                        <div className='flex flex-col ml-2 w-[13.5rem] 4xl:w-[15.5rem]'>
                                                        <div className='font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
                                                                {sawtitle}
                                                            </div>
                                                            <div className='text-[0.8rem]'>
                                                                <h1>{item.channel_name}</h1>
                                                            </div>
                                                            <div className='flex gap-2 text-[0.8rem]'>
                                                                <h1>{item.views} views</h1>
                                                                <hr className='w-[3px] h-[3px] bg-gray-800 rounded-full mt-[10px]' />
                                                                <h1>{timeAgo}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='text-[1.3rem] mt-1 p-2 rounded-full cursor-pointer hover:bg-gray-200' onClick={(e) => toggleOptions(e, index)}>
                                                            <HiOutlineDotsVertical />
                                                        </div>
                                                        {
                                                            sawhistory[index] ? <div className='absolute ml-[12rem] mt-[1rem] bg-white shadow-lg p-2 px-4' onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                RemoveFromWatchHistory(item.videoId, e)
                                                            }} ref={dropdownRef}>
                                                                <h1 className='font-semibold'>Remove From <br /> Watch History</h1>
                                                            </div> : <></>
                                                        }
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    })
                                ) : (
                                    <div className='flex justify-center'>
                                        <h1 className='text-[2rem] font-bold lg:mr-[11.5rem]'>History is Empty</h1>
                                    </div>
                                )
                            }
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}

export default History

/*
UserRouter.post('/clearwatchhistory',VerifyJWT, ClearWatchHistory);//no
*/