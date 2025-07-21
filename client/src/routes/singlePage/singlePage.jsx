// import './singlePage.scss';
// import Slider from '../../components/slider/slider';
// import Map from "../../components/map/map";
// import { Link, useLoaderData, useNavigate } from "react-router-dom";
// import DOMPurify from "dompurify";
// import { useContext, useState } from 'react';
// import { AuthContext } from "../../context/AuthContext";
// import apiRequest from "../../lib/apiReq";

// function SinglePage() {
//   const post = useLoaderData();
//   const [saved, setSaved] = useState(post.isSaved);
//   const { currentUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const detail = post.postDetail || {};

//   const handleSave = async () => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     setSaved((prev) => !prev);
//     try {
//       await apiRequest.post("/users/save", { postId: post.id });
//     } catch (err) {
//       console.log(err);
//       setSaved((prev) => !prev);
//     }
//   };

//   const formatDistance = (distance) => {
//     if (typeof distance !== 'number') return "Distance unknown";
//     return distance > 999 ? `${distance / 1000}km` : `${distance}m`;
//   };

//   return (
//     <div className="SinglePage">
//       <div className="details">
//         <div className="wrapper">
//           <Slider images={post.images} />
//           <div className="info">
//             <div className="top">
//               <div className="post">
//                 <h1>{post.title}</h1>
//                 <div className="address">
//                   <img src='./pin.png' />
//                   <span>{post.address}</span>
//                 </div>
//                 <div className="price">{post.price} Crore</div>
//               </div>
//               <div className="user">
//                 <img src={post.user?.avatar} alt="userphoto" />
//                 <div className="name">
//                   <span>{post.user?.username}</span>
//                 </div>
//               </div>
//             </div>
//             <div
//               className="bottom"
//               dangerouslySetInnerHTML={{
//                 __html: DOMPurify.sanitize(detail.desc || "No description available!"),
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="features">
//         <div className="wrapper">
//           <div className="buttons">
//             <Link to="/profile">
//               <button>
//                 <img src="./chat.png" />
//                 Send a Message
//               </button>
//             </Link>
//             <button
//               onClick={handleSave}
//               style={{ backgroundColor: saved ? "lightgrey" : "white" }}
//             >
//               <img src="./save.png" />
//               {saved ? "Place Saved" : "Save the Place"}
//             </button>
//           </div>

//           <p className="heading">General</p>
//           <div className="listvertical">
//             <div className="feature">
//               <img src="./utility.png" />
//               <div className="featuretext">
//                 <span>Utilities</span>
//                 <p>{detail.utilities === "owner" ? "Owner is responsible" : "The tenant is responsible"}</p>
//               </div>
//             </div>
//             <div className="feature">
//               <img src="./pet.png" />
//               <div className="featuretext">
//                 <span>Pet Policy</span>
//                 <p>{detail.pet === "allowed" ? "Pets are allowed" : "Pets are not allowed"}</p>
//               </div>
//             </div>
//             <div className="feature">
//               <img src="./fee.png" />
//               <div className="featuretext">
//                 <span>Income Policy</span>
//                 <p>{detail.income || "Not specified"}</p>
//               </div>
//             </div>
//           </div>

//           <p className="title">Sizes</p>
//           <div className="sizes">
//             <div className="size">
//               <img src="./size.png" />
//               <span>Size {detail.size || "N/A"} sqft</span>
//             </div>
//             <div className="size">
//               <img src="./bed.png" />
//               <span>{post.bedroom} bedroom</span>
//             </div>
//             <div className="size">
//               <img src="./bath.png" />
//               <span>{post.bathroom} bathroom</span>
//             </div>
//           </div>

//           <p className="title">Nearby Places</p>
//           <div className="listhorizontal">
//             <div className="feature">
//               <img src="./school.png" />
//               <div className="featuretext">
//                 <span>School</span>
//                 <p>{formatDistance(detail.school)} away</p>
//               </div>
//             </div>
//             <div className="feature">
//               <img src="./bus.png" />
//               <div className="featuretext">
//                 <span>Bus Stop</span>
//                 <p>{formatDistance(detail.bus)} away</p>
//               </div>
//             </div>
//             <div className="feature">
//               <img src="./restaurant.png" />
//               <div className="featuretext">
//                 <span>Restaurant</span>
//                 <p>{formatDistance(detail.restaurant)} away</p>
//               </div>
//             </div>
//           </div>

//           <p className="Location">Location</p>
//           <div className="mapcontainer">
//             <Map items={[post]} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SinglePage;

import './singlePage.scss';
import Slider from '../../components/slider/slider';
import Map from "../../components/map/map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from 'react';
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiReq";
import { formatIndianPrice } from '../../utils/formatters';

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const detail = post.postDetail || {};

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleMessageClick = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    console.log("Post user:", post.user);
    console.log("Current user:", currentUser);

    // Check if post.user is undefined or doesn't have an id
    if (!post.user || !post.user.id) {
      alert("Cannot identify the post owner. Please try again later.");
      return;
    }

    // Check if user is trying to message themselves
    if (currentUser.id === post.user.id) {
      alert("You cannot send a message to yourself");
      return;
    }

    try {
      console.log("Sending chat request with receiverId:", post.user.id);

      const res = await apiRequest.post("/chats", {
        receiverId: post.user.id,
      });

      console.log("Chat created:", res.data);

      // Store the chat ID and receiver info in localStorage
      localStorage.setItem("activeChatId", res.data.id);
      localStorage.setItem("activeChatUser", JSON.stringify({
        id: post.user.id,
        username: post.user.username,
        avatar: post.user.avatar
      }));

      // Navigate to profile page
      navigate("/profile");
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Failed to start chat: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDistance = (distance) => {
    if (typeof distance !== 'number') return "Distance unknown";
    return distance > 999 ? `${distance / 1000}km` : `${distance}m`;
  };

  return (
    <div className="SinglePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src='./pin.png' />
                  <span>{post.address}</span>
                </div>
                <div className="price">{formatIndianPrice(post.price)}</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar} alt="userphoto" />
                <div className="name">
                  <span>{post.user?.username}</span>
                </div>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(detail.desc || "No description available!"),
              }}
            />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <div className="buttons">
            <button
              onClick={handleMessageClick}
              disabled={currentUser && currentUser.id === post.user.id}
              style={{
                opacity: currentUser && currentUser.id === post.user.id ? 0.5 : 1,
                cursor: currentUser && currentUser.id === post.user.id ? 'not-allowed' : 'pointer'
              }}
            >
              <img src="./chat.png" />
              {currentUser && currentUser.id === post.user.id ? "Cannot message yourself" : "Send a Message"}
            </button>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "lightgrey" : "white" }}
            >
              <img src="./save.png" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>

          <p className="heading">General</p>
          <div className="listvertical">
            <div className="feature">
              <img src="./utility.png" />
              <div className="featuretext">
                <span>Utilities</span>
                <p>{detail.utilities === "owner" ? "Owner is responsible" : "The tenant is responsible"}</p>
              </div>
            </div>
            <div className="feature">
              <img src="./pet.png" />
              <div className="featuretext">
                <span>Pet Policy</span>
                <p>{detail.pet === "allowed" ? "Pets are allowed" : "Pets are not allowed"}</p>
              </div>
            </div>
            <div className="feature">
              <img src="./fee.png" />
              <div className="featuretext">
                <span>Income Policy</span>
                <p>{detail.income || "Not specified"}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="./size.png" />
              <span>Size {detail.size || "N/A"} sqft</span>
            </div>
            <div className="size">
              <img src="./bed.png" />
              <span>{post.bedroom} bedroom</span>
            </div>
            <div className="size">
              <img src="./bath.png" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listhorizontal">
            <div className="feature">
              <img src="./school.png" />
              <div className="featuretext">
                <span>School</span>
                <p>{formatDistance(detail.school)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="./bus.png" />
              <div className="featuretext">
                <span>Bus Stop</span>
                <p>{formatDistance(detail.bus)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="./restaurant.png" />
              <div className="featuretext">
                <span>Restaurant</span>
                <p>{formatDistance(detail.restaurant)} away</p>
              </div>
            </div>
          </div>

          <p className="Location">Location</p>
          <div className="mapcontainer">
            <Map items={[post]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;


