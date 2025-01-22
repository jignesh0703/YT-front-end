import React, { useContext, useEffect, useState } from 'react'
import { FaHome } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { CgPlayList } from "react-icons/cg";
import { BiLike } from "react-icons/bi";
import { GoVideo } from "react-icons/go";
import { Link, NavLink } from 'react-router-dom';
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';
import axios from 'axios';

const Mobile_Option = ({ setsawOption }) => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [Subscription, setSubscription] = useState([])

    useEffect(() => {
        if (!isLoggedin) {
            return;
        }
        const FetchSubsciber = async () => {
            try {
                const responce = await axios.get(`${URL}/api/subscription/getusersubscription`, {
                    withCredentials: true
                })
                setSubscription(responce.data.FindChannels)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        FetchSubsciber()
    }, [isLoggedin])

    return (
        <>
            <div className='w-full h-full absolute top-0 pt-[4rem] z-50' onClick={()=>setsawOption(false)}>
                <div className='flex-col h-full items-start pl-2 absolute bg-white pr-4 shadow-md'>
                    <NavLink
                        to='/'
                        className={({ isActive }) => isActive ? "bg-gray-200 rounded-[10px] overflow-hidden" : "text-gray-800"}
                    >
                        <div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                            <FaHome className='text-black text-[1.2rem]' />
                            <h1 className='font-semibold'>Home</h1>
                        </div>
                    </NavLink>
                    <div className='flex justify-center w-[10rem] my-1'>
                        <hr className='w-[8rem] h-[2px] bg-black' />
                    </div>
                    <NavLink
                        to='/history'
                        className={({ isActive }) => isActive ? "bg-gray-200 rounded-[10px] overflow-hidden" : "text-gray-800"}
                    >
                        <div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                            <MdHistory className='text-black text-[1.2rem]' />
                            <h1 className='font-semibold'>History</h1>
                        </div>
                    </NavLink>
                    <NavLink
                        to='/playlist'
                        className={({ isActive }) => isActive ? "bg-gray-200 rounded-[10px] overflow-hidden" : "text-gray-800"}
                    >
                        <div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                            <CgPlayList className='text-black text-[1.2rem]' />
                            <h1 className='font-semibold'>PlayList</h1>
                        </div>
                    </NavLink>
                    <NavLink
                        to='/yourvideo'
                        className={({ isActive }) => isActive ? "bg-gray-200 rounded-[10px] overflow-hidden" : "text-gray-800"}
                    >
                        <div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                            <GoVideo className='text-black text-[1.2rem]' />
                            <h1 className='font-semibold'>Your Videos</h1>
                        </div>
                    </NavLink>
                    <NavLink
                        to='/like'
                        className={({ isActive }) => isActive ? "bg-gray-200 rounded-[10px] overflow-hidden" : "text-gray-800"}
                    >
                        <div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                            <BiLike className='text-black text-[1.2rem]' />
                            <h1 className='font-semibold'>Liked Videos</h1>
                        </div>
                    </NavLink>
                    <div className='flex justify-center w-[10rem] my-1'>
                        <hr className='w-[8rem] h-[2px] bg-black' />
                    </div>
                    <div className='flex gap-2 items-center px-4 py-2 w-[10rem] rounded-[10px] duration-300'>
                        <h1 className='font-semibold'>Subscriptions</h1>
                    </div>
                    <div className='h-[30rem] overflow-hidden overflow-y-auto hide-scrollbar'>
                        {Subscription &&
                            Subscription.map((item, index) => {
                                return (item.channel &&
                                    <Link to={`/channel/${item.channel._id}`} key={index}><div className={`flex gap-2 items-center px-4 w-[10rem] py-2 rounded-[10px] duration-300 cursor-pointer hover:bg-gray-300`}>
                                        <img src={item.channel.avatar} alt="avatar" className='w-[1.8rem] h-[1.8rem] rounded-full' />
                                        <h1 className='font-semibold'>{item.channel.channel_name}</h1>
                                    </div></Link>
                                )
                            })
                        }
                    </div>
                    <div className='flex justify-center w-[10rem] my-1'>
                        <hr className='w-[8rem] h-[2px] bg-black' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mobile_Option