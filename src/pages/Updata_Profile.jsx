import React, { useContext, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import { useState } from 'react'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify'
import axios from 'axios'
import { Oval } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import Mobile_Option from '../Components/Mobile_Option';
import Options from '../Components/Options';

const Updata_Profile = () => {

    const { data, isLoggedin, URL, checkLogin } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(false);

    const [formstate, setformstate] = useState({
        username: '',
        email: '',
        channel_name: ''
    })

    useEffect(() => {
        if (data) {
            setformstate({
                username: data.username,
                email: data.email,
                channel_name: data.channel_name
            });
        }
    }, [data]);

    const ChangeHandler = (e) => {
        setformstate({
            ...formstate,
            [e.target.name]: e.target.value
        });
    };

    const SubmitHandler = async (e) => {
        e.preventDefault();

        const Formdata = new FormData();
        Formdata.append('username', formstate.username)
        Formdata.append('email', formstate.email)
        Formdata.append('channel_name', formstate.channel_name)

        try {
            setIsLoading(true)
            const responce = await axios.patch(`${URL}/api/user/updatedetail`, Formdata, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            checkLogin()
            setformstate({
                username: data.username,
                email: data.email,
                channel_name: data.channel_name
            })
            toast.success(responce.data.message);
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
        setIsLoading(false)
    }

    const ChangeImageCoverImage = async (e) => {
        const formData = new FormData(); // Create a new FormData instance
        const file = e.target.files[0]
        if (file) {
            formData.append("coverimage", file); // Append the file
        }
        setIsLoading(true)
        try {
            const responce = await axios.patch(`${URL}/api/user/Changecoverimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Correct header type for file uploads
                },
                withCredentials: true
            });
            checkLogin();
            toast.success(responce.data.message);
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            toast.error("Somthing Wrong try again")
        }
        setIsLoading(false)
    }

    const ChangeImageAvatar = async (e) => {
        const formData = new FormData(); // Create a new FormData instance
        const file = e.target.files[0]
        if (file) {
            formData.append("avatar", file); // Append the file
        }
        setIsLoading(true)
        try {
            const responce = await axios.patch(`${URL}/api/user/changeavatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Correct header type for file uploads
                },
                withCredentials: true
            });
            checkLogin();
            toast.success(responce.data.message);
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            toast.error("Somthing Wrong try again")
        }
        setIsLoading(false)
    }

    const [sawOption, setsawOption] = useState(false)

    return (
        <>
            {isLoading && (
                <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
                    <Oval type="Oval" color="#00BFFF" height={50} width={50} />
                </div>
            )}
            <Navbar setsawOption={setsawOption} sawOption={sawOption} />
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption} />
                }
                {
                    isLoggedin && data
                        ? <div className='flex justify-center mt-[2rem] w-full lg:mr-[10rem] 2xl:mr-[12rem]'>
                            <div className='w-[80%]'>
                                <div className='w-full justify-center flex flex-col items-center'>
                                    <img src={data.coverimage} alt="cover_image" className='w-[20rem] h-[8rem] sm:w-[80%] xl:w-[70%] 2xl:w-[60%] sm:h-[10rem] md:h-[12rem]' />
                                    <div className='flex justify-center items-center'>
                                        <label htmlFor="coverimage" className='text-blue-500 font-bold cursor-pointer border-b-[1.5px] border-blue-500 transition duration-200'>
                                            Change Cover image
                                        </label>
                                    </div>
                                    <input type="file" id='coverimage' onChange={ChangeImageCoverImage} hidden />
                                </div>
                                <div className='flex justify-center gap-4 sm:gap-14 md:gap-[5rem] lg:gap-[5rem] xl:gap-[10rem] 2xl:gap-[20rem] mt-8 w-full flex-col sm:flex-row'>
                                    <div className='sm:w-max sm:h-max flex flex-col justify-center items-center mt-3'>
                                        <img src={data.avatar} alt="avatar" className='w-[6rem] sm:w-[8rem] h-[6rem] sm:h-[8rem] rounded-full' />
                                        <div className='flex justify-center'>
                                            <label htmlFor="cover_image" className='text-blue-500 font-bold cursor-pointer border-b-[1.5px] border-blue-500 transition duration-200 text-[.9rem] sm:text-base'>
                                                Change Avatar
                                            </label>
                                        </div>
                                        <input type="file" id='cover_image' onChange={ChangeImageAvatar} hidden />
                                    </div>
                                    <form onSubmit={SubmitHandler} className=''>
                                        <h1 className='text-[1.5rem] font-bold'>Update Profile</h1>
                                        <div className='flex flex-col gap-1 mt-2'>
                                            <label htmlFor="username" className='text-[1.3rem]'>Username</label>
                                            <input
                                                type="text"
                                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                                name="username"
                                                value={formstate.username}
                                                onChange={ChangeHandler}
                                                required />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="email" className='text-[1.3rem]'>Email</label>
                                            <input
                                                type="text"
                                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                                name="email"
                                                value={formstate.email}
                                                onChange={ChangeHandler}
                                                required />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label htmlFor="channle_name" className='text-[1.3rem]'>Channel Name</label>
                                            <input
                                                type="text"
                                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                                name="Channel_Name"
                                                value={formstate.channel_name}
                                                onChange={ChangeHandler}
                                                required />
                                        </div>
                                        <Link to='/updatepassword'>
                                            <div>
                                                <h1 className='text-[#F14A00] font-bold border-b-[1.5px] border-[#F14A00] w-max cursor-pointer mt-2 ml-2'>Update Password?</h1>
                                            </div>
                                        </Link>
                                        <div>
                                            <button type="submit" className='flex justify-center items-center w-[20rem] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] h-[2.2rem] outline-none bg-[#F14A00] mt-3 text-[1.1rem] font-bold text-white rounded-[5px]'>Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        : <></>
                }
            </div>
        </>
    )
}

export default Updata_Profile