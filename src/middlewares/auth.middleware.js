import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const authenticateUser = asyncHandler(async(req , res, next) => {
    
    const token = req.header("Authorization");
    
    // console.log("This is token: ", token)

    if(!token){
        // console.log("Token not found")
        return res.json(new ApiResponse(400, {}, "User is not authenticated : Token not found"));
    }
    
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decode){
        // console.log("Token not able to decode")
        return res.json(new ApiResponse(400, {}, "Try login again: token might expired"));
    }

    req.user = {
        id: decode._id
    };
    next();
});

export default authenticateUser;