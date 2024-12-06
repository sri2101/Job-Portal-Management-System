import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import jwt from "jsonwebtoken"
import Applicant from "../models/applicants.model.js"

const applicantAuth = async (req, res, next) => {
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

        const applicantData = await Applicant.findById(decodedToken._id).select("-password")

        if (!applicantData) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Invalid Token!")
                )
        }

        req.applicant = applicantData
        next()
    } catch (error) {
        return res
            .status(400)
            .json(
                new HandleError(400, error?.message)
            )
    }
}

export default applicantAuth

