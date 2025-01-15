import React, { useContext } from 'react'
import Default from '../images/default.png'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Oval } from 'react-loader-spinner';  // Named import for the component
import { useNavigate } from 'react-router-dom';
import { StoreContext } from "../context/Context";


const Signup_Login = () => {

    const { checkLogin, URL } = useContext(StoreContext);

    const nevigation = useNavigate();

    const [Loginstate, setLoginstate] = useState("Login")
    const [isLoading, setIsLoading] = useState(false);

    const ChangeLoginToSignup = () => {
        if (Loginstate === "Login") {
            setLoginstate("Sign UP")
        } else {
            setLoginstate("Login")
        }
    }

    const [formData, setformData] = useState({
        emailorusername: "",
        email: "",
        username: "",
        channel_name: "",
        password: "",
        avatar: Default,
        coverimage: Default
    })

    const ChangeInput = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const ChangeAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            setformData({
                ...formData,
                avatar: window.URL.createObjectURL(file)
            })
        }
    }

    const ChangeCoverImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setformData({
                ...formData,
                coverimage: window.URL.createObjectURL(file)
            })
        }
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const Formdata = new FormData();
        Formdata.append("emailorusername", formData.emailorusername);
        Formdata.append("email", formData.email);
        Formdata.append("username", formData.username);
        Formdata.append("channel_name", formData.channel_name);
        Formdata.append("password", formData.password);

        if (formData.avatar !== Default) {
            const avatarFile = document.querySelector('#avatar').files[0];
            if (avatarFile) {
                Formdata.append("avatar", avatarFile);
            }
        }

        if (formData.coverimage !== Default) {
            const coverImageFile = document.querySelector('#coverimage').files[0];
            if (coverImageFile) {
                Formdata.append("coverimage", coverImageFile);
            }
        }

        try {
            if (Loginstate === "Login") {
                const responce = await axios.post(`${URL}/api/user/login`, Formdata, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                checkLogin()
                setformData({
                    emailorusername: "",
                    email: "",
                    username: "",
                    channel_name: "",
                    password: "",
                    avatar: Default,
                    coverimage: Default
                })
                toast.success(responce.data.message);
                nevigation('/')
            } else {
                const responce = await axios.post(`${URL}/api/user/add`, Formdata, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                toast.success(responce.data.message);
                await checkLogin();
                setformData({
                    emailorusername: "",
                    email: "",
                    username: "",
                    channel_name: "",
                    password: "",
                    avatar: Default,
                    coverimage: Default
                });
                setLoginstate("Login")
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Network problem, check your network connection');
            }
        }
        setIsLoading(false);
    }

    return (
        <>
            {isLoading && (
                <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
                    <Oval type="Oval" color="#00BFFF" height={50} width={50} />
                </div>
            )}
            <div className={`flex justify-center bg-[#f0f4f9] w-full ${Loginstate === 'Login' ? 'h-screen' : 'h-max pb-4'}`}>
                <div className={`flex justify-center bg-white w-max h-max shadow-md ${Loginstate === "Login" ? 'mt-[10%]' : 'mt-[2%]'}`}>
                    <div className='p-4 px-12'>
                        <div className='flex justify-center text-[2rem] text-[#F14A00] font-bold mb-3 border-b-[1px] border-[#454545] pb-2'>
                            <h1>{Loginstate} Here</h1>
                        </div>
                        <form className='flex flex-col gap-2 mt-6' onSubmit={HandleSubmit}>
                            {
                                Loginstate === "Sign UP"
                                    ? <div>
                                        <label htmlFor="avtar_name" className='text-[1.3rem]'>Avatar</label>
                                        <label htmlFor="avatar" className='flex justify-center'>
                                            <img
                                                src={formData.avatar}
                                                alt="avatar"
                                                className='rounded-full w-[6rem] sm:w-[8rem] h-[6rem] sm:h-[8rem] cursor-pointer object-cover' />
                                        </label>
                                        <input
                                            type="file"
                                            id='avatar'
                                            name='avatar'
                                            onChange={ChangeAvatar}
                                            hidden />
                                    </div>
                                    : <></>
                            }
                            {
                                Loginstate === "Sign UP"
                                    ? <div className='flex flex-col gap-1'>
                                        <label htmlFor="avtar_name" className='text-[1.3rem]'>Cover Image</label>
                                        <label htmlFor="coverimage">
                                            <img
                                                src={formData.coverimage}
                                                alt="coverimage"
                                                className='w-[18rem] sm:w-[25rem] cursor-pointer h-[8rem] sm:h-[10rem] object-fill' />
                                        </label>
                                        <input
                                            type="file"
                                            id='coverimage'
                                            name='coverimage'
                                            onChange={ChangeCoverImage}
                                            hidden />
                                    </div>
                                    : <></>
                            }
                            {
                                Loginstate === "Login"
                                    ? <div className='flex flex-col gap-1'>
                                        <label htmlFor="email or username" className='text-[1.3rem]'>Email Address or username</label>
                                        <input
                                            type="text"
                                            className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                            name="emailorusername"
                                            value={formData.emailorusername}
                                            onChange={ChangeInput}
                                            required />
                                    </div>
                                    : <></>
                            }
                            {
                                Loginstate === "Sign UP"
                                    ? <div className='flex flex-col gap-1'>
                                        <label htmlFor="email" className='text-[1.3rem]'>Email</label>
                                        <input
                                            type="text"
                                            className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                            name="email"
                                            value={formData.email}
                                            onChange={ChangeInput}
                                            required />
                                    </div>
                                    : <></>
                            }
                            {
                                Loginstate === "Sign UP"
                                    ? <div className='flex flex-col gap-1'>
                                        <label htmlFor="email" className='text-[1.3rem]'>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={ChangeInput}
                                            className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                            required />
                                    </div>
                                    : <></>
                            }
                            {
                                Loginstate === "Sign UP"
                                    ? <div className='flex flex-col gap-1'>
                                        <label htmlFor="channel_name" className='text-[1.3rem]'>Channel Name</label>
                                        <input
                                            type="text"
                                            className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                            name="channel_name"
                                            value={formData.channel_name}
                                            onChange={ChangeInput}
                                            required />
                                    </div>
                                    : <></>
                            }
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password" className='text-[1.3rem]'>Password</label>
                                <input
                                    type="password"
                                    className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                    name="password"
                                    value={formData.password}
                                    onChange={ChangeInput}
                                    required />
                            </div>
                            <div>
                                <button type="submit" className='flex justify-center items-center w-[18rem] sm:w-[25rem] h-[2.2rem] outline-none bg-[#F14A00] mt-4 text-[1.1rem] font-bold text-white rounded-[5px]'>{Loginstate}</button>
                            </div>
                            <div className='flex gap-2 text-[1.2rem] mt-2 font-medium flex-wrap justify-center '>
                                {
                                    Loginstate === "Login" ? <p> Don't have account? </p> : <p> Already have a account? </p>
                                }
                                <a onClick={ChangeLoginToSignup} className='text-[#F14A00] cursor-pointer font-bold'>
                                    {
                                        Loginstate === "Login" ? <p>Sign Up here</p> : <p>Login here</p>
                                    }
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup_Login