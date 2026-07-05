//! information conditional rendering krenge 
///! if user  login h then show logout otherwise show login 
import React from 'react'
import { LogoutBtn } from '../Index.js'
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux' //! help to identify user login or not 
import { useNavigate } from 'react-router-dom'
import {Logo} from '../Index.js'

import Profile from '../../pages/Profile.jsx'//! tomporay liki h baad me hautunag 
import { openDialog } from '../../features/uiSlice.js'


function Header() {
  //!finding state that user is login or logout
  const authStatus = useSelector((state) =>
    state.auth.status);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //* when navigation bar is created then we make an array of object which we apply looop on array 

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,

    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus,   //! login ho to to sigup nahi dikhega
    },
    {
      name: "Profile",
      slug: '/profile',
      active: authStatus,
    },
    {
      name: "Tweet",
      slug: '/tweet',
      active : authStatus
    },
    {
      name: "LogoutBtn",
      slug: '/LogoutBtn',
      active: !authStatus
    },
    // {
    //   name: "TweetCard",
    //   slug: '/tweetCard',
    //   active: authStatus,
    // }

    // {
    //   name: 'All Posts',
    //   slug: '/all-posts',
    //   active: authStatus,  //! login ho to post diekhegin
    // },
    // {
    //   name: 'Add Post',
    //   slug: '/add-post',
    //   active: authStatus,
    // }

    

  ];


  return (
   
    <header className='relative w-full border-b border-white/60 bg-white/78 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:fixed lg:left-0 lg:top-0 lg:z-20 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:p-5'>
      {/* <Container> */}
        <nav className='flex h-full flex-col gap-6'>
          {/* Logo section*/}
          <div>
             <Link to ='/'>
                <Logo   />    
             </Link>
          </div>
         {/* next header elements*/}
          <div className='rounded-3xl border border-slate-200 bg-slate-50/70 p-3'>
            <p className='px-2 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Menu</p>
            <ul className='flex flex-col gap-2'>
              {navItems.map((item) =>(
            
                item.active ? (
                  <li key = {item.name}>
                     
                     {/*all navigation logic button me hoga */}
                     <button
                        onClick={() =>{ console.log("button clicked")
                           item.name == "Tweet" ? dispatch(openDialog())  : navigate(item.slug)}}
                           className='flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-white hover:text-sky-700 cursor-pointer'
                    >
                        <span>{item.name}</span>
                        <span className='text-xs text-slate-400'>→</span>

                     </button>
                     

                  </li>
                ) :  null
                ))}
                
                {/*for checking agr login h to logout btn dikhae*/}
                {authStatus && (
                  <li>
                    <LogoutBtn/>

                  </li>
                )}
            </ul>
          </div>

          <div className='mt-auto rounded-3xl bg-slate-900 px-4 py-4 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]'>
            <p className='text-xs uppercase tracking-[0.22em] text-sky-200'>Tip</p>
            <p className='mt-2 text-sm leading-6 text-slate-200'>Post with images, open a tweet, and keep the feed clean with the floating composer.</p>
          </div>


        </nav>
        
      {/* </Container> */}
    </header>
    
  )
}

export default Header