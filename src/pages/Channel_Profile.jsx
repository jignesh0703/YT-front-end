import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import { useParams } from 'react-router-dom'
import { StoreContext } from "../context/Context";
import axios from 'axios';
import { toast } from 'react-toastify';
import Profile from '../Components/Profile';
import User_Vidoes from '../Components/User_Vidoes';

const Channel_Profile = () => {

  const { URL } = useContext(StoreContext);
  const { id } = useParams()
  const [ChannelData, setChannelData] = useState([])

  useEffect(() => {
    const GetChannelData = async () => {
      try {
        const responce = await axios.get(`${URL}/api/user/getuserchannel/${id}`, {
          withCredentials: false
        });
        setChannelData(responce.data.Channel)
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    }
    GetChannelData()
  }, [id, URL])

  return (
    <>
      <Navbar />
      <div className='flex'>
        <Options />
        <div className='flex justify-center mt-4 ml-[2rem]'>
          {
            ChannelData.map((item, index) => {
              return <Profile id={item._id} coverimage={item.coverimage} avatar={item.avatar} channel_name={item.channel_name} username={item.username} key={index} />
            })
          }
        </div>
      </div>
      <div className='flex justify-center'>
        <User_Vidoes id={ChannelData._id}/>
      </div>
    </>
  )
}

export default Channel_Profile