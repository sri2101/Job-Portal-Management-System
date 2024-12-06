import { Router } from "express"
import { signup, login, logout, updateDetails, updatePassword, currentJobSeeker, deleteAccount } from "../controllers/jobSeeker.controller.js"
import upload from "../middlewares/multer.middleware.js"
import jobSeekerAuth from "../middlewares/jobSeekerAuth.middleware.js"

const router = Router()

router.route("/signup").post(upload.single("resume"), signup)
router.route("/login").post(login)
router.route("/logout").get(jobSeekerAuth, logout)
router.route("/updateDetails").patch(jobSeekerAuth,updateDetails)
router.route("/updatePassword").patch(jobSeekerAuth, updatePassword)
router.route("/currentjobseeker").get(jobSeekerAuth, currentJobSeeker)
router.route("/deleteAccount").delete(deleteAccount)

export default router