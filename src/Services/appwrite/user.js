import { Client, Databases, ID, Storage, Permission, Role } from 'appwrite'
import conf from './config.js';
import authService from './auth.js';
import { Query } from 'appwrite';

export class UserProfileService {
    client = new Client()


    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) //! backend ki rest api call hogi 
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);

    }
    async createProfile({ userId, name, username }) {

        try {

            const ans = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUser_Id, //! user Id
                ID.unique(),          //! document id 

                {
                    userId: userId,
                    name: name,
                    username: username,
                    bio: " ",
                    profileImageId: "",
                    coverImageId: "",
                    followerCount: 0,
                    followingCount: 0,
                },
                [
                    // Permission.read(Role.any()),//!koi bhi dekh sakta h 
                    // Permission.update(Role.user(userId)), //!admin waali functionality
                    // Permission.delete(Role.user(userId))

                ],

            )
            console.log("profile created", ans);
            return ans;

        } catch (error) {
            console.log("Create Profile Error", error);
            throw error;

        }
    }

    async getProfileByUserId(userId) {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,

            conf.appwriteUser_Id,
            [
                Query.equal("userId", [userId])
            ]
        );
    }

    async updateProfile(documentId, { name, username, bio, profileImageId, coverImageId }) {
        try {
            const userData = await authService.getCurrentUser();
            if (userData) {

                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteUser_Id,
                    documentId,
                    {
                        name: name,
                        username: username,
                        bio: bio,
                        profileImageId: profileImageId,
                        coverImageId: coverImageId,

                    }
                )

            }
        }
        catch (error) {
            console.log(error.message)
        }
    }
    async getUserProfile() {
        try {
            const GetProfile = await authService.getCurrentUser();
            console.log(GetProfile);

            if (GetProfile) {

                const result = await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteUser_Id,

                    [
                        Query.equal("userId", GetProfile.$id), //! ye id logged in user ki id h 
                    ]
                )
                console.log(result)
                return result;

            }
        } catch (error) {
            console.log("error after geting profile", error);

        }
    }

    //!profile image ke baare me  3 function create honge

    async uploadProfileImage(fileOrPayLoad) {
        const file = fileOrPayLoad?.file || fileOrPayLoad;
        const userId = fileOrPayLoad?.userId;
        const permissions = [Permission.read(Role.any())]
        // console.log(file);
        // console.log(userId);
        try {
            await authService.refreshSession();

            const userData = await authService.getCurrentUser();
            console.log(userData)
            if (!userData) {
                console.log("User NOt authenticated");
                return null;
            }
            if (userId) {
                permissions.push(Permission.update(Role.user(userId)));
                permissions.push(Permission.delete(Role.user(userId)));
                return await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file, permissions);
            }
        }

        catch (error) {
            console.log("error", error);
        }

    }
    async deleteProfileImage({ fileId }) {
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId, fileId);

        } catch (error) {
            console.log("error", error);

        }

    }
    async getProfileImagePreview(fileOrPayload) {
        const fileId = typeof fileOrPayload === "string" ? fileOrPayload : fileOrPayload?.fileId;
        if (!fileId) {
            return "";
        }
        return this.storage.getFileView(conf.appwriteBucketId, fileId).toString();
    }
}



const userProfileServices = new UserProfileService();
export default userProfileServices;