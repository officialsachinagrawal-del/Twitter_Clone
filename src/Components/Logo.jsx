import React from 'react'
import { FaTwitter } from 'react-icons/fa'

function Logo() {
  return (
    <div className='flex items-center justify-center'>
        <FaTwitter className="text-sky-500 hover:text-sky-600 text-3xl transition-colors duration-200 cursor-pointer" />
    </div>
  )
}

export default Logo