import axios from "axios";
import { StoreContext } from "../context/Context";
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Video from "./Video";

const User_Vidoes = () => {

    const { id } = useParams()
    const { URL } = useContext(StoreContext);
    const [Videos, setVideos] = useState([])

    useEffect(() => {
        const GetUserVidoes = async () => {
            try {
                const responce = await axios.get(`${URL}/api/video/getchannelvideos/${id}`, {
                    withCredentials: false
                })
                const sortedVideos = responce.data.Videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setVideos(sortedVideos)
            } catch (error) {
            }
        }
        GetUserVidoes()
    }, [URL, id])

    if (!Videos || Videos.length === 0) {
        return <>
            <div className="flex flex-col">
                <div className='flex justify-start w-screen border-b-[1px] border-slate-400 pb-2'>
                    <div className='font-bold text-[1.2rem] ml-[2rem]'>
                        Videos
                    </div>
                </div>
                <div className='flex mt-3 justify-center items-center'>
                    <h1 className="text-[2rem] font-bold">No Videos</h1>
                </div>
            </div>
        </>
    }

    return (
        <>
            <div className="flex flex-col 2xl:ml-14">
                <div className='flex w-[90%] sm:justify-start sm:w-[25rem] ml-[1rem] sm:ml-[6rem] md:ml-[2rem] md:w-[45rem] xl:w-[65rem] 3xl:w-[86rem] 4xl:w-[94.5rem] border-b-[1px] border-slate-400 pb-2'>
                    <div className='font-bold text-[1.2rem] xl:ml-[2rem] ml-[1rem] lg:ml-0'>
                        Videos
                    </div>
                </div>
                <div className='flex gap-8 flex-wrap mt-3 justify-center lg:justify-start'>
                    {
                        Videos.map((item, index) => {
                            return <Video key={index} thumbnail={item.thumbnail} title={item.title} views={item.views} id={item._id} avatar={item.owner.avatar} channel_name={item.owner.channel_name} createdAt={item.createdAt} />
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default User_Vidoes