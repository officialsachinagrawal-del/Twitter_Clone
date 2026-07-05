import React, { useRef } from 'react'

function Comment() {

    const dialoRef = useRef();






  return (
    
      <dialog ref={dialoRef} id="edit_profile_modal" className='backdrop:bg-black/50 border border-gray-300 rounded-lg p-6 bg-white shadow-xl max-w-sm w-full outline-none'>
        <div className='flex flex-col gap-4'>
          {/*//! this is for profile logo*/}

          <div className="avatar rounded-full">
            <img src={ProfileImage} alt="profile image" className="rounded-full h-20 w-20 object-cover" />
            {/* <input type = "file" ref={ProfileRef} onChange={handleProfileImage} hidden /> */}

          </div>
          </div>
        </dialog>
  )
}

export default Comment