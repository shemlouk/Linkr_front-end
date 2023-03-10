import Header from "../../layouts/Header/index";
import React, { useState, useEffect, useContext } from "react";
import * as P from "./styles";
import { IoHeartOutline, IoTrashOutline, IoPencilSharp } from "react-icons/io5";
import WritePost from "../../layouts/WritePostBox/index";
import axios from "axios";
import Trending from "../../layouts/Trending";
import { SessionContext } from "../../hooks/SessionContext";
import { API_URL } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { ReactTagify } from "react-tagify";
import HashtagContext from "../../hooks/HashtagContext";

const Timeline = () => {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    const { setHashtag } = useContext(HashtagContext);
    const [isLoading, setIsLoading] = useState(true)
    const [postList, setPostList] = useState([])

    useEffect(() => {

        async function getPosts() {

            try {
                let res
                if (!session) {
                    res = await axios.get(`${API_URL}/timeline`)
                } else {
                    res = await axios.get(`${API_URL}/timeline`, session.auth)
                }
                setPostList(res.data)
                setIsLoading(false)
            } catch ({ response }) {
                console.error(response)
                alert("An error occurred while trying to fetch the posts, please refresh the page.")
            }
        }
        getPosts()
    }, [])

    async function selectHashtag(hashtag) {
        hashtag = hashtag.replace("#", "");
        
        try {
            const res = (await axios.get(`${API_URL}/hashtag/search/${hashtag}`, session.auth)).data;
            setHashtag({
                ...res
            });
            navigate(`/hashtag/${hashtag}`);
        } catch (error) {
            console.error(`selectHashtag: ${error}`);
        }
    }

    return (
        <>
            <Header />
            <P.PageContainer>
                <P.TitleBox>
                    timeline
                </P.TitleBox>
                <P.ContentWrapper>
                    <P.PostWrapper>
                        {session ? <WritePost /> : null}
                        <P.PostListing>
                            {isLoading ? (
                                <P.SpecialMessage>Loading...</P.SpecialMessage>
                            ) : postList.length > 0 ? (
                                postList.map((post) => (
                                    <P.PostBox key={post.id}>
                                        <P.LeftSide>
                                            <img src={post.profilePicture} />
                                            <div>
                                                <IoHeartOutline />
                                                <p>13 likes</p>
                                            </div>
                                        </P.LeftSide>
                                        <P.RightSide>
                                            <P.PostUser>
                                                <Link to={`/user/${post.user_id}`}>
                                                    <p>{post.name}</p>
                                                </Link>
                                                <div>
                                                    <span><IoPencilSharp /></span>
                                                    <span><IoTrashOutline /></span>
                                                </div>
                                            </P.PostUser>
                                            <P.PostContent>
                                                <ReactTagify tagStyle={{fontWeight: 700, color: "white", cursor: "pointer"}} tagClicked={(tag)=> selectHashtag(tag)}>
                                                    <p>{post.description}</p>
                                                </ReactTagify>
                                                <P.LinkPreview>
                                                    <div>
                                                        <span>{post.preview_title}</span>
                                                        <p>{post.preview_desc}</p>
                                                        <p>{post.url}</p>
                                                    </div>
                                                    <img src={post.preview_img} alt="preview_img" />
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
                    {session ? <Trending /> : null}
                </P.ContentWrapper>
            </P.PageContainer>
        </>

    )
}

export default Timeline