import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Employer from "../models/employer.model.js";
import bcrypt from "bcrypt"

const signup = async (req, res) => {  // req --> data, res ---> ERROR || Response
    // 1. credentials required
    // 2. check all the credentials
    // 3. Either data will be present or not present
    // 4. Error (Already have an account)
    // 5. or, Create a new account 
    // 6. Send a response

    const { name, email, phone_no, address, status, password } = req.body  // 1

    if (!name || !email || !phone_no || !address || !status || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        )
    }

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

    if (address.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Address should not be empty!")
        )
    }

    if (status.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Status should not be empty!")
        )
    }

    if (status !== "company"  && status !== "individual") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Status should be either company or individual!")
        )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        )
    }
 
    const isExistedEmployer = await Employer.findOne({ $or: [ { email }, { phone_no } ] })

    if (isExistedEmployer) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Already have an account! Please go for signin!!")
        )
    }

    const employer = await Employer.create(
        { 
           name: name,
           email: email,
           phone_no: phone_no,
           address: address,
           status: status,
           password: password
        }
    )

    const createdEmployer = await Employer.findById(employer._id).select("-password")

    if (!createdEmployer) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Something went wrong while creating employer's account!")
        )
    }

    return res
    .status(201)
    .json(
        new HandleResponse(200, createdEmployer, "Account created successfully!")
    )
}

const login = async (req, res) => {
    // 1. username / email / mobile_no & password
    // 2. checking
    // 3. check whether the credentials are present inside the DB or not!
    // 4. password validation
    // 5. cookies
    // 6. Save the cookie
    // 7. return a response 

    const { email, password } = req.body

    if (!email || !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "All fields are required!!")
        )
    }

    if (email.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Email is required!!")
        )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password must be 8 to 16 digits long!")
        )
    }

    const employerData = await Employer.findOne({ email: email.trim() })  // null

    if (!employerData) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Account not exists! Please create an account!")
        )
    }

    const isCorrectPassword = await employerData.comparePassword(password, employerData.password)

    if (!isCorrectPassword) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid password!")
        )
    }

    const accessToken = employerData.generateAccessToken()

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
}

const logout = async (req, res) => {
    if (!req?.employeer) {
        return res
        .status(400)
        .json(
            new HandleError(400, "You haven't logged in yet!")
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
        new HandleResponse(200, {}, "Logged out successfully!")
    )
}

const currentEmployee = async (req, res) => {
    return res
    .status(200)
    .json(
        new HandleResponse(200, req?.employeer, "Current employeer fetched successfully!")
    )
}

const updateDetails = async (req, res) => {
    const { name, email, phone_no, website, password } = req.body

    if (!name && !email && !phone_no && !website && !password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "You have to provide at least 1 field!")
        )
    }

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

    if (website && !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(website?.trim())) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid Website URL")
        )
    }

    if (password && (password?.trim()?.length < 8 ||  password?.trim()?.length > 16)) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Invalid password length!")
        )
    }

    const employeerData = await Employer.findById(req.employeer._id)

    employeerData.name = name?.trim() === "" ? employeerData.name : name?.trim()
    employeerData.email = email?.trim() === "" ? employeerData.email : email?.trim()
    employeerData.phone_no = phone_no?.trim() === "" ? employeerData.phone_no : phone_no?.trim()
    employeerData.website = website?.trim() === "" ? employeerData.website : website?.trim()
    // employeerData.password = password?.trim() === "" ? employeerData.password : password?.trim()

    await employeerData.save({ validateBeforeSave: false })

    const updatedData = await Employer.findById(req.employeer._id)

    return res
    .status(200)
    .json(
        new HandleResponse(
            200,
            updatedData,
            "Details updated successfully!"
        )
    )

    // db.data.updateOne({ username: "admin" }, { $set: { age: "", password: "" } })

    return res
    .status(200)
    .json(
        new HandleResponse(
            200,
            updatedData,
            "Details updated successfully!!"
        )
    )
}

const updatePassword = async (req, res) => {
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

    const data = await Employer.findByIdAndUpdate(
        req.employeer._id,
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
        new HandleResponse(200, data, "Password updated successfully!")
    )
 }

 const deleteAccount = async (req, res) => {
    /*
    1. take _id from authentication
    2. delete document from the database
    4. return response
    */
    const employeerId =  req?.employeer._id
      
    if (!employeerId) {
        return res
        .status(400)
        .json(
            new HandleResponse(400, "Employeer is missing or unauthorized!")
        )
    }
    const deletedemployeer = await Employer.findByIdAndDelete(employeerId)
    
    if (!deletedemployeer) {
            return res
            .status(400)
            .json(
                new HandleResponse(400, "Employeer does not exist!")
            )
    }
    
    return res
    .status(200)
    .json(
         new HandleResponse(400, "Account deleted successfully!" )
        )
        

}

export {
    signup,
    login,
    logout,
    currentEmployee,
    updateDetails,
    updatePassword,
    deleteAccount
}