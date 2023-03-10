import Header from "../../layouts/Header/index";
import React, { useState, useEffect, useContext } from "react";
import * as P from "./styles";
import { IoHeartOutline, IoTrashOutline, IoPencilSharp } from "react-icons/io5";
import WritePost from "../../layouts/WritePostBox/WritePost";
import axios from "axios";
import Trending from "../../layouts/Trending";
import { SessionContext } from "../../hooks/SessionContext";
import { API_URL } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { ReactTagify } from "react-tagify";
import HashtagContext from "../../hooks/HashtagContext";
import ReactModal from "react-modal";

const customStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        zIndex: 5,
        display: "flex",
    },
    content: {
        display: "flex",
        width: "600px",
        height: "262px",
        backgroundColor: "#333333",
        borderRadius: "50px",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto"
    }
}

ReactModal.setAppElement('#root')


const Timeline = () => {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    const { setHashtag } = useContext(HashtagContext);
    const [isLoading, setIsLoading] = useState(true)
    const [postList, setPostList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                console.log(session.user)
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

    function closeModal() {
        setIsModalOpen(false)
    }

    function openModal() {
        setIsModalOpen(true)
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
                                                {session ? (
                                                    <div>
                                                        <span><IoPencilSharp /></span>
                                                        <span onClick={openModal}><IoTrashOutline /></span>
                                                    </div>
                                                ) : null
                                                }
                                            </P.PostUser>
                                            <P.PostContent>
                                                <ReactTagify tagStyle={{ fontWeight: 700, color: "white", cursor: "pointer" }} tagClicked={(tag) => selectHashtag(tag)}>
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
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <P.OverlayBox>
                    <p>Are you sure you want to delete this post?</p>
                    <div>
                        <button className="no-btn" onClick={closeModal}>No, go back</button>
                        <button className="yes-btn" onClick={closeModal}>Yes, delete it</button>
                        
                    </div>
                </P.OverlayBox>
            </ReactModal>
        </>

    )
}

export default Timeline