import { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./login.scss";
import apiRequest from "../../lib/apiReq";
import {AuthContext} from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser}=useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    console.log("Login attempt with:", { username, password: "***" });

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      console.log("Login successful:", res.data);
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="form-section">
        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <motion.input  name="username"
            required minLength={3}
            maxLength={20} type="text" placeholder="username" />
            <motion.input  name="password"
              required type="password" placeholder="Password" />
            <motion.button
            disabled={isLoading}
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            {error && <span>{error}</span>}
          </form>
          <p className="question"onClick={() => navigate("/signup")}>Don't have an account? Sign Up</p>
        </motion.div>
      </div>
      <div className="image-section">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
         <img src="./bg.png" alt="photo"/>
        </motion.h1>
      </div>
    </div>
  );
}

export default Login;
