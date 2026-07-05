//! Profile Page

//*Flow => Profile Open -> Fetch User Data -> Set State -> Render Images

//! Contains:
//! Profile Page

//*Flow => Profile Open -> Fetch User Data -> Set State -> Render Images

import { BsFillCalendar2DateFill, BsBoxArrowLeft } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userProfileServices from "../Services/appwrite/user.js";
import coverimage from '../images/cover.png';
import ProfileImage from '../images/Profile_avtar_image.png';
import { setProfileImage } from "../features/authSlice.js";

function Profile(){
    const [profile, setProfile] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState(coverimage);
    const [profileImageUrl, setProfileImageUrl] = useState(ProfileImage);
    const [editForm, setEditForm] = useState({
        name : "",
        username: "",
        bio: "",
        password: "",
    });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const CoverfileRef = useRef(null);
    const dialogRef = useRef(null);
    const navigate = useNavigate();
    const ProfileRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            const result = await userProfileServices.getUserProfile();
            const profileData = result?.documents?.[0];

            if (profileData) {
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
            }
        };

        fetchProfile();
    }, []);

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

            dialogRef.current?.close();
        }
    };

    const handleCoverImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !profile) return;

        const uploadFile = await userProfileServices.uploadProfileImage({ file, userId : profile.userId });
        if(!uploadFile) return;

        const previewUrl = await userProfileServices.getProfileImagePreview(uploadFile.$id);
        setCoverImageUrl(previewUrl);
        setProfile((prev) => ({ ...prev, coverImageId: uploadFile.$id }));

        await userProfileServices.updateProfile(profile.$id, {
            name: profile.name,
            username : profile.username,
            bio: profile.bio,
            profileImageId: profile.profileImageId,
            coverImageId: uploadFile.$id,
        });
    };

    const handleProfileImage = async(e) =>{
        const file = e.target.files[0];
        if(!file || !profile) return;

        const uploadFile = await userProfileServices.uploadProfileImage({ file, userId: profile.userId });
        if(!uploadFile) return;

        const profilePreviewUrl = await userProfileServices.getProfileImagePreview(uploadFile.$id);
        if(!profilePreviewUrl) return;

        setProfileImageUrl(profilePreviewUrl);
        dispatch(setProfileImage(profilePreviewUrl));
        setProfile((prev) => ({ ...prev, profileImageId: uploadFile.$id }));

        await userProfileServices.updateProfile(profile.$id, {
            name: profile.name,
            username: profile.username,
            bio: profile.bio,
            profileImageId: uploadFile.$id,
            coverImageId: profile.coverImageId,
        });
    };

    const handleFollowing = async () =>{};
    const handleFollower = async () =>{};

    return (
        <div className="profile-shell py-4">
            <div className="surface overflow-hidden rounded-[2rem] flex flex-col">
                <div className="flex gap-10 px-6 py-4 items-center border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
                    <button onClick={() => navigate('/')} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"> <BsBoxArrowLeft /> </button>
                    <div className="flex flex-col">
                        <p className="font-bold text-xl text-slate-900">{profile?.name}</p>
                        <span className="text-sm text-slate-500"></span>
                    </div>
                </div>

                <div className="relative group/cover">
                    <img src={coverImageUrl} className="h-60 w-full object-cover" alt="cover-image"/>
                    <input type="file" ref={CoverfileRef} onChange={handleCoverImage} hidden />
                    <button className="absolute top-4 right-4 rounded-full p-3 bg-slate-900/80 text-white backdrop-blur-md cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200" onClick={() => CoverfileRef.current.click()}><MdEdit /></button>

                    <div className="absolute -bottom-16 left-6 rounded-full">
                        <div className="relative group/avatar w-32 rounded-full">
                            <img src={profileImageUrl} alt="profile image" className="rounded-full ring-8 ring-white shadow-2xl" />
                            <input type="file" ref={ProfileRef} onChange={handleProfileImage} hidden />
                            <div className="absolute top-5 right-3 p-1 bg-sky-500 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer text-white shadow-lg">
                                <button className="cursor-pointer" onClick={() => ProfileRef.current.click()}><MdEdit/></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-20">
                    <button
                        className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.22)] hover:bg-sky-600 cursor-pointer"
                        onClick={() => dialogRef.current?.showModal()}
                    >
                        Edit Profile
                    </button>
                    <dialog ref={dialogRef} id="edit_profile_modal" className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-0 text-slate-900 shadow-[0_35px_100px_rgba(15,23,42,0.24)] outline-none">
                        <div className="max-h-[85vh] overflow-auto p-6">
                            <h3 className="font-bold text-2xl my-3">Update Profile</h3>
                            <form className="flex flex-wrap gap-4" onSubmit={handleUpdateProfile}>
                                <div className="flex flex-wrap gap-2 w-full">
                                    <input type="text" placeholder="full Name" className="soft-input flex-1" name="name" value={editForm.name} onChange={handleEditChange}/>
                                    <input type="text" placeholder="New userName" className="soft-input flex-1" name="username" value={editForm.username} onChange={handleEditChange} />
                                </div>

                                <div className="flex flex-wrap gap-2 w-full">
                                    <input type="email" placeholder="Email" className="soft-input flex-1" name="Email" readOnly/>
                                    <textarea placeholder="Bio" className="soft-input flex-1 min-h-28" name="bio" value={editForm.bio} onChange={handleEditChange}/>
                                </div>

                                <div className="flex flex-wrap gap-2 w-full">
                                    <input type="password" placeholder="Current Password" className="soft-input flex-1" name="currentPassword" value={editForm.password} onChange={handleEditChange} />
                                    <input type="password" placeholder="New Password" className="soft-input flex-1" name="newPassword" value={editForm.password} onChange={handleEditChange} />
                                </div>

                                <button className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.22)] hover:bg-sky-600" type="submit" onSubmit={handleUpdateProfile}>Update</button>
                            </form>
                        </div>

                        <form method="dialog" className="mt-4 flex justify-end px-6 pb-6">
                            <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none">close</button>
                        </form>
                    </dialog>
                </div>

                <div className="px-6 pt-24 pb-8 flex flex-col gap-3">
                    <span className="font-bold text-2xl text-slate-900">{profile?.username}</span>
                    <span className="text-sm text-slate-500">@ {profile?.name}</span>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="stat-chip">Followers</span>
                        <span className="stat-chip">Following</span>
                        <span className="stat-chip">Tweets</span>
                    </div>
                </div>

                <div className="px-6 pb-8 flex flex-col gap-4 flex-wrap">
                    <div className="flex gap-2 items-center text-slate-500">
                        <BsFillCalendar2DateFill />
                        <span className="text-sm text-slate-500">{profile?.$createdAt?.split("T")[0]}</span>
                    </div>
                    <input type="text" name="bio" value={editForm.bio} onChange={handleEditChange} readOnly className="soft-input bg-slate-50"/>

                    <div className="flex gap-3">
                        <span className="stat-chip"><input type="number" className="h-5 w-5 outline-0 bg-transparent text-center" onChange={handleFollowing} readOnly />Following</span>
                        <span className="stat-chip"><input type="number" className="h-5 w-5 outline-0 bg-transparent text-center" onChange={handleFollower} readOnly/>Follower</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;