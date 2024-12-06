import { Router } from "express"
import {  applyToJob, deleteJobApplication, getAllApplicationsByApplicantId, getApplicationById } from "../controllers/applicants.controller.js"
import applicantAuth from "../middlewares/applicantAuth.middleware.js"
import jobAuth from "../middlewares/jobAuth.middleware.js"

const router = Router()

router.route("/applyToJob").post(jobAuth, applyToJob)
router.route("/deleteJobApplication").delete(deleteJobApplication)
router.route("/getAllApplicationsByApplicantId/:id").get(applicantAuth, getAllApplicationsByApplicantId)
router.route("/getApplicationById/:id").get(applicantAuth, getApplicationById)


export default router