import React, { useContext, useState } from 'react'
import Navbar from '../Components/Navbar'
import { StoreContext } from "../context/Context";
import Profiles from '../Components/Profile';
import Options from '../Components/Options';
import User_Vidoes from '../Components/User_Vidoes';
import Mobile_Option from '../Components/Mobile_Option';

const Profile = () => {

  const { data, isLoggedin } = useContext(StoreContext);
  const [sawOption, setsawOption] = useState(false)

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