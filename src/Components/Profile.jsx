import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';

const Profile = ({ id, coverimage, avatar, username, channel_name }) => {

  const { URL, isLoggedin } = useContext(StoreContext);
  const [Check, setCheck] = useState(null)
  const [Subscribe, setSubscribe] = useState(false)
  const [SubscriberCount, setSubscriberCount] = useState(null)
  const [tracksubsciber, settracksubsciber] = useState(false)
  const [CountUserVideos, setCountUserVideos] = useState(null)

  useEffect(() => {
    const CheckChannel = async () => {
      if (!isLoggedin) {
        return;
      }
      try {
        const responce = await axios.get(`${URL}/api/user/checkchannel/${id}`, {
          withCredentials: true
        })
        setCheck(responce.data.user)
      } catch (error) {
        setCheck(false)
      }
    }
    CheckChannel()
  }, [id, URL, isLoggedin])

  const SubscribeToggle = async () => {
    try {
      const responce = await axios.post(`${URL}/api/subscription/c/${id}`, {}, {
        withCredentials: true
      })
      settracksubsciber(!tracksubsciber)
      setSubscribe(responce.data.isSubscribed)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  }

  useEffect(() => {
    const CheckIsSubscribed = async () => {
      if (!isLoggedin) {
        return;
      }
      try {
        const responce = await axios.get(`${URL}/api/subscription/check/${id}`, {
          withCredentials: true
        })
        setSubscribe(responce.data.isSubscribed)
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    }
    CheckIsSubscribed()
  }, [isLoggedin,id])

  useEffect(() => {
    const FetchSubsciber = async () => {
      try {
        const responce = await axios.get(`${URL}/api/subscription/c/${id}`, {
          withCredentials: false
        })
        setSubscriberCount(responce.data.subscriber.length)
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    }
    FetchSubsciber()
  }, [tracksubsciber])

  useEffect(() => {
    const GetUserVidoes = async () => {
      try {
        const responce = await axios.get(`${URL}/api/video/getchannelvideos/${id}`, {
          withCredentials: false
        })
        setCountUserVideos(responce.data.Videos.length)
      } catch (error) {
      }
    }
    GetUserVidoes()
  }, [URL, id])

  return (
    <>
      <div className='w-[80%] flex justify-center flex-col'>
        <div className='h-[15rem] overflow-hidden object-fill w-[75rem]'>
          <img src={coverimage} alt="cover_image" className='w-[75rem] h-[15rem] object-cover' />
        </div>
        <div className='flex gap-4 ml-4 w-[92.8rem]'>
          <div className="w-[8rem] h-[8rem] rounded-full overflow-hidden mt-2">
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className='mt-1'>
            <h1 className='text-[2rem] font-bold'>{channel_name}</h1>
            <h1 className='ml-1'>{username}</h1>
            <div className='flex items-start gap-1 w-max'>
              <h1>{SubscriberCount} Subscribers</h1>
              <hr className='w-[5px] h-[5px] bg-gray-800 rounded-full mt-[5px]' />
              <h1>{CountUserVideos} Videos</h1>
            </div>
            {
              Check === 'true' ? <Link to="/update">
                <div className='mt-2'>
                  <button className='bg-black text-white p-2 px-4 rounded-[20px] font-bold text-[0.8rem] hover:bg-[#454545] transition duration-200 border-none'>
                    Update Profile
                  </button>
                </div>
              </Link>
                : <></>
            }
          </div>
          <div className='ml-[35rem] mt-[2rem]'>
            <button className={`text-white p-2 px-6 rounded-[20px] font-bold ${Subscribe ? 'bg-slate-600' : 'bg-black'} `} onClick={SubscribeToggle}>{isLoggedin && Subscribe ? 'Unsubscribed' : 'Subscribed'}</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile