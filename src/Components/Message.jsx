import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from "../context/Context";
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";

const Message = () => {

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
    }, [tarckcomment])

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

    return (
        <>
            <div className='w-[55rem] ml-[22.5rem] rounded-[5px] mt-4'>
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
                                <div className='flex flex-col w-[50rem]'>
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