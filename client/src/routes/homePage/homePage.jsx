import { useContext } from 'react'
import "./homePage.scss"
//import { motion } from "framer-motion"
import SearchBar from '../../components/searchBar/SearchBar';
import { AuthContext } from '../../context/AuthContext';

function HomePage() {

  const {currentUser}=useContext(AuthContext)

 console.log(currentUser);
  
  return (
    <div className='homePage'>
      <div className="textcontainer">
        <div className="wrapper">
        <h1 className='title'>We Build Dreams</h1>
        <h2>Find Real Estate & Get your Dream Place.</h2>
        <p>Your dream home is just a click away! Whether you're looking to rent a cozy apartment or buy your forever home, we make the journey effortless and exciting. Explore trusted listings, connect with the right owners, and take the next step toward a place you'll truly love.</p>
        <SearchBar/>
        <div className="boxes">
          <div className="box">
            <h1>100%</h1>
            <h2>Assured Property</h2>
          </div>
          <div className="box">
            <h1>000</h1>
            <h2>Unverified Users</h2>
          </div>
          <div className="box">
            <h1>100%</h1>
            <h2>Transparency</h2>
          </div>
        </div>
        </div>
        </div>
      <div className="imgcontainer">
      <motion
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
            <img src="./bg.png" alt="photo"/>
        </motion>    
    </div>
    </div>
  )
}

export default HomePage
