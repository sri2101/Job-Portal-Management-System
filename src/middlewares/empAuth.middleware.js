import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import jwt from "jsonwebtoken"
import Employer from "../models/employer.model.js"

const empAuth = async (req, res, next) => {
    // req.body || req.file
    // res  || next 

    try {
        const token = req.cookies?.accessToken

        if (!token) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Token expired!!")
                )
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const employeeData = await Employer.findById(decodedToken._id).select("-password")

        if (!employeeData) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Invalid Token!")
                )
        }

        req.employeer = employeeData
        next()
    } catch (error) {
        return res
            .status(400)
            .json(
                new HandleError(400, error?.message)
            )
    }
}

// 1. we need the token first
// 2. Whether there is any token or not
// 3. If not, throw an error.
// 4. If token present, just decode that token.
// 5. Make a DB call and verify the data which is present inside that token
// 6. If not present, throw an error
// 7. Save the response inside req object

export default empAuth