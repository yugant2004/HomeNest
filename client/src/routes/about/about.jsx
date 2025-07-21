import "./about.scss";

function About(){
    return(
        <div className="about">
           <div className="homenest">
            <div className="wrapper">
            <h1>Home Nest</h1>
            <h3>We Build Dreams...</h3>
            <br/>
            <h4>At HomeNest, we make renting and buying homes simple, secure, and hassle-free. Whether you're looking for a cozy apartment, a spacious house, or an investment property, we provide a seamless platform to explore verified listings that match your needs.</h4>
            <br/>
            <br/>
            <h3>Why Choose Us?</h3>
            <br/>
           
               <ul>✅ <b>Diverse Property Listings</b> – Explore a wide range of homes for different budgets and preferences.</ul>
               <ul>✅<b> Trusted & Verified</b> – Every listing goes through a verification process to ensure accuracy and reliability.</ul>
               <ul>✅ <b>Smart Search Filters</b> – Easily find homes based on location, price, and features that matter to you.</ul>
               <ul>✅ <b>User-Friendly Design</b> – Our platform is built for everyone, ensuring a smooth experience for users of all ages, from kids to adults.</ul><br/>

            <h3>Our Mission</h3><br/>
            <h4>Our goal is to connect home seekers with property owners in a smooth, transparent, and efficient way. We strive to simplify the home-finding journey by offering reliable listings and a user-friendly experience.</h4><br/>

            <h3> Start Your Journey with HomeNest</h3><br/>
             <h4>Begin your search today and take the next step toward finding a place you can call home. Explore listings, schedule visits, and let Homenest guide you to the right choice.</h4>
            </div>
           </div>

           <div className="bgimage">
           <img src="./bg.png" alt="photo"/>
           </div>
        </div>
    )
}

export default About