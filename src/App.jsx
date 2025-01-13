import React from 'react'
import Signup_Login from './pages/Signup_Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
import Updata_Profile from './pages/Updata_Profile';
import Update_Password from './pages/Update_Password';
import Upload_Video from './pages/Upload_Video';
import Video from './pages/Video';
import Channel_Profile from './pages/Channel_Profile';
import History from './pages/History';
import YourVideo from './pages/YourVideo';
import Playlist from './pages/Playlist';
import Update_Video from './pages/Update_Video'
import Playlist_Page from './pages/Playlist_Page';

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login-signup' element={<Signup_Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/update' element={<Updata_Profile />} />
          <Route path='/updatepassword' element={<Update_Password />} />
          <Route path='/uploadvideo' element={<Upload_Video />} />
          <Route path='/video/:id' element={<Video />} />
          <Route path='/channel/:id' element={<Channel_Profile />} />
          <Route path='/history' element={<History />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/yourvideo' element={<YourVideo />} />
          <Route path='/updatevideo/:id' element={<Update_Video />} />
          <Route path='/playlist/:playlistid' element={<Playlist_Page />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App