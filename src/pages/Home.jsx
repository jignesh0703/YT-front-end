import React from 'react'
import Videos from '../Components/Videos'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'

const Home = () => {
    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <Videos />
            </div>
        </>
    )
}

export default Home