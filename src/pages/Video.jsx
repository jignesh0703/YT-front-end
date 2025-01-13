import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { StoreContext } from "../context/Context";
import { formatDistanceToNow } from "date-fns";
import { FaShareAlt, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';  // Save icon from 
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Oval } from 'react-loader-spinner';  // Named import for the component
import Options from '../Components/Options'
import Message from '../Components/Message';
import PlayList from '../Components/PlayList';

const Video = () => {

  const { URL, isLoggedin } = useContext(StoreContext);
  const [Video, setVideo] = useState(null)
  const { id } = useParams();
  const [isExpanded, setisExpanded] = useState(false)
  const [CheckUser, setCheckUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const Nevigate = useNavigate()
  const addViewRef = useRef(false)

  useEffect(() => {
    const FetchVideo = async () => {
      try {
        const response = await axios.get(`${URL}/api/video/getvideo/${id}`, {
          withCredentials: false
        })
        if (!addViewRef.current) {
          await axios.patch(`${URL}/api/user/addview/${id}`);
          addViewRef.current = true;
        }
        setVideo(response.data.Getvideo)
        if (isLoggedin) {
          await axios.post(`${URL}/api/user/addtowatchHistory/${id}`, {}, {
            withCredentials: true
          })
            .then(() => {
              // Optionally, re-fetch the watch history or update the UI here
            })
            .catch((error) => {
              console.error('Error updating watch history:', error.response ? error.response.data : error);
            });
        }
      } catch (error) {
        toast.error('Somthing went wrong , Check your internet connection!')
      }
    }
    FetchVideo()
  }, [URL, id, isLoggedin])

  const timeAgo = Video ? formatDistanceToNow(new Date(Video.createdAt), { addSuffix: true })?.replace(/^about/, '') : '';

  const toggleDescription = () => {
    setisExpanded(!isExpanded);
  };

  const descriptionToShow = Video ? isExpanded ? Video.desciption : `${Video.desciption?.slice(0, 150)}` : '';

  //share the URL
  const ShareHandler = () => {
    if (navigator.share) {
      navigator.share({
        title: Video.title,
        url: window.location.href,
      })
        .then(() => {
        })
        .catch((error) => {
          toast.error('Failed to share the video.');
        });
    } else {
      //for browser that not support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
      })
        .catch((error) => {
          toast.error('Failed to share the video.');
        });
    }
  };

  useEffect(() => {
    if (isLoggedin) {
      const CheckUser = async () => {
        try {
          const responce = await axios.get(`${URL}/api/video/checkuser/${id}`, {
            withCredentials: true
          })
          if (responce.data?.isOwner) {
            setCheckUser(true)
          }
        } catch (error) {
        }
      }
      CheckUser()
    }
  }, [URL, id, isLoggedin])

  const dropdownRef = useRef(null);
  const [sawoption, setsawoption] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setsawoption(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const DeleteVideo = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`${URL}/api/video/delete/${id}`, {
        withCredentials: true
      })
      toast.success(response.data.message)
      Nevigate('/')
    } catch (error) {
      setIsLoading(false)
      toast.error("Somthing wrong try again!")
    }
    setIsLoading(false)
  }

  const [likecount, setlikecount] = useState(null)
  const [LikeColorHandle, setLikeColorHandle] = useState(null)
  const [refreshLikes, setrefreshLikes] = useState(false)

  useEffect(() => {
    if (isLoggedin) {
      const CkeckUserLiked = async () => {
        try {
          const responce = await axios.get(`${URL}/api/like/checkuserliked/${id}`, {
            withCredentials: true
          })
          if (responce.data.IsLiked === true) {
            setLikeColorHandle(true)
          } else {
            setLikeColorHandle(false)
          }
        } catch (error) {
        }
      }
      CkeckUserLiked()
    }
  }, [id, URL, refreshLikes, isLoggedin])

  useEffect(() => {
    const GetLikeCount = async () => {
      try {
        const responce = await axios.get(`${URL}/api/like/getvideolikecount/${id}`, {
          withCredentials: false
        })
        setlikecount(responce.data.LikeCount)
      } catch (error) {
        toast.error("Somthing wrong try again!")
      }
    }
    GetLikeCount()
  }, [id, URL, refreshLikes])

  const ToggleLike = async () => {
    try {
      await axios.post(`${URL}/api/like/addliketovideo/${id}`, {}, {
        withCredentials: true
      })
      setrefreshLikes(!refreshLikes);
    } catch (error) {
      console.log(error)
      toast.error(error.responce.data)
    }
  }

  const [DisLikeColorHandle, setDisLikeColorHandle] = useState(false)

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
          <Oval type="Oval" color="#00BFFF" height={50} width={50} />
        </div>
      )}
      <Navbar />
      <div className='w-full h-max flex'>
        <div>
          <Options />
        </div>
        {Video ? (
          <>
            <div className='ml-[10%]'>
              {
                Video.videolink && (
                  <video width="100%" controls className='w-[55rem] h-[30rem]'>
                    <source src={Video.videolink} type="video/mp4" />
                    <source src={Video.videolink} type="video/webm" />
                    <source src={Video.videolink} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                )}
              <h1 className='font-bold mt-2 text-[1.2rem] w-[55rem]'>{Video.title}</h1>
              <div className={`flex ${CheckUser ? 'gap-[15rem]' : ' gap-[17rem]'}`}>
                <div className='flex w-max gap-2 items-center py-1'>
                  <Link to={`/channel/${Video.owner._id}`}>
                    <div className='w-max flex'>
                      <img src={Video.owner.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] rounded-full object-cover' />
                    </div>
                  </Link>
                  <div className='flex flex-col'>
                    <Link to={`/channel/${Video.owner._id}`}>
                      <h1 className='text-[0.9rem] font-bold'>{Video.owner.channel_name}</h1>
                    </Link>
                    <h1 className='text-[0.8rem] font-medium -mt-1'>1k subscribers</h1>
                  </div>
                  <div className='ml-6'>
                    <button className='bg-black text-white py-2 px-6 text-[0.8rem] rounded-[20px] font-bold'>Subscribe</button>
                  </div>
                </div>
                <div className='flex items-center justify-center text-center gap-3'>
                  <div className='bg-gray-300 flex items-center rounded-full overflow-hidden'>
                    <div className='flex items-center gap-1 hover:bg-gray-400 py-2 px-4 cursor-pointer duration-300 transition' onClick={ToggleLike}>
                      <FaThumbsUp className={`${LikeColorHandle ? 'text-black' : 'text-zinc-500 '}`} />
                      <h1>{likecount}</h1>
                    </div>
                    <hr className='w-[1px] h-[25px] bg-gray-800 rounded-full' />
                    <div className='hover:bg-gray-400 py-3 px-4 cursor-pointer duration-300 transition' onClick={() => setDisLikeColorHandle(!DisLikeColorHandle)}>
                      <FaThumbsDown className={`${DisLikeColorHandle ? 'text-black' : 'text-zinc-500 '}`} />
                    </div>
                  </div>
                  <div className='bg-gray-300 flex items-center rounded-full overflow-hidden px-4 py-2 hover:bg-gray-400 duration-300 transition gap-1 cursor-pointer'>
                    <FaBookmark className='text-zinc-500' />
                    <h1>Save</h1>
                  </div>
                  <div className='bg-gray-300 flex items-center rounded-full overflow-hidden px-4 py-2 hover:bg-gray-400 duration-300 transition gap-1 cursor-pointer' onClick={ShareHandler}>
                    <FaShareAlt className='text-zinc-500' />
                    <h1>Share</h1>
                  </div>
                  {
                    CheckUser
                      ? <div className='bg-gray-300 flex items-center rounded-full overflow-hidden px-2 py-2 hover:bg-gray-400 duration-300 transition gap-1 cursor-pointer' onClick={() => setsawoption(true)}>
                        <HiOutlineDotsVertical className='text-[1.2rem] text-zinc-500' />
                      </div>
                      : <></>
                  }
                  {
                    sawoption
                      ? <div ref={dropdownRef} className='absolute bg-white ml-[14rem] mt-[5rem] shadow-lg'>
                        <h1 className='cursor-pointer p-1 hover:bg-gray-200 duration-300 font-semibold' onClick={DeleteVideo}>Delete Video</h1>
                        <hr className='w-[8rem] h-[2px] bg-black' />
                        <Link to={`/updatevideo/${id}`}>
                          <h1 className='cursor-pointer p-1 hover:bg-gray-200 duration-300 font-semibold'>Manage Video</h1>
                        </Link>
                      </div>
                      : <></>
                  }
                </div>
              </div>
              <div className='flex flex-col border border-[#F2F2F2] shadow-md rounded-[5px] p-1 px-2 bg-[#F2F2F2] w-[55rem]'>
                <div className='flex font-semibold gap-2'>
                  <h1 className='flex text-[0.8rem]'>{Video.views} views</h1>
                  <h1 className='text-[0.8rem]'>{timeAgo}</h1>
                </div>
                <p className='max-w-[54rem] break-words whitespace-pre-line'>{descriptionToShow}</p>
                {!isExpanded && Video.desciption?.length > 100 && (
                  <span className='cursor-pointer font-semibold' onClick={toggleDescription}>...more</span>
                )}
                {isExpanded && Video.desciption?.length > 100 && (
                  <span className='cursor-pointer font-semibold' onClick={toggleDescription}>Show less</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className='w-full h-full justify-center flex items-center text-[2rem] font-bold mt-[4rem]'>Loading...</p>
        )}
      </div>
      <Message />
      <PlayList />
    </>
  );

}

export default Video