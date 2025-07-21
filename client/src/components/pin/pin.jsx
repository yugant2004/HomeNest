import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
    <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt="" />
          <div className="textContainer">
           <div className="title"><Link to={`/${item.id}`}>{item.title}</Link></div> 
            <span><b>{item.bedroom}</b> bedroom</span>
            <b>{item.price} Cr </b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;