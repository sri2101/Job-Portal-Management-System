import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import jwt from "jsonwebtoken"
import JobSeeker from "../models/jobSeeker.model.js" // Assuming you have a JobSeeker model

const jobSeekerAuth = async (req, res, next) => {
    // req.body || req.file
    // res || next

    try {
        const token = req.cookies?.accessToken

        if (!token) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Token expired!!")
                );
        }

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

        const jobSeekerData = await JobSeeker.findById(decodedToken._id).select("-password")

        if (!jobSeekerData) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Invalid Token!")
                )
        }

        req.jobseeker = jobSeekerData
        next()
    } catch (error) {
        return res
            .status(400)
            .json(
                new HandleError(400, error?.message)
            )
    }
};

// 1. We need the token first
// 2. Check whether there is any token or not
// 3. If not, throw an error.
// 4. If the token is present, decode that token.
// 5. Make a DB call and verify the data present inside that token
// 6. If not present, throw an error
// 7. Save the response inside the req object

export default jobSeekerAuth
