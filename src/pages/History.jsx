import React, { useState } from 'react'
import Options from '../Components/Options'
import History_Component from '../Components/History'
import Navbar from '../Components/Navbar'
import Mobile_Option from '../Components/Mobile_Option'

const History = () => {

    const [sawOption, setsawOption] = useState(false)

    return (
        <>
            <Navbar setsawOption={setsawOption} sawOption={sawOption}/>
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption} />
                }
                <History_Component />
            </div>
        </>
    )
}

export default History