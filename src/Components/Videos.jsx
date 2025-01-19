import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Video from './Video';
import { StoreContext } from "../context/Context";

const Videos = () => {
    const { URL } = useContext(StoreContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Track the current page
    const [hasMore, setHasMore] = useState(true); // Indicate if more videos are available

    const fetchVideos = useCallback(async () => {
        if (!hasMore) return; // Stop if no more videos are available

        setLoading(true);
        try {
            const response = await axios.get(`${URL}/api/video/getallvideo`, {
                params: { page, limit: 16 }, // Pass page and limit to the backend
                withCredentials: false,
            });

            const newVideos = response.data.data;
            const { totalPages } = response.data.pagination;

            // Append new videos while avoiding duplicates
            setVideos((prevVideos) => {
                const videoIds = new Set(prevVideos.map((v) => v._id));
                return [...prevVideos, ...newVideos.filter((v) => !videoIds.has(v._id))];
            });

            // Check if we have more pages to load
            setHasMore(page < totalPages);
        } catch (err) {
            setError('Error fetching videos');
        } finally {
            setLoading(false);
        }
    }, [URL, page, hasMore]);

    // Fetch videos when the component mounts or `page` changes
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    // Scroll handler to detect when the user is near the bottom
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 100 && !loading) {
            setPage((prevPage) => prevPage + 1); // Load the next page
        }
    }, [loading]);

    // Add and clean up the scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (error) {
        return (
            <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem] mr-[9rem]'>
                {error}
            </p>
        );
    }

    return (
        <>
            <div className='w-full h-max flex justify-center mt-4'>
                <div className='w-[90%]'>
                    <div className='flex gap-8 flex-wrap'>
                        {videos.map((item) => (
                            <Video
                                key={item._id}
                                thumbnail={item.thumbnail}
                                title={item.title}
                                views={item.views}
                                id={item._id}
                                avatar={item.owner.avatar}
                                channel_name={item.owner.channel_name}
                                createdAt={item.createdAt}
                            />
                        ))}
                    </div>
                    {loading && <p>Loading more videos...</p>}
                </div>
            </div>
        </>
    );
};

export default Videos;
