import React, { useContext } from 'react'
import Navbar from '../Components/Navbar'
import { StoreContext } from "../context/Context";
import Profiles from '../Components/Profile';
import Options from '../Components/Options';
import User_Vidoes from '../Components/User_Vidoes';

const Profile = () => {

  const { data, isLoggedin } = useContext(StoreContext);

  return (
    <>
      <Navbar />
      <div className='flex'>
        <Options />
        <div className='flex mt-4 ml-[2rem] flex-col items-center'>
          {
            isLoggedin && data
              ? <Profiles id={data._id} coverimage={data.coverimage} avatar={data.avatar} channel_name={data.channel_name} username={data.username} isLoggedin={isLoggedin} />
              : <></>
          }
          <div className='flex justify-center flex-wrap'>
            <User_Vidoes />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile