//! Profile Page

//*Flow => Profile Open -> Fetch User Data -> Set State -> Render Images

//! Contains:

// ?Cover photo
// ?Profile photo
// ?Name
//? username
// ?Bio
// ?Followers
// ?Following
// ?User Tweets
//? edit profile btnd
import Header from "../Components/Header/Header.jsx";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import userProfileServices from "../Services/appwrite/user.js";
import { BsBoxArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import coverimage from '../images/cover.png';
import ProfileImage from '../images/Profile_avtar_image.png';
import { useDispatch } from "react-redux";
import { setProfileImage } from "../features/authSlice.js";
// import {isDialogOpen} from '../features/uiSlice'
function Profile(){
    console.log(userProfileServices);

    const [profile, setProfile] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(coverimage);
    const [profileImageUrl, setProfileImageUrl] = useState(ProfileImage);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    // const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
    //!edt form me data edit krne ke lie 
    const [editForm, setEditForm] = useState({
        name : "",
        username: "",
        bio: "",
        password: "",
    });

    const handleEditChange = ((e)=>{
        const {name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value}));

       
    })
    

    const CoverfileRef = useRef(null);
    const dialogRef = useRef(null);
    const navigate = useNavigate();
    const ProfileRef = useRef(null);
    const dispatch = useDispatch();



    useEffect(()=> {
        

        const fetchProfile = async () =>{
              const result = await userProfileServices.getUserProfile();
              const profileData = result?.documents?.[0];

              if(profileData){
               
                console.log(profileData);
                setProfile(profileData);
                setEditForm({
                    name: profileData.name ?? "",
                    username: profileData.username ?? "",
                    bio: profileData.bio ?? "",
                    password: "",
                });
                setCoverImageUrl(
                    profileData.coverImageId
                        ? await userProfileServices.getProfileImagePreview(profileData.coverImageId)
                        : coverimage
                );
                setProfileImageUrl(
                    profileData.profileImageId
                     ? await userProfileServices.getProfileImagePreview(profileData.profileImageId)
                     : ProfileImage
                );
           
              };

        }; 

        fetchProfile();

    },[]);

//     useEffect(() => {
//   if (isOpen) {
//     dialogRef.current?.showModal();
//   }
// }, [isOpen]);

   //! jb update btn pe click krun to full info update ho jae
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if(!profile) return;

        const updatedProfile = await userProfileServices.updateProfile(profile.$id, {
            name: editForm.name,
            username: editForm.username,
            bio: editForm.bio,
            profileImageId: profile.profileImageId,
            coverImageId: profile.coverImageId,
        });

        if(updatedProfile){
            setProfile(updatedProfile);
            setEditForm({
                name: updatedProfile.name ?? "",
                username: updatedProfile.username ?? "",
                bio: updatedProfile.bio ?? "",
                password: "",
            });

            dialogRef.current?.close(); //! update krne ke baad jese hi enter dabanuga jo form bnd ho jaaega 
        }
    };

    //  !btn pe click krne pr cover image upload ho 
    const  handleCoverImage = async (e) =>{
        console.log(e)
        const file = e.target.files[0];
        if(!file || !profile) return ;
        console.log(file);

        const uploadFile = await userProfileServices.uploadProfileImage({file, userId : profile.userId});
        console.log(uploadFile.$permissions);
        
        console.log(profile);
        if(!uploadFile) return ;

        const previewUrl = await userProfileServices.getProfileImagePreview(uploadFile.$id);
        console.log("preview url " ,previewUrl);

        setCoverImageUrl(previewUrl);
        setProfile((prev) =>({ ...prev, coverImageId: uploadFile.$id}));
       //!refresh krne pe image remove n ho 
        await userProfileServices.updateProfile(
            profile.$id,{
                name: profile.name,
                username : profile.username,
                bio: profile.bio,
                profileImageId: profile.profileImageId,
                coverImageId: uploadFile.$id, 


            }
        )


    }
    //! profile image ko handle krne k lie
    const handleProfileImage = async(e) =>{
        // console.log(e);
        const file = e.target.files[0];
        if(!file || !profile) return ;

        const uploadFile = await userProfileServices.uploadProfileImage({file, userId: profile.userId});
        console.log( "uplaod file", uploadFile);

        if(!uploadFile) return ;

        //! profile iamge ko preview dekhne ke lie 
        const ProfilePreviewUrl = await userProfileServices.getProfileImagePreview(uploadFile.$id);
        if(!ProfilePreviewUrl) return ;
        console.log("preview url" , ProfilePreviewUrl);

        setProfileImageUrl(ProfilePreviewUrl);

        //!setting profile image url to useState hook  and dispatch image 
        dispatch(setProfileImage(ProfilePreviewUrl));
        console.log("my Profile Url image",ProfilePreviewUrl);
        


        setProfile((prev) => ({...prev, profileImageId: uploadFile.$id} ));

        await userProfileServices.updateProfile(
        profile.$id,
    {
        name: profile.name,
        username: profile.username,
        bio: profile.bio,
        profileImageId: uploadFile.$id, // new image id
        coverImageId: profile.coverImageId,
    }
);

    }

    //! Following handle krne ke lie 
    const handleFollowing = async () =>{
        

        const FollowingCount = profile.followingCount

        setFollowingCount(FollowingCount);

    }

    //! Follower handle krne ke lie 
    const handleFollower = async () => {
        setFollowerCount(profile.followerCount);

    }


    // const [user , setUser] = useState(null);
    // const [loading, setLoading] = useState(null);
    // const [tweets, setTweets ] = useState(null);
    // const [ likeTweets, SetLikeTweets ] = useState(null);


    return (
        <div className="w-full border-r border-gray-700 min-h-screen">

            {/* <Header onTweetClick={() => setIsTweetModalOpen(true)} /> */}
             {/* <PostForm isOpen={isTweetModalOpen} onClose={() => setIsTweetModalOpen(false)}/> */}

            <div className="flex flex-col">
               

                <div className="flex gap-10 px-4 py-2 items-center">

                    {/*//! back btn pe click krte hi home page pe jump ho jaaega */}
                    <button onClick={() => navigate('/')}> <BsBoxArrowLeft /> </button> 

                    <div className="flex flex-col">
                        <p className="font-bold text-lg">{profile?.name}</p> {/*//!username dikhane ke lie */}

                        {/*//!kitni post h total yahan dikhegi*/}
                        <span className="text-sm text-slate-500">

                        </span>

                    </div>
                </div>
                {/*//! coverImg ko insert ke lie */}
                <div className="relative group/cover">
                                    <img src = {coverImageUrl} className="h-52 w-full object-cover" alt="cover-image"/>

                  <input type="file" ref={CoverfileRef} onChange={handleCoverImage} hidden /> {/*//! ye ek hidden file banayi h input image ki */}

                  <button className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200" onClick={() => CoverfileRef.current.click()} ><MdEdit /></button>

                  {/* //!profile image dikhane ke lie */}
                  <div className="avatar absolute -bottom-16 left-4 rounded-full">
                    <div className="w-32 rounded-full relative group/avatar">

                       <img src ={profileImageUrl} alt="profile image" className="rounded-full" />
                       <input type = "file" ref={ProfileRef} onChange={handleProfileImage} hidden />

                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer"><button className=" cursor-pointer" onClick={() => ProfileRef.current.click()}><MdEdit/></button></div>
                    </div>
                  </div>

                </div>
                {/*//! edit profile dialog buttn hndle */}
                <div className="flex-justify px-4 mt-25 ">
                    
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 right-fixed"
                        onClick={() => dialogRef.current?.showModal()}
                    >
                        Edit Profile
                    </button>
                    <dialog ref={dialogRef} id = "edit_profile_modal" className="modal">
                        <div className="modal-box border rounded-md border-gray-700 shadow-md scroll-auto">
                            <h3 className="font-bold text-lg my-3">Update Profile</h3>
                            <form className="flex flex-wrap gap-4" onSubmit={handleUpdateProfile}>
                                
                                <div className="flex flex-wrap gap-2">
                                    <input type = "text" placeholder="full Name" className="flex-1 input border border-gray-700 rounded p-2 input-md" name="name" value={editForm.name} onChange={handleEditChange}/>
                                    <input type = "text" placeholder="New userName" className ="flex-1 input border border-gray-700 rounded p-2 input-md" name="username" value={editForm.username} onChange={handleEditChange} />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <input type = "email" placeholder="Email" className="flex-1 input border border-gray-700 rounded p-2 input-md" name="Email"  readOnly/>
                                    <textarea placeholder="Bio" className="flex-1 input border border-gray-700 rounded p-2 input-md" name ="bio" value={editForm.bio} onChange={handleEditChange}/>                               
                                 </div>

                                 <div className="flex flex-wrap gap-2">
                                    <input type ="password" placeholder="Current Password" className="flex-1 input border border-gray-700 rounded p-2 input-md" name="currentPassword" value={editForm.password} onChange={handleEditChange} />
                                    <input type = "password" placeholder="New Password" className="flex-1 input border border-gray-700 rounded p-2 input-md" name="newPassword" value={editForm.password} onChange={handleEditChange} />
                                 </div>
                                 
                                 <button className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700" type="submit" onSubmit={handleUpdateProfile}>Update</button>



                            </form>
                        </div>

                        <form method= "dialog" className="modal-backdrop">
                            <button className="outline-none">close</button>
                        </form>
                    </dialog>
                </div>

                <div className="flex flex-col">
                    <span className="font-bold text-lg">{profile?.username}</span>
                    <span className="text-sm text-slate-500">@ {profile?.name}</span>
                    <span className="text-sm my-1"></span>
                </div>

                <div className="flex flex-col gap-2 flex-wrap">
                    <div className="flex gap-2 items-center">
                        <BsFillCalendar2DateFill />
                        <span className="text-sm text-slate-500">{profile?.$createdAt.split("T")[0]}</span>
                    </div>
                    <input type ="text" name="bio" value={editForm.bio} onChange={handleEditChange} readOnly/>

                    <div className="flex">
                        <span><input type = "number" className="h-5 w-5 outline-0 bg-pink-300" onChange={handleFollowing} readOnly />Following</span>
                        <span><input type = "number" className="h-5 w-5 outline-0 bg-green-200" onChange={handleFollower}  readOnly/>Follower</span>
                    </div>

                </div>






            </div>

        </div>
    )

}
export default Profile;