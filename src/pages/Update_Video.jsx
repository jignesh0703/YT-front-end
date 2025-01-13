import React, { useContext, useEffect, useState } from 'react'
import Default from '../images/default.png'
import { StoreContext } from "../context/Context";
import { Oval } from 'react-loader-spinner';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';

const Update_Video = () => {

  const { URL } = useContext(StoreContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [ThumbnailFile, setThumbnailFile] = useState(null)
  const Navigate = useNavigate()
  const [formData, setformData] = useState({
    thumbnail: Default,
    title: '',
    desciption: ''
  })

  const ChangeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const ChangeThumbnail = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file),
        setformData({
          ...formData,
          thumbnail: window.URL.createObjectURL(file)
        })
    }
  }

  const SubmitHandler = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append('title', formData.title)
    formdata.append('desciption', formData.desciption)

    if (ThumbnailFile) {
      formdata.append("thumbnail", ThumbnailFile);
    }

    try {
      setIsLoading(true)
      const responce = await axios.put(`${URL}/api/video/updatevideo/${id}`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      Navigate('/')
      toast.success(responce.data.message)
      setformData({
        thumbnail: Default,
        title: '',
        desciption: ''
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

  const [isToggled, setisToggled] = useState(null)

  const CheckVideoPublic = async () => {
    try {
      const responce = await axios.get(`${URL}/api/video/checkvideopublic/${id}`, {
        withCredentials: true
      })
      if (responce.data.isPublished) {
        setisToggled(true)
      } else {
        setisToggled(false)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    CheckVideoPublic()
  }, [])

  const handleToggle = async () => {
    setisToggled((prevState) => !prevState);
    try {
      await axios.put(`${URL}/api/video/togglevideopublic/${id}`, {}, {
        withCredentials: true
      })
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
          <Oval type="Oval" color="#00BFFF" height={50} width={50} />
        </div>
      )}
      <div className='flex justify-center h-screen bg-[#f0f4f9] w-full pt-2'>
        <div className='p-4 px-12 shadow-md bg-white mt-[5rem]'>
          <div className='flex justify-center text-[2rem] text-[#F14A00] font-bold mb-3 border-b-[1px] border-[#454545] pb-2'>
            <h1>Update Video Here</h1>
          </div>
          <form className='flex flex-col gap-2 mt-2' onSubmit={SubmitHandler}>
            <div className='flex flex-col gap-1'>
              <label htmlFor="thumbnail" className='text-[1.3rem]'>Thumbnail</label>
              <label htmlFor="thumbnail">
                <img
                  src={formData.thumbnail}
                  alt="thumbnail"
                  className='w-[25rem] cursor-pointer h-[10rem] object-fill' />
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
                className='border-[1px] border-[#454545] w-[24rem] h-[2rem] outline-none pl-4 bg-slate-100 rounded-[5px]'
                name="title"
                value={formData.title}
                onChange={ChangeHandler}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="desciption" className='text-[1.3rem]'>Description</label>
              <textarea
                name="desciption"
                cols="30"
                rows="8"
                className='border-[1px] border-[#454545] w-[24rem] outline-none pl-4 pt-1 bg-slate-100 rounded-[5px]'
                value={formData.desciption}
                onChange={ChangeHandler}
              ></textarea>
            </div>
            <div className="flex gap-4 items-center mt-2">
              <label htmlFor="isPublished" className="text-[1.3rem]">Publish</label>
              <div
                className={`ml-[5rem] relative w-[55px] h-[28px] bg-gray-300 rounded-full cursor-pointer flex justify-center items-center ${isToggled ? 'bg-green-300' : 'bg-red-300'}`}
                onClick={handleToggle}
              >
                <div
                  className={`absolute top-1/2 left-1 h-[20px] w-[20px] bg-black rounded-full transform -translate-y-1/2 transition-transform duration-300 ${isToggled ? 'translate-x-[25px]' : 'translate-x-0'
                    }`}
                ></div>
              </div>
            </div>

            <div>
              <button type="submit" className='flex justify-center items-center w-[25rem] h-[2.2rem] outline-none bg-[#F14A00] mt-4 text-[1.1rem] font-bold text-white rounded-[5px]'>Update Video</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )

}

export default Update_Video