import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from "../context/Context";

const Profile = ({ id, coverimage, avatar, username, channel_name, isLoggedin }) => {

  const { URL } = useContext(StoreContext);
  const [Check, setCheck] = useState(null)

  useEffect(() => {
    const CheckChannel = async () => {
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
  }, [id, URL])

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
              <h1>12k Subscribers</h1>
              <hr className='w-[5px] h-[5px] bg-gray-800 rounded-full mt-[5px]' />
              <h1>120 Videos</h1>
            </div>
            {
              isLoggedin ? <Link to="/update">
              <div className='mt-2'>
                <button className='bg-black text-white p-2 px-4 rounded-[20px] font-bold text-[0.8rem] hover:bg-[#454545] transition duration-200 border-none'>
                  Update Profile
                </button>
              </div>
            </Link>
              : <></>
            }
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
            <button className='bg-black text-white p-2 px-6 rounded-[20px] font-bold'>Subscribe</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile