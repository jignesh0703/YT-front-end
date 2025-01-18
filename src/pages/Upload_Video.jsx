import React, { useState } from 'react'
import Default from '../images/default.png'
import { useContext } from 'react';
import { StoreContext } from "../context/Context";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Upload_Video = () => {

    const { URL } = useContext(StoreContext);
    const nevigation = useNavigate();
    const [ThumbnailFile, setThumbnailFile] = useState(null)
    const [VideoFile, setVideoFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const [formdata, setformdata] = useState({
        title: '',
        desciption: '',
        isPublished: 'true',
        videolink: Default,
        thumbnail: Default
    })

    const ChangeHandler = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const ChangeThumbnail = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbnailFile(file)
            setformdata({
                ...formdata,
                thumbnail: window.URL.createObjectURL(file)
            })
        }
    }

    const ChangeVideo = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoFile(file);
            setformdata({
                ...formdata,
                videolink: window.URL.createObjectURL(file)
            })
        }
    }

    const SubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', formdata.title)
        formData.append('desciption', formdata.desciption)
        formData.append('isPublished', formdata.isPublished)

        if (VideoFile) {
            formData.append("videolink", VideoFile);
          }
      
          if (ThumbnailFile) {
            formData.append("thumbnail", ThumbnailFile);
          }

        try {
            setIsLoading(true)
            const responce = await axios.post(`${URL}/api/video/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials : true
            })
            toast.success(responce.data.message)
            nevigation('/')
            setformdata({
                title: '',
                desciption: '',
                isPublished: 'true',
                videolink: Default,
                thumbnail: Default
            })
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
            <div className='flex justify-center h-max bg-[#f0f4f9] w-full pt-2'>
                <div className='p-4 px-12 shadow-md bg-white'>
                    <div className='flex justify-center text-[2rem] text-[#F14A00] font-bold mb-3 border-b-[1px] border-[#454545] pb-2'>
                        <h1>Upload Video Here</h1>
                    </div>
                    <form className='flex flex-col gap-2 mt-2' onSubmit={SubmitHandler}>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="videolink" className='text-[1.3rem]'>Video</label>
                            <label htmlFor="videolink">
                                {formdata.videolink !== Default ? (
                                    <video controls className="w-[25rem] h-[10rem]">
                                        <source src={formdata.videolink} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={formdata.videolink}
                                        alt="videolink"
                                        className='w-[20rem] sm:w-[25rem] cursor-pointer h-[8rem] sm:h-[10rem] object-fill'
                                    />
                                )}
                            </label>
                            <input
                                type="file"
                                name='videolink'
                                id='videolink'
                                onChange={ChangeVideo}
                                hidden />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="thumbnail" className='text-[1.3rem]'>Thumbnail</label>
                            <label htmlFor="thumbnail">
                                <img
                                    src={formdata.thumbnail}
                                    alt="thumbnail"
                                    className='w-[20rem] sm:w-[25rem] cursor-pointer h-[8rem] sm:h-[10rem] object-fill' />
                            </label>
                            <input
                                type="file"
                                name='thumbnail'
                                id='thumbnail'
                                onChange={ChangeThumbnail}
                                hidden />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="title" className='text-[1.3rem]'>Title</label>
                            <input
                                type="text"
                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                                name="title"
                                value={formdata.title}
                                onChange={ChangeHandler}
                                required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="desciption" className='text-[1.3rem]'>Description</label>
                            <textarea
                                name="desciption"
                                cols="30"
                                rows="8"
                                value={formdata.desciption}
                                onChange={ChangeHandler}
                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[24rem] outline-none pl-4 pt-1 bg-slate-100 rounded-[5px]'
                                required
                            ></textarea>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email or username" className='text-[1.3rem]'>Publish</label>
                            <select
                                name="isPublished"
                                className='border-[1px] border-[#454545] w-[20rem] sm:w-[24rem] outline-none pl-4 bg-slate-100 rounded-[5px] cursor-pointer'
                                value={formdata.isPublished}
                                onChange={ChangeHandler}
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" className='flex justify-center items-center w-[20rem] sm:w-[25rem] h-[2.2rem] outline-none bg-[#F14A00] mt-4 text-[1.1rem] font-bold text-white rounded-[5px]'>Upload Video</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Upload_Video