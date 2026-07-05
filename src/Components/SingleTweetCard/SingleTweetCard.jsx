import { FaRegCommentDots } from "react-icons/fa";
import { CiGlass, CiShare2 } from "react-icons/ci";
import { FaRetweet } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import React, { useState, useEffect } from 'react';
import {  useSelector } from "react-redux";
import userProfileServices from "../../Services/appwrite/user.js";
import tweetServices from "../../Services/appwrite/tweet.js";
import { Link, useNavigate } from "react-router";
import { BsBoxArrowLeft } from "react-icons/bs";
// import { setTweetImage, setTweetContent } from "../../features/authSlice";


function SingleTweetCard({ content,
  tweetImageId,
  userId,
//   likeCount,
//   commentCount,
  $createdAt, }) {
    



  const [profile, setprofile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tweetImage, setLocalTweetImage] = useState(null);
  
  const navigate = useNavigate();




  //! getting profile image
  const ProfileImage = useSelector(
    (state) => state.auth.profileImage
  );


  //!getting tweet Image through redux 
  // const TweetImage = useSelector(
  //   (state) => state.auth.tweetImage,
  // )
  // //console.log("my tweet image url:", TweetImage);

  // const TweetContent = useSelector(
  //   (state) => state.auth.tweetContent,
  // )
  // //console.log("my tweet content:", TweetContent);

  // const imageUrl = tweetImage;
  // //console.log("my tweet Image ur", imageUrl)
  // //console.log("my tweetImage id", tweetImageId);
  //! handling profile image and profile data


  //!handling tweetImage



  useEffect(() => {
    const fetchdata = async () => {
      try {



      if (!userId) {
        return;
      }

      const profileResult = await userProfileServices.getProfileByUserId(userId);
      const profileData = profileResult?.documents?.[0];
   

      if (profileData) {
        setprofile(profileData);

        if (profileData.profileImageId) {
          const url = await userProfileServices.getProfileImagePreview(
            profileData.profileImageId
          );

          setProfileImage(url);
        }
      }

      

      if (tweetImageId) {
        const url = await tweetServices.getUserTweetImagePreview(tweetImageId)
        setLocalTweetImage(url);
        //console.log("my tweet Url", url)
      }
      else {
        setLocalTweetImage(null);
      }

    }
    catch(error){
      console.log("Fetch Error", error);
    }
  }
    fetchdata();
  }, [userId, tweetImageId]);







  return (
    
    
    <div className="border-b border-gray-700 p-4 hover:bg-gray-50 transition w-2xl "   >
      {" "}
     

      <div className="flex gap-3">
        {" "}
        {/* Profile Image */}{" "}
        <button onClick={() => navigate('/') } className="top-0 cursor-pointer size-1.5 left-1.5"> <BsBoxArrowLeft /> </button> 
        <div>
            
          {" "}
          <Link to={'/profile'}>
          <img src={profileImage} className="rounded-full h-12 w-12 object-cover left-3.5"/>
          </Link>
          {" "}
        </div>{" "}
        {/* Tweet Content */}{" "}
        <div className="flex-1">
          {" "}
          {/* Header */}{" "}
          <div className="flex items-center gap-2">
            
            {" "}
            <h3 className="font-bold text-lg">{profile?.name}</h3>{" "}
            <span className="text-gray-500"> @{profile?.username} </span>{" "}
            <span className="text-gray-500">·</span>{" "}
            <span className="text-gray-500">{$createdAt?.split("T")[0]}</span>{" "}
            <button className="ml-auto">
              {" "}<RxHamburgerMenu />
              {/* <MoreHorizontal size={20} />{" "} */}
            </button>{" "}
          </div>{" "}
          {/* Tweet Text */}{" "}
          <p className="mt-2 text-gray-800">
            {" "}
            {content || "This is a sample tweet content."}{" "}
          </p>{" "}
          {/* Tweet Image */}{" "}
          <div className="mt-3">
            {" "}
            {tweetImage && (
              <img
                src={tweetImage}
                alt="tweet"
                className="rounded-2xl max-w-md object-cover border border-red-50 w-full h-60"
              />)}{" "}
          </div>{" "}
          {/* Actions */}{" "}
          <div className="flex justify-between mt-4 text-gray-500">
            {" "}
            <button className="hover:text-blue-500">
              {" "}<FaRegCommentDots />
              {/* <MessageCircle size={22} />{" "} */}
            </button>{" "}
            <button className="hover:text-green-500">
              {" "}<FaRetweet />
              {/* <Repeat2 size={22} />{" "} */}
            </button>{" "}
            <button className="hover:text-pink-500">
              {" "}<FaRegHeart />
              {/* <Heart size={22} />{" "} */}
            </button>{" "}
            <button className="hover:text-blue-500">
              {" "}<CiShare2 />
              {/* <Share size={22} />{" "} */}
            </button>{" "}
            <button className="hover:text-blue-500">
              {" "}<MdOutlineFileDownload />
              {/* <BarChart2 size={22} />{" "} */}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
     
    </div>
  );
}
export default SingleTweetCard;
