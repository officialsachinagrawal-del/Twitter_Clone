//! ye file batati h ki user login h yaa nahi 
//* agr login h to Home page pe jump krde 
//? agr nahi h to login page pe bhej de 

// Link: Creates navigation links that update the URL
// Routes: A container for all your route definitions
// Route: Defines a mapping between a URL path and a component

import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({children, authentication =true}) {

  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  //!puchna padega ki authstatus se ki app login ho yaa nahi 
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() =>{
    
    let authValue = authStatus === true? true: false
    //*true && !false => true;
    if(authentication && !authValue){
      navigate('/login');

    }
    //* !false && true = true;
    else if(!authentication && authValue){
      navigate('/');
    }
    setLoader(false);

    },[authentication,authStatus,navigate]);

  return loader ? <h1>...loading</h1> : <>{children}</>

}

