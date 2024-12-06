import { Router } from "express"
import { createJob, listAllJobs, getJobById, updateJobById, deleteJobById } from "../controllers/job.controller.js"
import jobAuth from "../middlewares/jobAuth.middleware.js"
import empAuth from "../middlewares/empAuth.middleware.js"


const router = Router()

router.route("/createJob").post(empAuth, createJob)
router.route("/listAllJobs").get(listAllJobs)
router.route("/getJobById/:id").get(jobAuth, getJobById)
router.route("/updateJobById/:id").patch(jobAuth, updateJobById)
router.route("/deleteJobById/:id").delete(jobAuth, deleteJobById)

export default router