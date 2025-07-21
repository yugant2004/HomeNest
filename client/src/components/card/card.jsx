import { Link } from "react-router-dom"
import "./card.scss"
import { formatIndianPrice } from '../../utils/formatters'
import { useContext, useState } from 'react'
import apiRequest from '../../lib/apiReq'
import { AuthContext } from '../../context/AuthContext'

function Card({ item, isUserPost, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { currentUser } = useContext(AuthContext)

    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!window.confirm("Are you sure you want to delete this post?")) {
            return
        }

        setIsDeleting(true)
        try {
            console.log("Attempting to delete post with ID:", item.id)
            const response = await apiRequest.delete(`/posts/${item.id}`)
            console.log("Delete response:", response.data)

            if (onDelete) {
                onDelete(item.id)
            }

            // Show success message
            alert("Post deleted successfully!")
        } catch (err) {
            console.error("Failed to delete post:", err)

            // Provide more detailed error message
            let errorMessage = "Failed to delete post"

            if (err.response) {
                errorMessage += ": " + (err.response.data?.message || `Server returned ${err.response.status}`)
                console.error("Error response:", err.response.data)
            } else if (err.request) {
                errorMessage += ": No response received from server. Please check your connection."
                console.error("No response received:", err.request)
            } else {
                errorMessage += ": " + (err.message || "Unknown error")
            }

            alert(errorMessage)
        } finally {
            setIsDeleting(false)
        }
    }

    return(
        <div className="card">
            <Link to={`/${item.id}`} className="imageContainer">
            <img src={item.images[0]}/>
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="address">
                  <img className="pin" src= "/pin.png"/><span>{item.address}</span>
                </p>
                <p className="price">{formatIndianPrice(item.price)}</p>
                <div className="bottom">
                   <div className="features">
                    <div className="feature">
                        <img src="/bed.png" alt="bed"/>
                        <span>{item.bedroom} bedroom</span>
                    </div>
                    <div className="feature">
                        <img src="/bath.png" alt="bath"/>
                        <span>{item.bathroom} bathroom</span>
                    </div>
                   </div>
                   <div className="icons">
                    {isUserPost && (
                        <div className="icon delete-icon" onClick={handleDelete} disabled={isDeleting}>
                            <img src="/delete.jpg" alt="delete" />
                        </div>
                    )}
                    <Link to={`/${item.id}`}>
                    <div className="icon">
                        <img src="/save.png" alt="save"/>
                    </div>
                    </Link>
                    
                    
                     <Link to={`/${item.id}`}>
                    <div className="icon">
                        <img src="/chat.png"/>
                    </div>
                    </Link>
                    
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Card