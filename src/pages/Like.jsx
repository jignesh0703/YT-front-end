import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import { StoreContext } from "../context/Context";
import axios from 'axios';
import Video from '../Components/Video';

const Like = () => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [GetLikedVideos, setGetLikedVideos] = useState([])

    useEffect(() => {
        if (!isLoggedin) {
            return;
        }
        const GetLikedVideos = async () => {
            try {
                const responce = await axios.get(`${URL}/api/like/getlikedvideo`, {
                    withCredentials: true
                })
                setGetLikedVideos(responce.data.GetLiked)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        GetLikedVideos()
    }, [isLoggedin])

    return (
        <>
            <Navbar />
            <div className='flex'>
                <Options />
                <div className='flex w-full h-max flex-col'>
                    <div className='flex justify-center w-full text-[2rem] -ml-[6rem] font-bold mt-2'>
                        Liked Videos
                    </div>
                    <div className='w-full mt-[2rem]'>
                        <div className=' flex gap-8 flex-wrap ml-[5rem]'>
                            {
                                isLoggedin ?
                                    (
                                        GetLikedVideos && GetLikedVideos.length > 0
                                            ? (
                                                GetLikedVideos.map((item) => {
                                                    return <Video
                                                        key={item.Videos._id}
                                                        thumbnail={item.Videos.thumbnail}
                                                        title={item.Videos.title}
                                                        views={item.Videos.views}
                                                        id={item.Videos._id}
                                                        avatar={item.Videos.owner.avatar}
                                                        channel_name={item.Videos.owner.channel_name}
                                                        createdAt={item.Videos.createdAt}
                                                    />
                                                })
                                            )
                                            : (
                                                <p>Their is no Videos</p>
                                            )
                                    ) : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Like