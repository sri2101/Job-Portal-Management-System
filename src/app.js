import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json( 
    {
        limit:'100kb'
    }
))  // For handling JSON data
app.use(express.urlencoded(
    {
        limit:'100kb',
        extended:true 
    }
))  // http://localhost:3000/login?username=iamrahul&password=1234
app.use(express.static("public/temp"))

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(cookieParser())



import employeerRouter from "./routes/employeer.route.js"
import jobSeekerRouter from "./routes/jobSeeker.route.js"
import jobRouter from "./routes/job.route.js"
import applicantRouter from "./routes/applicant.route.js"


app.use("/api/v1/employeer", employeerRouter)
app.use("/api/v1/jobseeker", jobSeekerRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/applicant", applicantRouter)



export default app