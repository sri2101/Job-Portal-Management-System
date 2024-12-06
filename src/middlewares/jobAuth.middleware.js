import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import jwt from "jsonwebtoken"
import Job from "../models/jobs.model.js"

const jobAuth = async (req, res, next) => {
    
try {
    const token = req.cookies?.accessToken
    
    if (!token) {
        return res
        .status(400)
        .json(new HandleError(400, "Token expired!!"))
    }

       
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      
    const jobData = await Job.findById(decodedToken._id)
        
    if (!jobData) {
        return res
        .status(400)
        .json(new HandleError(400, "Invalid Token!"))
        }

        req.jobs = jobData
        next()
    } catch (error) {
        return res
        .status(400)
        .json(new HandleError(400, error?.message));
    }
}

export default jobAuth


