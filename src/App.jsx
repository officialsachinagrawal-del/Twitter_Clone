import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import authService from "./Services/appwrite/auth.js"
import {login , logout} from './features/authSlice.js'
import { Outlet } from "react-router-dom"
import Header from "./Components/Header/Header.jsx"
import PostForm from "./Components/PostForm/PostForm.jsx"
// import RightPart from "./Components/RightPart/RightPart.jsx"


function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() =>{
    authService.getCurrentUser()
      .then((userData) =>{
        if(userData){
            dispatch(
              login({
                userData: {
                  name: userData.name,
                  email: userData.email,
                }
              })
            );
        }
        else{
          dispatch(logout());
        }

      })
      .catch((error) =>{
        if (error?.code && error.code === 401) {
          // Not logged in — expected on first load. Ignore silently.
        } else {
          console.error("error", error);
        }
      })
      .finally(() => setLoading(false));
  },[dispatch])
 

  return !loading?
  <div className="flex min-h-screen">
    <div className="w-64">
      <Header/>  {/* //! left side bar */}
      <PostForm/>
     </div>
      <main className="flex-1">
        {/* <div className=""> */}

          <Outlet/> {/* //! home Feed*/}
        {/* </div>*/}
      </main> 
      {/*<div>
      //! Right sidebar}
       <RightPart className="w-800 border-l border-gray-300"/>
    </div>*/}
  </div>
  : null;

  
}

export default App
