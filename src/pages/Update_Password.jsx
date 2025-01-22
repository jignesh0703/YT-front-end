import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import { useContext } from 'react';
import { StoreContext } from "../context/Context";
import { useNavigate } from 'react-router-dom';
import Options from '../Components/Options';
import Mobile_Option from '../Components/Mobile_Option';

const Update_Password = () => {

    const { URL } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(false);
    const Navigation = useNavigate()
    const [sawOption, setsawOption] = useState(false)

    const [formdata, setformdata] = useState({
        oldpassword: '',
        newpassword: '',
        confirmpassword: ''
    })

    const ChangeInputHandler = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        })
    }

    const SubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('oldpassword', formdata.oldpassword)
        formData.append('newpassword', formdata.newpassword)
        formData.append('confirmpassword', formdata.confirmpassword)

        try {
            setIsLoading(true)
            const responce = await axios.post(`${URL}/api/user/updatepass`, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            toast.success(responce.data.message)
            setformdata({
                oldpassword: '',
                newpassword: '',
                confirmpassword: ''
            })
            Navigation('/')
        } catch (error) {
            setIsLoading(false)
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
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
            <Navbar setsawOption={setsawOption} sawOption={sawOption}/>
            <div className='flex'>
            <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption}/>
                }
                <div className='flex justify-center mt-8 w-full lg:mr-[10rem] 2xl:mr-[12rem]'>
                    <div className='flex justify-center items-center flex-col shadow-2xl w-max p-10 rounded-[15px] h-max'>
                        <div className='flex justify-center text-[1.5rem] font-bold border-[#454545] border-b w-full py-2'>
                            Update Password
                        </div>
                        <form className='mt-2' onSubmit={SubmitHandler}>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="old_password" className='text-[1.3rem]'>Old Password</label>
                                <input
                                    type="password"
                                    name="oldpassword"
                                    value={formdata.oldpassword}
                                    onChange={ChangeInputHandler}
                                    className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                    required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="newpassword" className='text-[1.3rem]'>New Password</label>
                                <input
                                    type="password"
                                    name="newpassword"
                                    value={formdata.newpassword}
                                    onChange={ChangeInputHandler}
                                    className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                    required />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="confirmpassword" className='text-[1.3rem]'>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    value={formdata.confirmpassword}
                                    onChange={ChangeInputHandler}
                                    className='border-[1px] border-[#454545] w-[18rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                    required />
                            </div>
                            <div>
                                <button type="submit" className='flex justify-center items-center w-[18rem] sm:w-[25rem] h-[2.2rem] outline-none bg-[#F14A00] mt-4 text-[1.1rem] font-bold text-white rounded-[5px]'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Update_Password