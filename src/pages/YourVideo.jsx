import React from 'react'
import Options from '../Components/Options'
import Navbar from '../Components/Navbar'
import User_Video from '../Components/User_Video'

const YourVideo = () => {
    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <User_Video />
            </div>
        </>
    )
}

export default YourVideo