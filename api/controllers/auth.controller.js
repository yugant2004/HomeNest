import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

    try {

     const hashedPassword=await bcrypt.hash(password,10);
     console.log(hashedPassword);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      console.log(newUser);
      res.status(201).json({ message:"User created successfully"});

    } catch (err) {
      console.error(err);
      res.status(500).json({ message:"User Already Exists"});
    }
  };

export const login=async (req,res)=>{
    console.log("Login request received:", req.body);
    const {username,password}=req.body;

    if (!username || !password) {
        return res.status(400).json({message:"Username and password are required"});
    }

    try{
        //checking if the user already exists
        const user=await prisma.user.findUnique({
            where:{username}
        });

        console.log("User found:", user ? "Yes" : "No");

        if(!user) return res.status(400).json({message:"Invalid credentials!"});

        //checking whether the entered password is correct or not
        const isPasswordValid=await bcrypt.compare(password,user.password);
        console.log("Password valid:", isPasswordValid ? "Yes" : "No");

        if(!isPasswordValid) return res.status(400).json({message:"Invalid credentials!"});

        const age=1000*60*60*24*7;  //generate cookie token and send to the user
        const token=jwt.sign({
          id:user.id,
          isAdmin:false,
        },process.env.JWT_SECRET_KEY,
        {expiresIn:"7d"}
      );

      const {password:userPassword,...userInfo}=user;

      console.log("Setting cookie and sending response");

      res.cookie("token", token, {
          httpOnly: true,
          maxAge: age,
          sameSite: 'lax',
          path: '/'
      }).status(200).json(userInfo);

    }catch(err){
        console.error("Login error:", err);
        res.status(500).json({message:"Failed to login: " + (err.message || "Unknown error")});
    }
};

export const logout=async (req,res)=>{
   res.clearCookie("token").status(200).json({message:"logout successful"});
};
