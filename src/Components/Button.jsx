import React from 'react'

 function Button({
    children,
    BtnText,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
  return (
    <button type = {type} className= {`px-4 py-2 rounded-lg h-10.5 mt-7.5 ${bgColor} ${textColor} ${className}`} {...props} >
        {children || BtnText}
    </button>
  )
}

export default Button;