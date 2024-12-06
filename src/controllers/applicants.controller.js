import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Applicant from "../models/applicants.model.js";


const applyToJob = async (req, res) => {
    /*
    1. take all necessary parameters
    2. sanitize them properly
    3. check applicant_id is present or not in the database
    4. If present, just throw an error
    5. If not, create a new job application
    6. Save the application in the database
    7. Return a response with success message
    */

const { job_id } = req.body
    
    if (!job_id) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Job id is required!!")
        )
    }

    const jobData = await Job.findById(job_id)

    if(!jobData) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid job id!")
        )
    }

    const existingApplication = await Applicant.findOne({$and:[ {job_id: job_id}, { applicant_id: req.jobseeker._id } ]})      
        
    if (existingApplication) {
            return res
            .status(400)
            .json(
                new HandleError(400, "You have already applied for this job!")
                
            )
        }

    const jobApplication = await Applicant.create({
        applicant_name: req.jobseeker?.name,
        applicant_id: req.jobseeker._id,
        phone_no: req.jobseeker.phone_no,
        email: req.jobseeker.email,
        resume: req.jobseeker.resume,
        job_id: job_id,
    })
    await jobApplication.save()

    return res
    .status(200)
    .json(
        new HandleResponse(200, jobApplication, "Applied to job successfully!")
    )
}

const deleteJobApplication = async (req, res) => {
    /*
    1. take application_id from the request parameters
    2. check if the application exists in the database
    3. If not, throw an error
    4. Delete the application from the database
    5. Return a response with success message
    */
    const applicationId = req.params._id
    const application = await Applicant.findById(applicationId)
    
    if(!application) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Application not found!")
        )
    }
    

    const deletedapplication = await Job.findByIdAndDelete(applicationId)
    
    if (!deletedapplication) {
            return res
            .status(400)
            .json(
                new HandleResponse(400, "Job not found!")
            )
    }
    
    return res
    .status(200)
    .json(
         new HandleResponse(200, "Application deleted successfully!" )
        )
}

const getAllApplicationsByApplicantId = async (req, res) => {
    /*
    1. take applicant_id from the request parameters
    2. find all applications for this applicant in the database
    3. Return a response with the list of applications
    */
    const applicationId = req.params._id
    const application = await Applicant.find(applicationId)

    if(!application) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Applicant not found, Apply atleast to One Job!")
        )
    }

    return res
   .status(200)
   .json(
        new HandleResponse(200, jobs, "Retrieved All applications Successfully")
    )
}


const getApplicationById = async (req, res) => {
    /*
    1. take application_id from the request parameters
    2. find the application in the database by id
    3. Return a response with the application details
    */

    const applicationId = req.params._id
    const application = await Applicant.findById(applicationId)

    if(!application) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Application not found!")
        )
    }

    return res
   .status(200)
   .json(
        new HandleResponse(200, jobs, "Application found Successfully")
    )
}


export {
    applyToJob,
    deleteJobApplication,
    getAllApplicationsByApplicantId,
    getApplicationById   
}