import React from 'react'
import Options from '../Components/Options'
import History_Component from '../Components/History'
import Navbar from '../Components/Navbar'

const History = () => {
    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <History_Component />
            </div>
        </>
    )
}

export default History