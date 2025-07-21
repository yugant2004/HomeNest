import { useContext, useState,useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";


function Navbar () {
  const[open,setOpen]=useState(false);

  const { currentUser }= useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  useEffect(()=>{
    fetch();
  },[]);

  return (
  <nav>
    <div className="left">
      <a href="/" className="logo"><img src="/logo.png"/></a> 
      <a href="/">Home</a>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </div>

    <div className='right'>
     {currentUser ? (<div className="user">
      <img src={currentUser.avatar || "noavatar.jpg"}alt="user img"/>

     <span>{currentUser.username}</span>
     
     <Link to="/profile" className="button">
     {number>0 &&  <div className="notification">{number}</div>}  <span>Profile</span></Link>
     </div>) : (
      <>
       <Link to="/signup">Sign up</Link>
      <Link to="/login" className="register">Log in</Link>
      </>)}


      <div className="menuIcon">
        <img src="/menu.png" alt="icon" onClick={()=>setOpen((prev)=>!prev)}/>
      </div>


      <div className={open ? "menu active":"menu"}>
      <a href="/">Home</a>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Log In</Link>

      </div>
     
    </div>
  </nav>
  )
}

export default Navbar;
