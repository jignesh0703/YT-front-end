import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import { useParams } from 'react-router-dom'
import { StoreContext } from "../context/Context";
import axios from 'axios';
import { toast } from 'react-toastify';
import Profile from '../Components/Profile';
import User_Vidoes from '../Components/User_Vidoes';
import Mobile_Option from '../Components/Mobile_Option';

const Channel_Profile = () => {

  const { URL } = useContext(StoreContext);
  const { id } = useParams()
  const [ChannelData, setChannelData] = useState([])
  const [sawOption, setsawOption] = useState(false)

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
      <Navbar setsawOption={setsawOption} sawOption={sawOption} />
      <div className='flex'>
        <Options />
        {
          sawOption && <Mobile_Option setsawOption={setsawOption} />
        }
        <div className='flex mt-4 lg:ml-[2rem] flex-col'>
          {
            ChannelData.map((item, index) => {
              return <Profile id={item._id} coverimage={item.coverimage} avatar={item.avatar} channel_name={item.channel_name} username={item.username} key={index} />
            })
          }
          <div className='flex justify-center flex-wrap mt-6 md:mt-0'>
            <User_Vidoes />
          </div>
        </div>
      </div>
    </>
  )
}

export default Channel_Profile