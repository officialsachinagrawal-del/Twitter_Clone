import React, { useEffect, useState } from 'react'
import TweetCard from '../Components/TweetCard/TweetCard';
import tweetServices from '../Services/appwrite/tweet';
import Container from '../Components/Container/Container';
import { useSelector } from 'react-redux';


export function Home() {

    //* home page pe post h ya nahi use getPost() se puch lenge 
    const [posts, setPosts] = useState([]);

    const authStatus = useSelector((state) => state.auth.status);


    const fetchTweets = async () => {
        const result = await tweetServices.getUserAllTweets();
        console.log("fetched tweets: ", result.documents[result.documents.length - 1])
        const ans =  result.documents[result.documents.length - 1]
        console.log(ans)
        
        result.documents.forEach((tweet) => {
            console.log(
                "content =", tweet.content,
                "tweetImageId =", tweet.tweetImageId,
                "userId =", tweet.userId
            );
        });

        if (result) {
            setPosts(result.documents)
        }
    }
    useEffect(() => {
        fetchTweets();
    }, [])

    //! mere pass post h yaa nahi me uski length(array ki lenge jo ki .documents se mili h array)
    //! se check krunga 

    if (!authStatus) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    {/* flex flex-wrap => makes element in a new line */}
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-gray-500 cursor-pointer'>
                                Login to read posts
                            </h1>
                        </div>

                    </div>
                </Container>
            </div>
        )
    }
    // ! meri post exist krtih 
    return (
        <div className='w-full py-8'>
            {/* //* saari post dikhani h  */}
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    //  console.log("appwrite post Docuemt", post)

                    <TweetCard
                        key={post.$id}
                        content={post.content}
                        tweetImageId={post.tweetImageId}
                        userId={post.userId}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        $createdAt={post.$createdAt}
                    />
                ))}
            </div>

        </div>
    )

    // {
    //     posts.map((post) => {
    //         console.log(post);

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

