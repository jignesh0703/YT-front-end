import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";
import { IoCloseOutline } from 'react-icons/io5';

const Message = ({ setHideSemi_Videos }) => {

    const { id } = useParams()
    const { isLoggedin, data, URL } = useContext(StoreContext);
    const [sawbuttons, setsawbuttons] = useState(false)
    const [CommentText, setCommentText] = useState('')
    const [CommentsData, setCommentsData] = useState([])
    const [tarckcomment, settarckcomment] = useState(false)
    const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);
    const dropdownRef = useRef(null);
    const [DisLikeHandle, setDisLikeHandle] = useState({})
    const [CommentCount, setCommentCount] = useState(null)

    useEffect(() => {
        const FetchAllComments = async () => {
            try {
                const responce = await axios.get(`${URL}/api/comment/getcomment/${id}`, {
                    withCredentials: false
                })
                if (responce.status === 204) {
                    setCommentsData([])
                } else {
                    setCommentsData(responce.data.fetchComments)
                    responce.data.fetchComments.forEach((comment) => {
                        GetCommentLikeCount(comment._id)
                    });
                }
            } catch (error) {
            }
        }
        FetchAllComments()
    }, [id, URL, tarckcomment])

    const SubmitComment = async () => {
        if (!CommentText.trim()) {
            toast.error("Comment cannot be empty!");
            return;
        }
        try {
            const responce = await axios.post(`${URL}/api/comment/addcomment/${id}`, { comment: CommentText }, {
                withCredentials: true,
            })
            toast.success(responce.data.message)
            settarckcomment(!tarckcomment)
            setsawbuttons(false)
            setCommentText('')
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    const handleDeleteClick = (index) => {
        if (activeDeleteIndex === index) {
            setActiveDeleteIndex(null);
        } else {
            setActiveDeleteIndex(index);
        }
    };

    const DeleteComment = async (commentid) => {
        try {
            const responce = await axios.delete(`${URL}/api/comment/delatecomment/${commentid}`, {
                withCredentials: true
            })
            setActiveDeleteIndex(null)
            settarckcomment(!tarckcomment)
            toast.success(responce.data.message)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveDeleteIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const HandleDisLike = async (commentid) => {
        if (!isLoggedin) {
            toast.error('Login is required')
        } else {
            if (commentid) {
                setDisLikeHandle((prevstate) => ({
                    ...DisLikeHandle,
                    [commentid]: !prevstate[commentid]
                }));
            }
        }
    }

    useEffect(() => {
        const FetchCommentCount = async () => {
            try {
                const responce = await axios.get(`${URL}/api/comment/countcomment/${id}`, {
                    withCredentials: false
                })
                setCommentCount(responce.data.CommentCount)
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        }
        FetchCommentCount()
    }, [tarckcomment,id])

    const [FaThumbsUpLike, setFaThumbsUpLike] = useState({})

    const ToggleCommentLike = async (commentid) => {
        if (isLoggedin) {
            try {
                await axios.post(`${URL}/api/like/addliketocomment/${commentid}`, {}, {
                    withCredentials: true
                })
                setFaThumbsUpLike((prevstate) => ({
                    ...FaThumbsUpLike,
                    [commentid]: !prevstate[commentid]
                }))
                console.log(FaThumbsUpLike)
                GetCommentLikeCount(commentid)
            } catch (error) {
            }
        } else {
            toast.error('Login is required')
        }
    }

    const [commentscounts, setcommentscounts] = useState({})

    const GetCommentLikeCount = async (commentid) => {
        try {
            const responce = await axios.get(`${URL}/api/like/getcommentlikecount/${commentid}`, {
                withCredentials: false
            })
            setcommentscounts((prevstate) => ({
                ...prevstate,
                [commentid]: responce.data.CommentLikeCount
            }))
        } catch (error) {
        }
    }

    useEffect(() => {
        if (isLoggedin) {
            const CheckUserCommentLiked = async (commentid) => {
                try {
                    const response = await axios.get(`${URL}/api/like/checkuserlikedcomments/${commentid}`, {
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        setFaThumbsUpLike((prevState) => ({
                            ...prevState,
                            [commentid]: response.data.IsLiked,
                        }));
                    }
                } catch (error) {
                }
            };
            // Loop through all comments to check the like status
            CommentsData.forEach((comment) => {
                CheckUserCommentLiked(comment._id);
            });
        }
    }, [isLoggedin, CommentsData, URL]);

    const [sawmessageinside, setsawmessageinside] = useState(true)

    return (
        <>
            {
                sawmessageinside
                    ? <div className='w-[20rem] sm:w-[35rem] md:w-[40rem] lg:w-[45rem] h-[4rem] ml-8 sm:ml-10 md:ml-14 lg:ml-[2rem] rounded-[5px] mt-4 shadow-xl xl:hidden' 
                    onClick={()=>{
                        setsawmessageinside(false)
                        setHideSemi_Videos(false)
                    }}
                    >
                        <h1 className='font-extrabold ml-4 mt-2'>{CommentCount} Comments</h1>
                        <h1 className='ml-4 '>Tap to see comments</h1>
                    </div>
                    : <div className='flex flex-col w-[20rem] sm:w-[35rem] md:w-[39rem] lg:w-[44rem] ml-8 sm:ml-12 md:ml-[4rem] lg:ml-[3rem] rounded-[5px] mt-4 xl:hidden p-2'>
                        <div className='flex justify-between items-center'>
                            <h1 className='font-extrabold'>{CommentCount} Comments</h1>
                            <div className='w-[2.5rem] h-[2.5rem] rounded-full flex justify-center items-center hover:bg-gray-400' 
                            onClick={()=>{
                                setsawmessageinside(true)
                                setHideSemi_Videos(true)
                            }}
                            >
                                <IoCloseOutline className='text-[2rem] rounded-full hover:bg-gray-400' />
                            </div>
                        </div>
                        {
                            isLoggedin && data
                                ? <div className='flex gap-4 items-start mt-2'>
                                    <img src={data.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] rounded-full' />
                                    <div className='w-full'>
                                        <input type="text" placeholder='Add a comment' className={`w-[100%] outline-none border-b ${sawbuttons ? 'border-black' : 'border-slate-400'}`} onClick={() => setsawbuttons(true)} value={CommentText} onChange={(e) => setCommentText(e.target.value)} />
                                        {
                                            sawbuttons
                                                ? <div className='w-full flex justify-end gap-2 mt-1'>
                                                    <button className='p-[.3rem] px-4 rounded-full font-semibold text-[.8rem] hover:bg-gray-300' onClick={() => {
                                                        setsawbuttons(false);
                                                        setCommentText('')
                                                    }}>Cancel</button>
                                                    <button className={`p-[.3rem] px-4 rounded-full font-semibold text-[.8rem] ${CommentText ? 'bg-[#3ea6ff] text-white' : 'bg-gray-300 text-gray-600'}`}
                                                        disabled={!CommentText.trim()} onClick={SubmitComment}>Comment</button>
                                                </div>
                                                : <></>
                                        }
                                    </div>
                                </div>
                                : <></>
                        }
                        {
                            Array.isArray(CommentsData) && CommentsData.length === 0 ? (
                                <div className="text-gray-500 mt-4 text-[1.5rem] ml-2">No comments yet.</div>
                            ) : (
                                CommentsData.map((item, index) => {
                                    const isUserComment = isLoggedin && item.UserID._id === data._id;
                                    return <div className='flex gap-4 mt-2' key={index}>
                                        <Link to={`/channel/${item.UserID._id}`}>
                                            <div>
                                                <img src={item.UserID.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] rounded-full' />
                                            </div>
                                        </Link>
                                        <div className='flex flex-col w-[13rem] sm:w-[26    rem] md:w-[31rem] lg:w-[36rem]'>
                                            <div className='flex gap-2 items-end'>
                                                <Link to={`/channel/${item.UserID._id}`}>
                                                    <h1 className='font-bold'>{item.UserID.username}</h1>
                                                </Link>
                                                <h1 className='text-zinc-500 text-[.8rem] mb-[3px]'>
                                                    {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
                                                </h1>
                                            </div>
                                            <h1>{item.comment}</h1>
                                            <div className='flex items-center gap-4 mt-1'>
                                                <div className='flex items-center gap-1'>
                                                    <FaThumbsUp className={`cursor-pointer ${FaThumbsUpLike[item._id] ? 'text-black' : 'text-zinc-400'} `} onClick={() => ToggleCommentLike(item._id)} />
                                                    <h1>{commentscounts[item._id] || 0}</h1>
                                                </div>
                                                <FaThumbsDown className={`mt-[4px] cursor-pointer ${DisLikeHandle[item._id] ? 'text-black' : 'text-zinc-400'}`} onClick={() => HandleDisLike(item._id)} />
                                            </div>
                                        </div>
                                        {
                                            isUserComment && (
                                                <div>
                                                    <div className='cursor-pointer hover:bg-slate-300 p-2 rounded-full duration-300' onClick={() => handleDeleteClick(index)}>
                                                        <BsThreeDotsVertical />
                                                    </div>
                                                    {activeDeleteIndex === index && (
                                                        <div className='bg-white absolute shadow-lg flex gap-2 items-center p-2 rounded-[10px] cursor-pointer -ml-[.5rem] -mt-2 hover:bg-gray-300 duration-300' onClick={() => DeleteComment(item._id)} ref={dropdownRef}>
                                                            <MdDelete className='text-[1.5rem]' />
                                                            Delete
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </div>
                                })
                            )
                        }
                    </div>
            }


            <div className='hidden xl:flex flex-col xl:w-[45rem] 2xl:w-[50rem] 3xl:w-[55rem] xl:ml-[1rem] 2xl:ml-[3rem] 3xl:ml-[6.5rem] rounded-[5px] mt-4'>
                <div>
                    <h1 className='font-extrabold'>{CommentCount} Comments</h1>
                </div>
                {
                    isLoggedin && data
                        ? <div className='flex gap-4 items-start mt-2'>
                            <img src={data.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] rounded-full' />
                            <div className='w-full'>
                                <input type="text" placeholder='Add a comment' className={`w-[100%] outline-none border-b ${sawbuttons ? 'border-black' : 'border-slate-400'}`} onClick={() => setsawbuttons(true)} value={CommentText} onChange={(e) => setCommentText(e.target.value)} />
                                {
                                    sawbuttons
                                        ? <div className='w-full flex justify-end gap-2 mt-1'>
                                            <button className='p-[.3rem] px-4 rounded-full font-semibold text-[.8rem] hover:bg-gray-300' onClick={() => {
                                                setsawbuttons(false);
                                                setCommentText('')
                                            }}>Cancel</button>
                                            <button className={`p-[.3rem] px-4 rounded-full font-semibold text-[.8rem] ${CommentText ? 'bg-[#3ea6ff] text-white' : 'bg-gray-300 text-gray-600'}`}
                                                disabled={!CommentText.trim()} onClick={SubmitComment}>Comment</button>
                                        </div>
                                        : <></>
                                }
                            </div>
                        </div>
                        : <></>
                }
                {
                    Array.isArray(CommentsData) && CommentsData.length === 0 ? (
                        <div className="text-gray-500 mt-4 text-[1.5rem] ml-2">No comments yet.</div>
                    ) : (
                        CommentsData.map((item, index) => {
                            const isUserComment = isLoggedin && item.UserID._id === data._id;
                            return <div className='flex gap-4 mt-2' key={index}>
                                <Link to={`/channel/${item.UserID._id}`}>
                                    <div>
                                        <img src={item.UserID.avatar} alt="avatar" className='w-[2.5rem] h-[2.5rem] rounded-full' />
                                    </div>
                                </Link>
                                <div className='flex flex-col xl:w-[40rem] 2xl:w-[45rem] 3xl:w-[50rem]'>
                                    <div className='flex gap-2 items-end'>
                                        <Link to={`/channel/${item.UserID._id}`}>
                                            <h1 className='font-bold'>{item.UserID.username}</h1>
                                        </Link>
                                        <h1 className='text-zinc-500 text-[.8rem] mb-[3px]'>
                                            {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
                                        </h1>
                                    </div>
                                    <h1>{item.comment}</h1>
                                    <div className='flex items-center gap-4 mt-1'>
                                        <div className='flex items-center gap-1'>
                                            <FaThumbsUp className={`cursor-pointer ${FaThumbsUpLike[item._id] ? 'text-black' : 'text-zinc-400'} `} onClick={() => ToggleCommentLike(item._id)} />
                                            <h1>{commentscounts[item._id] || 0}</h1>
                                        </div>
                                        <FaThumbsDown className={`mt-[4px] cursor-pointer ${DisLikeHandle[item._id] ? 'text-black' : 'text-zinc-400'}`} onClick={() => HandleDisLike(item._id)} />
                                    </div>
                                </div>
                                {
                                    isUserComment && (
                                        <div>
                                            <div className='cursor-pointer hover:bg-slate-300 p-2 rounded-full duration-300' onClick={() => handleDeleteClick(index)}>
                                                <BsThreeDotsVertical />
                                            </div>
                                            {activeDeleteIndex === index && (
                                                <div className='bg-white absolute shadow-lg flex gap-2 items-center p-2 rounded-[10px] cursor-pointer -ml-[.5rem] -mt-2 hover:bg-gray-300 duration-300' onClick={() => DeleteComment(item._id)} ref={dropdownRef}>
                                                    <MdDelete className='text-[1.5rem]' />
                                                    Delete
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                        })
                    )
                }
            </div>
        </>
    )
}

export default Message