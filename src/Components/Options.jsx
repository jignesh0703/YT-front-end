import React, { useState } from 'react'
import { FaHome } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { CgPlayList } from "react-icons/cg";
import { BiLike } from "react-icons/bi";
import { GoVideo } from "react-icons/go";
import { NavLink } from 'react-router-dom';

const Options = () => {

    return (
        <>
            <div className='flex flex-col items-start pl-2'>
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
                <div className='flex gap-2 items-center px-4 py-2 w-[10rem] rounded-[10px] hover:bg-gray-200 duration-300 cursor-pointer'>
                    <h1 className='font-semibold'>Subscriptions</h1>
                </div>
            </div>
        </>
    )
}

export default Options