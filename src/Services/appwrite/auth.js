import conf from './config.js'
import {Client,ID, Account} from 'appwrite'

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl) //! backend ki rest api call hogi 
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        console.log('Appwrite config:', conf.appwriteUrl, conf.appwriteProjectId);
        
    }

    async refreshSession(){
    try {
        // Force refresh current session
        const sessions = await this.account.listSessions();
        // If we got here, session is valid
        return sessions;
    } catch (error) {
        console.log("Session refresh failed:", error);
        return null;
    }
}

    async  CreateAccount({email, password, name}) {
        try {
            const userData = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            return userData;


            
        } catch (error) {
            console.log(error)
            
        }

    }
    async login({email , password}){
        return this.account.createEmailPasswordSession(email,password);
    }
    async logout(){
        try {
            return await this.account.deleteSession('current');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }

    }
    async getCurrentUser(){
        try {
            return await this.account.get();

            
        } catch (error) {
            if(error.code === 401){
                return null;
            }
            
        
        return null ; 
        }
    }


}
const authService = new AuthService();
export default authService;