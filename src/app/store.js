import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import uiReducer from '../features/uiSlice.js'
const store = configureStore({
    reducer : {
        auth: authReducer,
        ui:   uiReducer,
    },
});

store.subscribe(() =>{

    const { loading: _loading } = store.getState();
});

export default store;



    // useEffect(() => async() =>{ 

    //      setProfileImage(ProfileImage)

    //       const result = await userProfileServices.getUserProfile();
    //       const profileData = result?.documents?.[0];
    //       setprofile(profileData);

    //       console.log(ProfileImage)
          

    // },[ProfileImage,TweetImage]);