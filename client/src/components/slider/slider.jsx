import { useState } from 'react';
import './slider.scss';

function Slider({images}){
    const[imgIndex,setImgIndex]=useState(null);
    const changeSlide=(direction)=>{
        if(direction==="left"){
            if(imgIndex===0){
                setImgIndex(images.length-1)

            }else{
                setImgIndex(imgIndex-1)

            }
        }else{
            if(imgIndex===images.length-1){
               setImgIndex(0);
            }else{
                setImgIndex(imgIndex+1)
            }
        }
    }
    return(
        <div className="slider">{
            imgIndex!==null && <div className="fullslider">
                <div className="arrow" onClick={()=>changeSlide("left")}>
                    <img src="./arrow.png"/>
                </div>
                <div className="imagecontainer">
                    <img src={images[imgIndex]}/>
                </div>
                <div className="arrow"onClick={()=>changeSlide("left")}>
                    <img src="./arrow.png" className='right' /></div>
                <div className="close" onClick={()=>setImgIndex(null)}>X</div>
            </div>}
            <div className="bigimage">
                <img src={images[0]} onClick={()=>setImgIndex(0)}/>
            </div>
            <div className="smallimg">
                {images.slice(1).map((image,index)=>(
                    <img src={image} alt="" key={index} onClick={()=>setImgIndex(index+1)}/>
                ))}
            </div>
        </div>
    )
}
export default Slider