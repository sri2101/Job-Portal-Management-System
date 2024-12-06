import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import Job from "../models/jobs.model.js"


const createJob = async (req, res) => {
    /*
    1. take all required fields
    2. sanitize them properly
    3. create a job post by creating a new document for that job
    4. return response along with the job post
    */

    const { title, experience, salary, job_location, description, vacancy, date_of_post, company_details } = req.body
    
    
    if (!title || !experience || !salary || !job_location || !description || !vacancy || !date_of_post || !company_details) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        )
    }



    if (title.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Title should not be empty!!")
        )
    }

    if (Number(experience) === "") {
        return res
        .status(400)
         .json(
            new HandleError(400, "Experience should not be empty!!")
        )
    }

    if(Number(salary) === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Salary should not be empty !!")
        )
    }
    if (job_location.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "job location should not be empty!")
        )
    }

    if (job_location !== "remote"  && job_location !== "hybrid" && job_location !== "onsite") {
        return res
        .status(400)
        .json(
            new HandleError(400, "job location should be either remote,hybrid or onsite!")
        )
    }

    if (description.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Description should not be empty!!")
        )
    }

    if(vacancy.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "vacancy should not be empty!!")
        )
    }

    if (company_details.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "company details should not be empty!!")
        )
    }

    const isExistedJob = await Job.findOne({ $or: [ { createdBy : req.employeer._id}, { title : title }, { company_details : company_details } ] })

    if (isExistedJob) {
        return res
        .status(400)
        .json(
            new HandleError(400, "A job with the same title already exists for this employer!!")
        )
    }

    const jobs = await Job.create(
        {
            createdBy: req.employeer._id, 
            title : title, 
            experience: Number(experience),
            salary: Number(salary),
            job_location: job_location,
            description: description,
            vacancy: Number(vacancy),
            date_of_post: Date(date_of_post),
            company_details: company_details
        }

    )

    const createdJob = await Job.findById(jobs?._id)

    if (!createdJob) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while creating Job!")
        )
    }

    return res
    .status(201)
    .json(
        new HandleResponse(200, createdJob, "Job created successfully!")
    )
}


const listAllJobs = async (req, res) => {
    /*
    1. list all jobs
    2. return response along with all jobs
    */
    const jobId = req.params._id
    const job = await Job.find(jobId)

    if(!job) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Jobs not found, Create atleast One Job!")
        )
    }

    return res
   .status(200)
   .json(
        new HandleResponse(200, job, "Retrieved All Jobs Successfully")
    )
}

const getJobById = async (req, res) => {
   
        // 1. Get job by ID
        const jobId = req.params._id

        // Check if jobId is provided
        if (!jobId) {
            return res.status(400).json(new HandleError(400, "Invalid job ID"))
        }

        // Find job by ID
        const job = await Job.findById(jobId)

        // If no job is found
        if (!job) {
            return res
            .status(400)
            .json(new HandleError(400, "Job not found"))
        }

        // Return response along with the job
        return res
        .status(200)
        .json(new HandleResponse(200, job, "Job found successfully"))
    }

    
const updateJobById = async (req, res) => {
    /*
    1. take all necessary parameters
    2. sanitize them properly
    3. fetch job document by its _id
    4. make changes 
    5. save the changes
    6. return response along with the job post
    */
    const { title, experience, salary, description, vacancy, company_details } = req.body
    
    
    if (!title || !experience || !salary || !description || !vacancy || !company_details) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        )
    }
    if (title && title.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Title should not be empty!!")
        )
    }

    if (experience && experience?.trim() === "") {
        return res
        .status(400)
         .json(
            new HandleError(400, "Experience should not be empty!!")
        )
    }

    if(salary && salary.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Salary should not be empty !!")
        )
    }

    if (description && description.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Description should not be empty!!")
        )
    }

    if(vacancy && vacancy.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "vacancy should not be empty!!")
        )
    }

    if (company_details && company_details.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "company details should not be empty!!")
        )
    }
    const jobData = await JobSeeker.findByIdAndUpdate(req.jobs._id,
        {
            $set: { 
                title : title,
                experience: Number(experience),
                salary: Number(salary),
                description: description,
                vacancy: Number(vacancy),
                company_details: company_details
            }
        },
        { 
           new: true
        }
        )

        await jobData.save({ validateBeforeSave: false })
      
      return res
      .status(200)
      .json(
          new HandleResponse(200, jobData, "Job Details updated successfully!")
      )  
}

const deleteJobById = async (req, res) => {
    /*
    1. delete job by its _id
    2. return response with a success message
    */

    const jobId = req.params._id

    
    if(!jobId) {
        return res
        .status(400)
        .json(
            new HandleError(400, "JobId not found!")
        )
    }

    const deletedjob = await Job.findByIdAndDelete(jobId)
    
    if (!deletedjob) {
            return res
            .status(400)
            .json(
                new HandleResponse(400, "Job not found!")
            )
    }
    
    return res
    .status(200)
    .json(
         new HandleResponse(200, "job deleted successfully!" )
        )
}

export {
    createJob,
    listAllJobs,
    getJobById,
    updateJobById,
    deleteJobById
 }