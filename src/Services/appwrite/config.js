const conf = {
    appwriteUrl :          String(import.meta.env.VITE_APPWRITE_URL || ""),

    appwriteFollowId   :   String(import.meta.env.VITE_APPWRITE_FollowsId || ""),
    appwriteLikes      :   String(import.meta.env.VITE_APPWRITE_Likes || ""),
    appwritetweetId    :   String(import.meta.env.VITE_APPWRITE_Tweets || ""),
    appwriteComment   :    String(import.meta.env.VITE_APPWRITE_Comments || ""),
    appwriteUser_Id    :   String(import.meta.env.VITE_APPWRITE_Users || ""),
    
    appwriteDatabaseId :   String(import.meta.env.VITE_APPWRITE_DATABASE_ID || ""),
    appwriteProjectId :    String(import.meta.env.VITE_APPWRITE_PROJECT_ID || ""),
    appwriteBucketId :     String(import.meta.env.VITE_APPWRITE_BUCKET_ID || "")



}
export default conf;