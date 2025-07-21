//import { defer } from "react-router-dom";
import apiRequest from "./apiReq";

export const singlePageLoader=async ({request,params})=>{
    const res= await apiRequest("/posts/"+params.id)
    return res.data
}
export const listPageLoader=async ({request,params})=>{
    const query= request.url.split("?")[1]
    const postPromise=apiRequest("/posts?"+ query);
    return ({
        postResponse: postPromise,
    })
}

export const profilePageLoader = async () => {
  try {
    const postResponse = await apiRequest("/users/profilePosts");
    const chatResponse = await apiRequest("/chats");
    return {
      postResponse: postResponse,
      chatResponse: chatResponse
    };
  } catch (error) {
    console.error("Error in profilePageLoader:", error);

    // Return a default response structure with error information
    // This prevents the UI from crashing completely
    return {
      error: true,
      message: error.code === 'ERR_NETWORK'
        ? "Unable to connect to the server. Please check if the server is running."
        : "An error occurred while loading profile data.",
      postResponse: { data: { userPosts: [], savedPosts: [] } },
      chatResponse: { data: [] }
    };
  }
};