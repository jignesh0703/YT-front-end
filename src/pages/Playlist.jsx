import React from 'react'
import Options from '../Components/Options'
import Videos from '../Components/Videos'
import Navbar from '../Components/Navbar'

const Playlist = () => {
    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <div>
                    PlayList
                </div>
            </div>
        </>
    )
}

export default Playlist