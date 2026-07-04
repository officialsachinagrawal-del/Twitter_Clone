import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../Services/appwrite/auth.js'
import { logout } from '../../features/authSlice.js'
function LogoutBtn() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async() =>{
        try {
            await authService.logout();

            
        } catch (error) {
            console.log(error);
            
        }
        finally{
            dispatch(logout());
            navigate('/login');
        }
    }
  return (
    <button onClick={logoutHandler} cursor = "pointer">LogoutBtn</button>
  )
}

export default LogoutBtn
































// import React from 'react'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import authService from '../../Services/appwrite/auth'
// import {logout} from '../../features/authSlice'

// function LogoutBtn() {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const logoutHandler = async () => {
//         try {
//             await authService.logout();
//         } catch (error) {
//             console.error('Logout failed:', error);
//         } finally {
//             dispatch(logout());
//             navigate('/login');
//         }
//     }

//   return (
//     <button 
//           onClick={logoutHandler}
//           className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
//             Logout
//     </button>
//   )
// }

// export default LogoutBtn