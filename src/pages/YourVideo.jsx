import React, { useState } from 'react'
import Options from '../Components/Options'
import Navbar from '../Components/Navbar'
import User_Video from '../Components/User_Video'
import Mobile_Option from '../Components/Mobile_Option'

const YourVideo = () => {

    const [sawOption, setsawOption] = useState(false)

    return (
        <>
            <Navbar setsawOption={setsawOption} sawOption={sawOption} />
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption} />
                }
                <User_Video />
            </div>
        </>
    )
}

export default YourVideo