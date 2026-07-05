//! Flow =>  User tweet likhe -> CreateTweet() -> Appwrite Tweet Collection -> Home Feed me listDocuments() -> Tweets render

import { Client, Databases, Storage, Permission, Role, ID, Query } from "appwrite";
import conf from "./config.js";
import authService from "./auth.js";


export class TweetServices {

    /*//! create three function
       
      1 ->CreateTweet()
      2 -> deleteTweet()
      3 ->UpdateTweet()
      4-> GetTweet()

      4 -> getTweetImagePreview()
      5-> uploadTweetImage()

    //*/

    client = new Client();

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createUserTweet({ userId, content, tweetImageId }) {
        try {

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwritetweetId,   //! = > userTweetID
                ID.unique(),            //! => docuemntID

                {
                    userId: userId,
                    content: content,
                    tweetImageId: tweetImageId,
                    likeCount: 0,
                    commentCount: 0,
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId)),

                ]
            )
        } catch (error) {
            console.log("my error in creating tweet", error)

        }
    }
    async updateUserTweet(documentId, { content, tweetImageId, likeCount, commentCount }) {
        try {

            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwritetweetId,
                documentId,
                {
                    content: content,
                    tweetImageId: tweetImageId,
                    likeCount: likeCount,
                    commentCount: commentCount,
                }
            )
        }
        catch (error) {
            console.log("error in updating profile", error);
            throw error;
        }
    }
    //?puri tweet ko delete krne ke lie
    async deleteUserTweet({ documentId }) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwritetweetId,
                documentId
            )

        } catch (error) {
            console.log("error in deleting tweet", error);
            throw error;

        }
    }
    //! user ki latest tweet ko get knre ke lie kaam aa rha h 
    async getUserSingleTweet(){
        try {

            const getTweet = await authService.getCurrentUser();
            console.log("current UserId", getTweet.$id);
            if (getTweet) {
                const result = await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwritetweetId,
                    [
                        Query.equal("userId", getTweet.$id),
                        Query.orderDesc("$createdAt"),
                        Query.limit(1)
                    ]
                )
                return result;
            }

        }
        catch (error) {
            console.log("error in getting single tweet", error);
            throw error;
        }

    }

    //! jis bhi tweet pe click ho us tweet ki datail nikal jaae
    async getTweetById(tweetId){
        try {

            const tweetData = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwritetweetId,
                tweetId,
            )
            return tweetData;
            
        } catch (error) {
            console.log("Error occuring while getting single tweet", error.message)
            
        }
    }
    async getUserAllTweets() {
        try {
            return this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwritetweetId,
                [
                    Query.orderDesc("$createdAt"),
                    Query.limit(100),
                ]
            )


        } catch (error) {
            console.log("Error in getting all tweets", error);
            throw error;

        }

    }

    //!Upload Services
    //? Upload
    async uploadUserTweetImage(fileorPayLoad) {
        const file = fileorPayLoad?.file || fileorPayLoad;
        console.log(file.size/1024/1024, "mb")
        const userId = fileorPayLoad?.userId;
        const permissions = [Permission.read(Role.any())];

        if (userId) {
            permissions.push(Permission.update(Role.user(userId)));
            permissions.push(Permission.delete(Role.user(userId)));
        }
        try {
            return this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                permissions,
            );
        }
        catch (error) {
            console.log("error in uploading tweet image", error);
            throw error;
        }



    }
    //? delete tweet image
    async deleteUserTweetImage({ fileId }) {
        try {
            return this.storage.deleteFile(conf.appwriteBucketId, fileId);
        }
        catch (error) {
            console.log("Error in deleting file", error)
        }

    }
    //? tweetImage get ke lie 
    async getUserTweetImagePreview(fileOrPayload) {
        const fileId = typeof fileOrPayload === "string" ? fileOrPayload : fileOrPayload?.fileId;
        if (!fileId) {
            return null;
        }
        return this.storage.getFileView(conf.appwriteBucketId, fileId)
            .toString();
    }

}
const tweetServices = new TweetServices();
export default tweetServices;

