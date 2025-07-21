import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiReq";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    const updateData = { username, email, avatar:avatar[0] };
    if (password) {
      updateData.password = password;
    }

    try {
      setLoading(true);
      const response = await apiRequest.put(`/users/${currentUser.id}`, updateData);
      updateUser(response.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>

          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser?.username || ""}
            />
          </div>

          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser?.email || ""}
            />
          </div>

          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="New Password" />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>

          {error && <span className="error">{error}</span>}
        </form>
      </div>

      <div className="sideContainer">
        <img
          src={avatar[0] ||currentUser.avatar || "/noavatar.jpg"}
          alt="User Avatar"
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "dnblrkycn",
            uploadPreset: "HomeNest",
            multiple: false,
            maxImageFileSize: 7000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
