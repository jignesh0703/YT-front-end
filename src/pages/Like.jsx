import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Options from '../Components/Options'
import { StoreContext } from "../context/Context";
import axios from 'axios';
import Video from '../Components/Video';
import Mobile_Option from '../Components/Mobile_Option';

const Like = () => {

    const { URL, isLoggedin } = useContext(StoreContext);
    const [GetLikedVideos, setGetLikedVideos] = useState([])
    const [sawOption, setsawOption] = useState(false)

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
            <Navbar setsawOption={setsawOption} sawOption={sawOption} />
            <div className='flex'>
                <Options />
                {
                    sawOption && <Mobile_Option setsawOption={setsawOption} />
                }
                <div className='flex w-full h-max flex-col'>
                    <div className='flex justify-center w-full text-[2rem] lg:-ml-[6rem] font-bold mt-2'>
                        Liked Videos
                    </div>
                    <div className='w-full mt-[2rem]'>
                        <div className='flex gap-8 flex-wrap lg:ml-[3rem] justify-center lg:justify-start 2xl:ml-[8rem] 3xl:ml-[5rem]'>
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