import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContext } from "../context/Context";
import Video from './Video';
import { useParams } from 'react-router-dom';

const Semi_Videos = () => {

    const { URL } = useContext(StoreContext);
    const [Videos, setVideos] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { id } = useParams()

    const FetchAllVideos = async () => {
        if (!hasMore || loading) return; // Stop if no more videos are available
        setLoading(true);
        try {
            const responce = await axios.get(`${URL}/api/video/getallvideo`, {
                params: { page, limit: 16 },
                withCredentials: false
            })
            const newVideos = responce.data.data
            const { totalPages } = responce.data.pagination;

            setVideos((prevVideos) => {
                const videoIds = new Set(prevVideos.map((v) => v._id));
                return [...prevVideos, ...newVideos.filter((v) => !videoIds.has(v._id))];
            });

            setHasMore(page < totalPages);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        FetchAllVideos()
    }, [page]);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 100 && !loading) {
            setPage((prevPage) => prevPage + 1); // Load the next page
        }
    }, [loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <>
            <div className='absolute flex justify-center items-center ml-[15rem] mt-[15rem]'>
                {loading && <p>Loading more videos...</p>}
            </div>
            <div className='justify-center md:ml-[3rem] lg:ml-[3rem] mt-8 sm:mt-8 md:mt-4 xl:ml-8 2xl:ml-[3rem] 3xl:ml-[8rem] flex-wrap gap-8 flex xl:flex-col xl:gap-4'>
                {
                    Videos.map((item) => {
                        return <Video
                            key={item._id}
                            thumbnail={item.thumbnail}
                            title={item.title}
                            views={item.views}
                            id={item._id}
                            avatar={item.owner.avatar}
                            channel_name={item.owner.channel_name}
                            createdAt={item.createdAt}
                        />
                    })
                }
            </div>
        </>
    )
}

export default Semi_Videos