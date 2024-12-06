import HandleError from "../utils/HandleError.js"
import HandleResponse from "../utils/HandleResponse.js"
import JobSeeker from "../models/jobSeeker.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import bcrypt from "bcrypt"


const signup = async (req, res) => {
    const {
        name,
        email,
        phone_no,
        gender,
        education,
        experience,
        location,
        password
    } = req.body

    if (
        !name ||
        !email ||
        !phone_no ||
        !gender ||
        !education ||
        !experience ||
        !location ||
        !password
    ) {
        return res
        .status(200)
        .json(
            new HandleError(400, "All fields are required!")
        )
    }

    /*
      Task ---> Complete this portion by yourself
    */

      if (name.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Name should not be empty!!")
        )
    }

    if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) { 
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid E-Mail!!")
        )
    }

    if (String(phone_no).length !== 10) { 
        return res
        .status(400)
        .json(
            new HandleError(400, "Phone no must be 10 digits long!!")
        )
    }
    
      if (gender !== "male"  && gender !== "female" && gender !== "others") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid gender!")
        )
    }

    //if (!req.file || req.file.fieldname !== 'resume') {
         //return res 
         //.status(400) 
         //.json( 
            //new HandleError(400, "Resume file is required!") 
        //)

    //}


    if (education.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Education should not be empty!!")
        )
    }

    if(Number(experience.trim() === "")) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Experience should not be empty!!")
        )
    }

    if (!location.trim()) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Location should not be empty!!")
        )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        )
    }


    const resume = req.file

    console.log(resume)

    if (!resume) {
         return res
         .status(400)
         .json(
             new HandleError(400, "Resume is required!!")
         )
     }

      //console.log("Uploaded resume file: ", resume)

    const response = await uploadOnCloudinary(resume.path)

    console.log(response)

    if (!response) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while uploading resume!")
        )
    }

    const isExistedJobSeeker = await JobSeeker.findOne({ $or: [ { email }, { phone_no } ] })

    if (isExistedJobSeeker) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Jobseeker is already existed!")
        )
    }

    const jobseeker = await JobSeeker.create({
        name: name,
        email: email,
        phone_no: Number(phone_no),
        gender: gender,
        education: education,
        experience: experience,
        location: location,
        password: password,
        resume: response.secure_url
    })

    const isCreated = await JobSeeker.findById(jobseeker?._id).select("-password")

    if (!isCreated) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while creating account!")
        )
    }

    return res
    .status(201)
    .json(
        new HandleResponse(200, isCreated, "Profile created successfully!")
    )
}

const login = async (req, res) => {

    const { email, password } = req.body

    if(!email || !password) {
        return res
       .status(400)
       .json(
            new HandleError(400, "All fields are required!")
        )
    }

    if(email.trim() === "") {
        return res
       .status(400)
       .json(
            new HandleError(400, "Invalid Email!!")
        )
    }

    if(password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        ) 
    }

    const jobseekerData = await JobSeeker.findOne({ email: email.trim() })

    if(!jobseekerData) {
        return res
       .status(400)
       .json(
            new HandleError(400, "Account not exists! Please create an account!")
        )
    }

    const isCorrectPassword = await jobseekerData.comparePassword(password, jobseekerData.password)

    if (!isCorrectPassword) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid password!")
        )
    }

    const accessToken = jobseekerData.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new HandleResponse(200, {}, "Login Successfully!")
    )


// 1. take credentials from the front-end
    // 2. sanitize all data
    // 3. check document is present inside the database or not.
    // 4. if not, just throw an error
    // 5. otherwise perform login operation
    // 6. generate accessToken
    // 7. store token into cookies
    // 8. return response
}

const logout = async (req, res) => {
    /*
    1. take _id from authentication
    2. remove accessToken from cookies
    3. return response
    */

 const{ _id } = req.jobseeker

 if(!req?.jobseeker) {
    return res
    .status(400)
    .json(
        new HandleError(400, "You havent logged in yet!")
    )
 }

 const options = {
    httpOnly: true,
    secure: true
 }

 return res
 .status(200)
 .clearCookie("accessToken", options)
 .json(
    new HandleResponse(200, {}, "Logged out Successfully!")
 )

}

const updateDetails = async (req, res) => {
    /*
    1. take new name from the frontend
    2. take _id from authentication
    3. update the name in the database
    4. return response
    */
    const { name, email, phone_no, education, experience, location, skills } = req.body

    if (!name || !email || !phone_no || !education || !experience || !location || !skills) {
      return res
      .status(400)
      .json(
        new HandleError(400,"You have to provide at least 1 field!!")
      )}

      if (name && name.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Name should not be empty!")
        )
    }

    if (email && !/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email?.trim())) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid E-Mail")
        )
    }

    if (phone_no && phone_no?.trim()?.length !== 10) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid Phone Number!")
        )
    }

    if( education && education?.trim() === "") {
            return res
            .status(400)
            .json(
                new HandleError(400, "Education should not be empty!")
            )
        }

    if(experience && experience?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Experience should not be empty!")
        )
    }

    if(location && location?.trim() === ""){
        return res
        .status(400)
        .json(
            new HandleError(400, "Location should not be empty!")
        )
    }

    if(skills && skills?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Education should not be empty!")
        )
    }
    
    const jobseekerData = await JobSeeker.findByIdAndUpdate(req.jobseeker._id,
        {
            $set: { 
                name: name,
                email: email,
                phone_no: Number(phone_no),
                education: education,
                experience: Number(experience),
                location: location,
                skills: skills 
            }
        },
         { 
            new: true
         }
         ).select('-password')

         await jobseekerData.save({ validateBeforeSave: false })
       
       return res
       .status(200)
       .json(
           new HandleResponse(200, jobseekerData, "Details updated successfully!")
       )  

}


const updatePassword = async (req, res) => {
    /*
    1. take new password from the frontend
    2. take _id from authentication
    3. update the password in the database
    4. return response
    */
    const {password} = req.body

    if (!password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password required!")
        )
    }

    if (password?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should not be empty!")
        )
    }
    if (password?.trim().length < 8 || password?.trim().length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        )
    }

    const encryptedPassword = await bcrypt.hash(password?.trim(), 10)

    const jobseekerData = await JobSeeker.findByIdAndUpdate(
        req.jobseeker._id,
        {
            $set: {
                password: encryptedPassword
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new HandleResponse(200, jobseekerData, "Password updated successfully!")
    )
 }


const currentJobSeeker = async (req, res) => {
    /*
    1. take _id from authentication
    2. fetch document using _id
    3. return response
    */

    const jobseekerId = req?.jobseeker._id
      
    if (!jobseekerId) {
        return res
        .status(400)
        .json(
            new HandleResponse(400, "User ID is missing or unauthorized!")
        )
    }
    return res
    .status(200)
    .json(
        new HandleResponse(200, req?.jobseeker, "Current employeer fetched successfully!")
    )
}

const deleteAccount = async (req, res) => {
    /*
    1. take _id from authentication
    2. delete document from the database
    4. return response
    */
    const jobseekerId = req?.jobseeker._id
      
    if (!jobseekerId) {
        return res
        .status(400)
        .json(
            new HandleResponse(400, "Jobseeker ID is missing or unauthorized!")
        )
    }
    const deletedjobseeker = await JobSeeker.findByIdAndDelete(jobseekerId)
    
    if (!deletedjobseeker) {
            return res
            .status(400)
            .json(
                new HandleResponse(400, "Jobseeker does not exist!")
            )
    }
    
    return res
    .status(200)
    .json(
         new HandleResponse(200, "Account deleted successfully!" )
        )
        
}


export {
    signup,
    login,
    logout,
    updateDetails,
    updatePassword,
    currentJobSeeker,  // For checking logged-in user details
    deleteAccount
}