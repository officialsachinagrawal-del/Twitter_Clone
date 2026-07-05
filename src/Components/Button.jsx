import React from 'react'

 function Button({
    children,
    BtnText,
    type = "button",
    bgColor = "bg-sky-500",
    textColor = "text-white",
    className = "",
    ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(14,165,233,0.22)] ${bgColor} ${textColor} ${className}`}
      {...props}
    >
        {children || BtnText}
    </button>
  )
}

export default Button;