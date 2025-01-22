import React, { useState } from 'react'
import Videos from '../Components/Videos'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import Mobile_Option from '../Components/Mobile_Option'

const Home = () => {

    const [sawOption, setsawOption] = useState(false)

    return (
        <>
            <Navbar setsawOption={setsawOption} sawOption={sawOption}/>
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption}/>
                }
                <Videos />
            </div>
        </>
    )
}

export default Home