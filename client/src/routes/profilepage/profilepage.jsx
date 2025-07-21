import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import Chat from '../../components/chat/chat';
import List from '../../components/list/list';
import apiRequest from '../../lib/apiReq';
import './profilepage.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';


function ProfilePage(){
    const data=useLoaderData();
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatUser, setActiveChatUser] = useState(null);

    const{updateUser, currentUser}= useContext(AuthContext);

    const navigate=useNavigate();

    // Check if there was an error loading the data
    if (data.error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{data.message}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    useEffect(() => {
       if(!currentUser) {
        navigate("/login");
       }
     }, [currentUser,navigate]);

    // Check for active chat from localStorage when component mounts
    useEffect(() => {
      const chatId = localStorage.getItem("activeChatId");
      const userStr = localStorage.getItem("activeChatUser");

      if (chatId && userStr) {
        setActiveChat(chatId);
        setActiveChatUser(JSON.parse(userStr));

        // Clear the localStorage after retrieving the values
        localStorage.removeItem("activeChatId");
        localStorage.removeItem("activeChatUser");
      }
    }, []);

    const handleLogout= async() => {

        try{
            await apiRequest.post("/auth/logout");
            updateUser(null);
            navigate("/");

        }catch(err){
            console.log(err);
        }
    }
    return(
        currentUser && (
        <div className="profile">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1>User Information</h1>
                        <Link to="/profile/update"><button>Update Profile</button></Link>
                    </div>
                    <div className="info">
                        <span>Avatar:<img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar"/></span>
                        <span>Username: <b>{currentUser.username}</b></span>
                        <span>Email: <b>{currentUser.email}</b></span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <div className="title">
                        <h1>My List</h1>
                        <Link to="/profile/create">
                        <button>Create New Post</button>
                        </Link>
                    </div>
                    <div>
                        <List posts={data.postResponse.data.userPosts} isUserPosts={true} />
                    </div>

                    {/* <List/> */}
                    <div className="title">
                        <h1>Saved List</h1>
                    </div>
                    <div>
                        <List posts={data.postResponse.data.savedPosts} isUserPosts={false} />
                    </div>

                </div>
            </div>
            <div className="chatcontainer">
                <div className="wrapper">
                <Chat
                    chats={data.chatResponse.data}
                    selectedUser={activeChatUser}
                    autoOpen={!!activeChat}
                    initialChatId={activeChat}
                />
                </div>
            </div>
        </div>
    )
)

}

export default ProfilePage