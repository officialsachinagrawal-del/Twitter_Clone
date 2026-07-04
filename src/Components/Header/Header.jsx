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
    {
      name: "TweetCard",
      slug: '/tweetCard',
      active: authStatus,
    }

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
   
    <header className='w-64 min-h-screen fixed left-0 top-0 border-r bg-white'>
      {/* <Container> */}
        <nav className='flex'>
          {/* Logo section*/}
          <div className='mr-4 '>
             <Link to ='/'>
                <Logo   />    
             </Link>
              
          </div>
         {/* next header elements*/}
          <ul className='flex flex-col gap-3 mt-8'>
            {navItems.map((item) =>(
          
              item.active ? (
                <li key = {item.name}>
                   
                   {/*all navigation logic button me hoga */}
                   <button
                      onClick={() =>{ console.log("button clicked")
                         item.name == "Tweet" ? dispatch(openDialog())  : navigate(item.slug)}}
                         className='w-full text-left px-4 py-3 rounded-full hover:bg-gray-100 cursor-pointer'
                  >
                      {item.name} 

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


        </nav>
        
      {/* </Container> */}
    </header>
    
  )
}

export default Header