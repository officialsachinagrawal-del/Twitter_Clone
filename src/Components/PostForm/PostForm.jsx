//! it perform both editing and posting post 

//!getting profile image through redux 

//! flow -> ⚡ How it flows
//*           Header.jsx → Tweet button dispatches openDialog().

//*          uiSlice → sets isDialogOpen = true.

//*           PostForm.jsx → sees isDialogOpen change, calls dialogRef.current?.showModal().

//*          Close button → dispatches closeDialog(), sets isDialogOpen = false, and closes the dialog.

import React, { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import userProfileServices from '../../Services/appwrite/user.js';
import { useDispatch } from 'react-redux';
import { setProfileImage, setTweetImage, setTweetContent } from '../../features/authSlice.js';
import { FaImages } from "react-icons/fa";

import { closeDialog } from '../../features/uiSlice.js';
import tweetServices from '../../Services/appwrite/tweet.js';
import coverImage from '../../images/cover.png'
import { useNavigate } from 'react-router-dom';

function PostForm() {

  const dialogRef = useRef(null);
  const ProfileRef = useRef(null);
  const TweetImageRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState("Enter Something");
  const [profile, setprofile] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [UsertweetImageId, setUserTweetImageId] = useState(null);
  const [tweetImageUrl, setTweetImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false)


  const isDialogBoxOpen = useSelector((state) => state.ui.isDialogOpen);
  console.log("state changed", isDialogBoxOpen);

  useEffect(() => {
    if (isDialogBoxOpen) {
      dialogRef.current?.showModal();

    }
    else {
      dialogRef.current?.close();
    }
  }, [isDialogBoxOpen]);

  //!taaki 
  const handleTweetImage = async (e) => {

    const file = e.target.files[0];
    console.log(file)
    if (file) {
      //! jese image => myimage.png isse ye -> image url nikal raha h 
      setTweetImageUrl(URL.createObjectURL(file));
      console.log("upload has been started")
      setUploading(true);

      const uploadFile = await tweetServices.uploadUserTweetImage({
        file,
        userId: profile.userId
      });
      console.log("upload has been completed", uploadFile)
      //? real image filed id mil gyi 
      setUserTweetImageId(uploadFile?.$id);
      setUploading(false)


      // const tweetUrl = await tweetServices.getUserTweetImagePreview(uploadFile.$id);

      // dispatch(setTweetImage(tweetUrl));


    }
  }

  const handleSubmitTweetForm = async (e) => {
    console.log("FUNCTION STARTED");

    console.log("profile =", profile);
    console.log("UsertweetImageId =", UsertweetImageId);
    e.preventDefault();

    try {
      console.log("function inside the try ");
      const tweetData = await tweetServices.createUserTweet({
        userId: profile.userId,
        content: content,
        tweetImageId: UsertweetImageId,
      });

      console.log("tweet User Data ", tweetData);

      const updatetweet = await tweetServices.updateUserTweet(
        tweetData.$id,
        {
          content: tweetData.content,
          tweetImageId: UsertweetImageId,
          likeCount: tweetData.likeCount,
          commentCount: tweetData.commentCount,

        })
      console.log("my updated Tweet", updatetweet)

      const tweetUrl = updatetweet?.tweetImageId
        ? await tweetServices.getUserTweetImagePreview(updatetweet.tweetImageId)
        : null;
      console.log("my tweet url ", tweetUrl)

      // dispatch(setTweetContent(updatetweet?.content));
      // dispatch(setTweetImage(tweetUrl));
      dispatch(closeDialog());
      window.location.reload(); // The feed is not refreshed after submission 


      navigate('/tweetCard')
      //   if(post){
      //     console.log(post);
      //     const file = e.target.files[0];
      //     //? phle file ko upload krenge
      //     if(file){
      //     const file =await tweetServices.uploadUserTweetImage({file, userId:profile.userId })
      //     //?ab delete kr do turant
      //                 await tweetServices.deleteUserTweet({tweetImageUrl });

      //     //? ab update krenge
      //     const dbpost = await tweetServices.updateUserTweet(post.$id)
      //   }

      // }

    } catch (error) {
      console.log("my errror in sumbmiting tweetForm", error);
      throw error;

    }
  }

  const ProfileImage = useSelector(
    (state) => state.auth.profileImage
  );

  useEffect(() => {

    const handleProfileImage = async () => {
      const result = await userProfileServices.getUserProfile();
      const profileData = result?.documents?.[0];
      if (profileData) {
        setprofile(profileData);
        console.log("PostForm profile data:", profileData);

        if (!ProfileImage && profileData.profileImageId) {
          const imageUrl = await userProfileServices.getProfileImagePreview(
            profileData.profileImageId
          );
          console.log("PostForm profile image url:", imageUrl);
          dispatch(setProfileImage(imageUrl));
        }
      }
    };
    handleProfileImage();

  }, [ProfileImage, dispatch]);




  //[ProfileImage, dispatch]



  return (
    <div className='flex justify-center p-x mt-25'>
      {/* <button  className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 right-fixed" onClick={dispatch(openDialog)}> Add Tweet</button> */}

      <dialog ref={dialogRef} id="edit_profile_modal" className='backdrop:bg-black/50 border border-gray-300 rounded-lg p-6 bg-white shadow-xl max-w-sm w-full outline-none'>
        <div className='flex flex-col gap-4'>
          {/*//! this is for profile logo*/}

          <div className="avatar rounded-full">
            <img src={ProfileImage} alt="profile image" className="rounded-full h-20 w-20 object-cover" />
            {/* <input type = "file" ref={ProfileRef} onChange={handleProfileImage} hidden /> */}

          </div>

          {/*//! form khul jaae jiske andr twwet likhunga */}

          <form className='flex flex-col gap-3 ' onSubmit={handleSubmitTweetForm} >

            <div>
              <textarea type="text" placeholder='Enter Something' value={content} onChange={(e) => setContent(e.target.value)} className='min-w-sm outline-none' />
              {/* <input type = "file" placeholder='enter your message' name='tweet' className='border border-gray-300 rounded p-2 outline-none  focus:outline-none focus:ring-1 focus:ring-blue-500' /> */}
              {tweetImageUrl && (
                <img
                  src={tweetImageUrl}
                  alt="preview"
                  style={{ width: "3500px", height: "275px" }}
                />
              )}

              <input type="file" accept='image/*,video/*,audio/*' className="border border-gray-700 rounded-2xl" ref={TweetImageRef} onChange={handleTweetImage} hidden />

            </div>

            {/*//! add attachment in form */}
            <div className='flex justify-between items-center mt-2'>
              {/*//! tweet image ko pass krne ke lie dialog box me */}
              {/* <input type = "file" ref={TweetImageRef}  hidden/> */}
              <button type="button" onClick={() => TweetImageRef.current.click()} className='text-blue-500 hover:text-blue-600 text-xl cursor-pointer'> <FaImages /></button>

              <div className='flex justify-between'>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white px-4 py-2 rounded-full right-fixed`}
                  onClick={() => console.log("button clicked")}
                >
                  {uploading ? "Uploading..." : "Tweet"}
                </button>

                {/* <button type = "submit" className='bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 right-fixed' onClick={() => console.log("BUTTON CLICKED")} >Tweet</button> */}
                <button type="button" onClick={() => dispatch(closeDialog())} className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer'>Close</button>
              </div>

            </div>
          </form>
        </div>
      </dialog>

    </div>

  )
}

export default PostForm