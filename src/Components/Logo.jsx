import React from 'react'
import { FaTwitter } from 'react-icons/fa'

function Logo() {
  return (
    <div className='brand-pill'>
        <div className='brand-mark'>
          <FaTwitter className="text-xl" />
        </div>
        <div className='leading-tight'>
          <p className='text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-500'>Social Layer</p>
          <p className='text-base font-semibold text-slate-900'>Twitter App</p>
        </div>
    </div>
  )
}

export default Logo