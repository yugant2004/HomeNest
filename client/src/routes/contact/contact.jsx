import './contact.scss';


function Contact(){
    return(
        <div className="contact">
        <div className="left">
            <div className="developer">
                <div className="photo">
                    <img src="https://images.pexels.com/photos/31068578/pexels-photo-31068578.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"/>
                </div>
                <div className="personaldetails">
                    <h2 className='Name'>Name- Vibhor Talwar</h2>
                    <h3 className='email'>Email- Vibhortalwar1@gmail.com</h3>
                    <h3 className='mobile'>Mobile No.- +91 9667470274</h3>
                    <a className='linkedin' href="https://www.linkedin.com/in/vibhor-talwar-422879281?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">LinkedIn Profile- <b>Vibhor Talwar</b></a>
                </div>
            </div><br/>
            
            <div className="developer">
                <div className="photo">
                    <img src="https://images.pexels.com/photos/30833124/pexels-photo-30833124.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"/>
                </div>
                <div className="personaldetails">
                    <h2 className='Name'>Name- Yugant Vashishtha</h2>
                    <h3 className='email'>Email- yugantvashishtha61@gmail.com</h3>
                    <h3 className='mobile'>Mobile No.- +91 9289363769</h3>
                    <a className='linkedin' href="https://www.linkedin.com/in/yugant-vashishtha-242083245/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BXMKiQ7B3QvmV779dfJCqlA%3D%3D">LinkedIn Profile- <b>Yugant Vashishtha</b></a>
                </div>
            </div><br/>
            <div className="developer">
                <div className="photo">
                    <img src="https://images.pexels.com/photos/31098714/pexels-photo-31098714.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"/>
                </div>
                <div className="personaldetails">
                    <h2 className='Name'>Name- Lakshya Varshney</h2>
                    <h3 className='email'>Email- 30lakshya2003@gmail.com</h3>
                    <h3 className='mobile'>Mobile No.- +91 7017333463</h3>
                    <a className='linkedin' href="https://www.linkedin.com/in/lakshya-varshney-a08aa4208/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3B4oBwNmxgRlqiKgVBs4oLKw%3D%3D">LinkedIn Profile- <b>Lakshya Varshney</b></a>
                </div>
            </div>
            </div>

            <div className="right">
            <img src="./bg.png" alt="photo"/>
            </div>
        </div>
    )

}

export default Contact