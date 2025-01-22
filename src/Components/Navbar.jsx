import React, { useContext, useEffect, useRef, useState } from 'react'
import { HiOutlineBars3 } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { TfiPlus } from "react-icons/tfi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Default from '../images/default.png'
import { Link } from 'react-router-dom';
import { StoreContext } from "../context/Context";
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setsawOption, sawOption }) => {

    const Navigate = useNavigate()

    const { isLoggedin, data, URL, checkLogin } = useContext(StoreContext);
    const [sawlogin, setsawlogin] = useState(false)
    const dropdownRef = useRef(null);
    const [sawsearch, setsawsearch] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setsawlogin(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const LogoutHandler = async () => {
        try {
            const response = await axios.post(`${URL}/api/user/logout`, {}, { withCredentials: true });
            toast.success(response.data.message);
            setsawlogin(false)
            checkLogin()
            Navigate('/')
        } catch (error) {
            setsawlogin(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    const UploadVideo = () => {
        if (isLoggedin) {
            Navigate('/uploadvideo')
        } else {
            toast.error('Login is Required!')
        }
    }

    return (
        <>
            <div className='flex p-4 items-center justify-between sm:justify-start'>
                <div className='flex items-center gap-6 w-[15%] justify-center'>
                    <HiOutlineBars3 className='text-[2rem] cursor-pointer lg:hidden' onClick={() => setsawOption(sawOption ? false : true)} />
                    <h1 className='text-[1.3rem] font-semibold hidden lg:flex'>StreamSphere</h1>
                </div>
                <div className='sm:w-[70%] flex justify-center'>
                    <div className='border border-[#454545] items-center rounded-full overflow-hidden hidden sm:flex'>
                        <input type="text" placeholder='Search' className='text-[1.2rem] lg:w-[25rem] pl-4 h-[2.5rem] border-none outline-none' />
                        <CiSearch className='cursor-pointer hover:bg-slate-200 w-[5rem] h-[2.5rem] p-2 border-l-[1px] border-[#454545] text-center transition duration-200' />
                    </div>
                </div>
                {
                    sawsearch
                        ? <div className='w-full h-full flex justify-center items-start top-0 left-0 fixed blacks-overlay z-50' onClick={() => setsawsearch(false)}>
                            <div className='border border-[#454545] items-center justify-center w-max rounded-full overflow-hidden flex mt-[3rem] ml-4 z-50' onClick={(e) => {
                                e.stopPropagation()
                            }}>
                                <input type="text" placeholder='Search' className='text-[1.2rem] w-[18rem] pl-4 h-[2.5rem] border-none outline-none' />
                                <CiSearch className='cursor-pointer hover:bg-slate-200 w-[4rem] h-[2.5rem] p-2 border-l-[1px] border-[#454545] text-center transition duration-200' />
                            </div>
                        </div>
                        : <></>
                }

                <div className='flex xl:w-[15%] justify-center items-center gap-4 sm:gap-6'>
                    <div className='flex px-2 lg:px-4 py-2 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] cursor-pointer items-center sm:hidden' onClick={() => setsawsearch(true)}>
                        <CiSearch className='text-[1.3rem]' />
                    </div>
                    <div className='flex px-2 lg:px-4 py-2 rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] cursor-pointer items-center gap-2' onClick={UploadVideo}>
                        <TfiPlus className='text-[1.2rem]' />
                        <h1 className='font-bold text-gray-700  hidden lg:flex'>Create</h1>
                    </div>
                    {
                        isLoggedin
                            ? <div className='overflow-hidden cursor-pointer flex justify-center items-center' onClick={() => setsawlogin(true)}>
                                <img src={data.avatar} alt="profile_avatar" className='object-cover w-[2.3rem] h-[2.3rem] rounded-full' />
                            </div>
                            : <Link to={`/login-signup`}>
                                <div className='w-[2.3rem] h-[2.3rem] rounded-full overflow-hidden cursor-pointer flex justify-center items-center'>
                                    <img src={Default} alt="profile_avatar" className='object-cover' />
                                </div>
                            </Link>
                    }
                    {
                        sawlogin ? (
                            isLoggedin && data ? (
                                <div ref={dropdownRef} className='absolute shadow-md p-2 bg-white w-max mb-[-10rem] right-0 mr-[.5rem] lg:mr-[1.5rem] xl:mr-[2.5rem] 2xl:mr-[3.5rem]'>
                                    <div className='flex items-start'>
                                        <img src={data?.avatar} alt="avatar" className='mt-2 w-[2.3rem] h-[2.3rem] rounded-full overflow-hidden cursor-pointer flex justify-center items-center object-cover' />
                                        <div className='ml-2'>
                                            <div>
                                                <h1 className='font-medium'>{data.username}</h1>
                                                <h1 className='font-medium'>{data.email}</h1>
                                            </div>
                                            <Link to={`/profile/${data._id}`} >
                                                <h1 className='text-blue-500 text-[0.7rem] font-bold cursor-pointer' onClick={() => setsawlogin(false)}>View your channel</h1>
                                            </Link>
                                        </div>
                                    </div>
                                    <hr className="border-t-1 border-[#454545] my-2 opacity-50" />
                                    <div className='flex items-center pl-1 p-1 gap-3 cursor-pointer w-full hover:bg-[#e9ebf0] duration-200' onClick={LogoutHandler}>
                                        <RiLogoutBoxRLine />
                                        <h1>Sign out</h1>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )
                        )
                            : <></>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar