import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const where = {};

    if (query.city) where.city = query.city;
    if (query.type) where.type = query.type;
    if (query.property) where.property = query.property;
    if (query.bedroom && !isNaN(parseInt(query.bedroom))) {
      where.bedroom = parseInt(query.bedroom);
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {
        ...(query.minPrice ? { gte: parseInt(query.minPrice) } : {}),
        ...(query.maxPrice ? { lte: parseInt(query.maxPrice) } : {}),
      };
    }

    const posts = await prisma.post.findMany({
      where,
    });

    // Optional artificial delay to simulate loading
    setTimeout(() => {
      res.status(200).json(posts);
    }, 1000);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get Posts" });
  }
};

export const getPost = async (req, res) => {
   const { id } = req.params; // ✅ fixed destructuring
  try {
     const post = await prisma.post.findUnique({
       where: { id: id },
       include:{
        postDetail:true,
        user:{
          select:{
            id:true,
            username:true,
            avatar:true
          }
        },
       }
     });
     let userId;
     const token=req.cookies?.token;
     if(!token){
      userId=null;

     }else{
         jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
          if(err){
            userId=null;
          }else{
            userId=payload.id;
          }
         })
     }
     const savedPost=await prisma.savedPost.findUnique({
       where:{
        userId_postId:{
          postId:id,
          userId,
        },
       },
     })

     res.status(200).json({...post,isSaved:savedPost?true:false});
   } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get Post" });
  }
};


export const addPost = async (req, res) => {
  const tokenUserId = req.userId;
  const body = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
         userId:tokenUserId,
         postDetail:{
          create:body.postDetail,

         }
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error("Post creation failed:", err);
    res.status(500).json({ message: "Failed to create Post" });
  }
};


// export const updatePost = async (req, res) => {
//   try {
//     res.status(200).json();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to Update Post" });
//   }
// };

export const deletePost = async (req, res) => {
  console.log("Delete post request received for ID:", req.params.id);
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    // First check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        savedPosts: true
      }
    });

    if (!post) {
      console.log("Post not found:", id);
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId) {
      console.log("Not authorized. Post userId:", post.userId, "Token userId:", tokenUserId);
      return res.status(403).json({ message: "Not Authorized!" });
    }

    console.log("Post found, proceeding with deletion. Related records:", {
      hasPostDetail: !!post.postDetail,
      savedPostsCount: post.savedPosts.length
    });

    // Delete in the correct order to respect foreign key constraints
    // 1. First delete any saved posts references
    if (post.savedPosts.length > 0) {
      await prisma.savedPost.deleteMany({
        where: { postId: id }
      });
      console.log("Deleted saved post references");
    }

    // 2. Delete the post detail if it exists
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: id }
      });
      console.log("Deleted post detail");
    }

    // 3. Finally delete the post itself
    await prisma.post.delete({
      where: { id }
    });
    console.log("Post successfully deleted");

    res.status(200).json({ message: "Post Deleted!" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to Delete Post: " + err.message });
  }
};
