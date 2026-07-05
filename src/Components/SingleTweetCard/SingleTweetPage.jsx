
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import tweetServices from '../../Services/appwrite/tweet'
import SingleTweetCard from './SingleTweetCard'
function SingleTweetPage() {
    

    const { id } = useParams();   //! isko use islie kiya kyonki jb home.jsx file se id send ho rhih h use useParms handle kr rha h 
                                  //? {id} vahi id h jo click krne pe home.jsx ne send ki h 
    const [tweet, setTweet] = useState(null);

    useEffect(() => {
        async function fetchTweet() {
            const data = await tweetServices.getTweetById(id);
            setTweet(data);
        }

        fetchTweet();
    }, [id]);

    if (!tweet) return <h1>Loading...</h1>;

    return (
       
        <SingleTweetCard
            content={tweet.content}
            tweetImageId={tweet.tweetImageId}
            userId={tweet.userId}
            likeCount={tweet.likeCount}
            commentCount={tweet.commentCount}
            $createdAt={tweet.$createdAt}
        />
    );
}

export default SingleTweetPage;