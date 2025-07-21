import { Link,useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
//import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiReq";

 function Signup() {
  const [error,setError]=useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setError("")
    setIsLoading(true);

    const formData=new FormData(e.target);
    const username=formData.get("username");
    const email=formData.get("email");
    const password=formData.get("password");
  
  try{
    const res= await apiRequest.post("/auth/register",{
      username,email,password
    })
    console.log(res.data);
    navigate("/login")
  }catch(err){
    setError(err.response.data.message)
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
          transition={{ duration: 0.4 }}
        >

         <form onSubmit={handleSubmit}>
          <h2 className="heading">Sign Up</h2>
            <motion.input required name="username" type="text" placeholder="Username" />
            <motion.input required name="email" type="email" placeholder="Email" />
            <motion.input required name="password" type="password" placeholder="Password" />
            <motion.button 
              disabled={isLoading}
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
            {error &&<span>{error}</span>}
          </form>
          <p className="question" onClick={() => navigate("/login")}>Already have an account? Login</p>
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
export default Signup;

