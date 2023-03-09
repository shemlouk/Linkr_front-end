import Header from "../../layouts/Header/index";
import React, { useState, useEffect, useContext } from "react";
import * as P from "./styles";
import { IoHeartOutline, IoTrashOutline, IoPencilSharp } from "react-icons/io5";
import WritePost from "../../layouts/WritePostBox/WritePost";
import axios from "axios";
import Trending from "../../layouts/Trending";
import SessionContext from "../../hooks/SessionContext";
import HashtagContext from "../../hooks/HashtagContext";
import { useParams } from "react-router-dom";

const Timeline = () => {
    const { hashtagName } = useParams();
    const { session } = useContext(SessionContext);
    const { hashtag, setHashtag } = useContext(HashtagContext);
    const [isLoading, setIsLoading] = useState(true)
    const [postList, setPostList] = useState([])

    useEffect(() => {
        const localSession = JSON.parse(localStorage.getItem("session"));
        if (!localSession || !hashtagName) {
            setHashtag(null);
        }
        
        async function getPosts() {
            try {
                const res = await axios.get("https://jsonplaceholder.typicode.com/posts")
                setPostList(res.data.slice(0, 20))
                setIsLoading(false)

            } catch ({ response }) {
                console.error(response)
                alert("An error occurred while trying to fetch the posts, please refresh the page.")
            }
        }
        async function getPostsWithHashtag() {
            try {
                const res = (await axios.get(`${process.env.REACT_APP_API_URL}/hashtag/${hashtag.id}`, localSession.auth)).data;
                setPostList(res.slice(0, 20));
                setIsLoading(false);
            } catch (error) {
                console.error(`getPostWithHashtag: ${error}`);
                alert("An error occurred while trying to fetch the posts, please refresh the page.");
            }
        }

        hashtagName ? getPostsWithHashtag() : getPosts();
        
    }, [hashtagName])

    return (
        <>
            <Header />
            <P.PageContainer>
                <P.TitleBox>
                    { hashtagName? (`# ${hashtag.hashtag}`) : ("timeline")}
                </P.TitleBox>
                <P.ContentWrapper>
                    <P.PostWrapper>
                        { hashtagName? (null) : (<WritePost />)}
                        <P.PostListing>
                            {isLoading ? (
                                <P.SpecialMessage>Loading...</P.SpecialMessage>
                            ) : postList.length > 0 ? (
                                postList.map((post) => (
                                    <P.PostBox key={post.id}>
                                        <P.LeftSide>
                                            <img src="https://www.w3schools.com/howto/img_avatar.png" />
                                            <div>
                                                <IoHeartOutline />
                                                <p>13 likes</p>
                                            </div>
                                        </P.LeftSide>
                                        <P.RightSide>
                                            <P.PostUser>
                                                <p>{post.userId}</p>
                                                <div>
                                                    <span><IoPencilSharp /></span>
                                                    <span><IoTrashOutline /></span>
                                                </div>
                                            </P.PostUser>
                                            <P.PostContent>
                                                <p>{post.title}</p>
                                                <P.LinkPreview>
                                                    <div>
                                                        <span>All Hope Is Gone (Audio)</span>
                                                        <p>Slipknot's official audio stream for 'All Hope Is Gone' from the album, All Hope Is Gone - available now on Roadrunner Records. Download it at https://slipkn...</p>
                                                        <p>https://www.youtube.com/watch?v=Wn2w3j_xmbw&ab_channel=Slipknot</p>
                                                    </div>
                                                    <img src="https://i.ytimg.com/vi/Wn2w3j_xmbw/maxresdefault.jpg" />
                                                </P.LinkPreview>
                                            </P.PostContent>
                                        </P.RightSide>
                                    </P.PostBox>
                                ))
                            ) : (
                                <P.SpecialMessage>There are no posts yet.</P.SpecialMessage>
                            )}
                        </P.PostListing>
                    </P.PostWrapper>
                    { session ? <Trending/> : null}
                </P.ContentWrapper>
            </P.PageContainer>
        </>

    )
}

export default Timeline