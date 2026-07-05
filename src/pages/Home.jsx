import React, { useEffect, useState } from 'react'
import TweetCard from '../Components/TweetCard/TweetCard';
import tweetServices from '../Services/appwrite/tweet';
import Container from '../Components/Container/Container';
import { useSelector } from 'react-redux';
import SingleTweetCard from '../Components/SingleTweetCard/SingleTweetCard';
import { Navigate, useNavigate } from 'react-router-dom';


export function Home() {

    //* home page pe post h ya nahi use getPost() se puch lenge 
    const [posts, setPosts] = useState([]);

    const authStatus = useSelector((state) => state.auth.status);

    const navigate = useNavigate();

    
    const fetchTweets = async () => {
        try {
           
            const result = await tweetServices.getUserAllTweets();
            const documents = result?.documents ?? [];

            ////console.log("fetched tweets count:", documents.length);

            // documents.forEach((tweet) => {
            //     console.log(
            //         "content =", tweet.content,
            //         "tweetImageId =", tweet.tweetImageId,
            //         "userId =", tweet.userId
            //     );
            // });

            setPosts(documents);
        } catch (error) {
            console.log("error in fetching tweets", error);
            setPosts([]);
        }
    }
    useEffect(() => {
        fetchTweets();
    }, [authStatus])

    function handlePostClick (postId){
        console.log(postId)

        navigate(`/tweet/${postId}`)
        
    }

    //! mere pass post h yaa nahi me uski length(array ki lenge jo ki .documents se mili h array)
    //! se check krunga 

    if (!authStatus) {
        return (
            <div className='py-10 text-center'>
                <Container>
                    {/* flex flex-wrap => makes element in a new line */}
                    <div className='surface mx-auto max-w-2xl rounded-[2rem] p-10'>
                        <div className='space-y-4'>
                            <span className='stat-chip mx-auto'>Live feed</span>
                            <h1 className='text-3xl font-bold text-slate-900'>Login to read posts</h1>
                            <p className='mx-auto max-w-lg text-slate-600'>The feed is ready. Sign in to post, react, and open the full conversation stream.</p>
                            <button className='rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(14,165,233,0.22)]' onClick={() => navigate('/login')}>
                                Go to login
                            </button>
                        </div>

                    </div>
                </Container>
            </div>
        )
    }
    // ! meri post exist krtih 
    return (
        <div className='py-4'>
            {/* //* saari post dikhani h  */}
            <div className='mb-6 rounded-4xl border border-white/70 bg-white/70 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
                <div className='flex items-center justify-between gap-4'>
                    <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Timeline</p>
                        <h1 className='mt-1 text-2xl font-bold text-slate-900'>Your feed</h1>
                    </div>
                    <span className='stat-chip'>{posts.length} posts</span>
                </div>
            </div>
            <div className='flex flex-wrap'>
                {posts.length === 0 && (
                    <div className='surface w-full rounded-[2rem] p-10 text-center text-slate-500'>
                        No tweets yet. Be the first one to post.
                    </div>
                )}
                {/* //! sabhi post dikhane ke lie */}
                {posts.map((post) => (
                    //  ////console.log("appwrite post Docuemt", post)

                   <div 
                   key={post.$id}
                   onClick={() => handlePostClick(post.$id)}
                   >

                    <TweetCard
                        key={post.$id}
                        content={post.content}
                        tweetImageId={post.tweetImageId}
                        userId={post.userId}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        $createdAt={post.$createdAt}
                    />
                    </div>
                ))}

               {/* {posts.map((post) => ( */}




              
                    
             {/* ))} */}
             
               
            </div>

        </div>
    )

    // {
    //     posts.map((post) => {
    //         ////console.log(post);

    //         return (
    //             <TweetCard
    //                 key={post.$id}
    //                 content={post.content}
    //                 tweetImageId={post.tweetImageId}
    //                 userId={post.userId}
    //                 likeCount={post.likeCount}
    //                 commentCount={post.commentCount}
    //                 $createdAt={post.$createdAt}
    //             />
    //         );
    //     })
    // }




}

