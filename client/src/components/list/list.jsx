import "./list.scss";
import Card from "../card/card";
import { useState, useEffect } from "react";

function List({ posts, isUserPosts = false }) {
    const [postsList, setPostsList] = useState(posts || []);

    // Update postsList when posts prop changes
    useEffect(() => {
        setPostsList(posts || []);
    }, [posts]);

    const handleDeletePost = (deletedPostId) => {
        console.log("Removing post from list:", deletedPostId);
        setPostsList(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    };

    if (!postsList || postsList.length === 0) {
        return (
            <div className="list empty-list">
                <p className="no-posts-message">
                    {isUserPosts
                        ? "You haven't created any posts yet. Click 'Create New Post' to get started!"
                        : "No saved posts found."}
                </p>
            </div>
        );
    }

    return (
        <div className="list">
            {postsList.map(item => (
                <Card
                    key={item.id}
                    item={item}
                    isUserPost={isUserPosts}
                    onDelete={handleDeletePost}
                />
            ))}
        </div>
    );
}

export default List;