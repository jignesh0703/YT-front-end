import React, { useContext } from 'react'
import Navbar from '../Components/Navbar'
import { StoreContext } from "../context/Context";
import Profiles from '../Components/Profile';
import Options from '../Components/Options';

const Profile = () => {

  const { data, isLoggedin } = useContext(StoreContext);

  return (
    <>
      <Navbar />
      <div className='flex'>
        <Options />
        <div className='flex justify-center mt-4 ml-[2rem]'>
          {
            isLoggedin && data
              ? <Profiles id={data.id} coverimage={data.coverimage} avatar={data.avatar} channel_name={data.channel_name} username={data.username} isLoggedin={isLoggedin}/>
              : <></>
          }
        </div>
      </div>
    </>
  )
}

export default Profile