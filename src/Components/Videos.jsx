import React, { useEffect, useState , useContext } from 'react';
import axios from 'axios';
import Video from './Video';
import { StoreContext } from "../context/Context";

const Videos = () => {

    const { URL } = useContext(StoreContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${URL}/api/video/getallvideo`, {
            withCredentials: false
        })
            .then(response => {
                setVideos(response.data.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching videos');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem] mr-[9rem]'>Loading...</p>;
    }

    if (error) {
        return <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem] mr-[9rem]'>{error}</p>;
    }

    return (
        <>
            <div className='w-full h-max flex justify-center'>
                <div className='w-[90%]'>
                    <div className='flex gap-8 flex-wrap'>
                        {
                            videos.map((item, index) => {
                                return <Video key={index} thumbnail={item.thumbnail} title={item.title} views={item.views} id={item._id} avatar={item.owner.avatar} channel_name={item.owner.channel_name} createdAt={item.createdAt}/>
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    );
};

export default Videos;