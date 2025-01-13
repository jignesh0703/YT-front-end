import React from 'react'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";

const Video = ({ thumbnail, title, views, id, avatar, channel_name, createdAt }) => {

    const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })?.replace(/^about/, '') : ''
    const sawtitle = title.length > 60 ? title.slice(0, 60) + '...' : title;

    return (
        <>
            <Link to={`/video/:${id}`}>
                <div className='w-[22rem]'>
                    <div className='flex'>
                        <img src={thumbnail} alt="thumbnail" className=' w-[22rem] h-[12rem] object-cover cursor-pointer rounded-[15px]' />
                    </div>
                    <div className='flex mt-2 items-start gap-2'>
                        <div className='w-[3rem]'>
                            <img src={avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] ml-2 rounded-full' />
                        </div>
                        <div className='flex flex-col ml-2 w-[20rem]'>
                            <div className='font-bold'>
                                {sawtitle}
                            </div>
                            <div className='text-[0.8rem]'>
                                <h1>{channel_name}</h1>
                            </div>
                            <div className='flex gap-2 text-[0.8rem]'>
                                <h1>{views} views</h1>
                                <hr className='w-[3px] h-[3px] bg-gray-800 rounded-full mt-[10px]' />
                                <h1>{timeAgo}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Video