import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { StoreContext } from "../context/Context";
import Video from './Video';

const User_Video = () => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [Vidoes, setVidoes] = useState([])
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        if (isLoggedin) {
            const FetchVideos = async () => {
                try {
                    const responce = await axios.get(`${URL}/api/video/getuservideo`, {
                        withCredentials: true
                    })
                    setVidoes(responce.data.Videos)
                } catch (error) {
                } finally {
                    setLoading(false)
                }
            }
            FetchVideos()
        }
    }, [URL, isLoggedin])

    if (!isLoggedin) return (
        <div className='flex justify-center w-full'>
            <h1 className='text-[2rem] font-bold mr-[11.5rem] mt-[3rem]'>Login is required</h1>
        </div>
    )


    return (
        <>
            <div className='w-full'>
                {
                    Vidoes?.length > 0 ? <div className='flex justify-center'>
                        <h1 className='text-[2rem] font-bold mr-[11.5rem]'>Your Videos</h1>
                    </div> : <></>
                }
                <div className='flex gap-[2rem] flex-wrap mt-[1rem] ml-[2rem]'>
                    {Loading ? (
                        <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem]'>Loading...</p>
                    ) : (
                        <div className="flex gap-[2rem] flex-wrap mt-[1rem] ml-[2rem]">
                            {Vidoes && Vidoes.length > 0 ? (
                                Vidoes.map((item, index) => (
                                    <Video
                                        key={index}
                                        thumbnail={item.thumbnail}
                                        title={item.title}
                                        views={item.views}
                                        id={item._id}
                                        avatar={item.owner.avatar}
                                        channel_name={item.owner.channel_name}
                                        createdAt={item.createdAt}
                                    />
                                ))
                            ) : (
                                <div className='flex justify-center'>
                                    <h1 className='text-[2rem] font-bold mr-[11.5rem]'>No videos uploaded</h1>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default User_Video