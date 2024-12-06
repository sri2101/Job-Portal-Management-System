import mongoose, {Schema} from "mongoose"

const applicantSchema = new Schema({
    applicant_name: {
        type: String,
        required: true
    },
    applicant_id: {
        type: Schema.Types.ObjectId,
        ref: "JobSeeker",
        required: true
    },
    phone_no: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    job_id: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    }
})

const Applicant = mongoose.model("Applicant", applicantSchema)

export default Applicant