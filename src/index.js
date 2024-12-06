import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./database/database.connect.js";

dotenv.config({ path: "./.env" })


connectDB()
.then(() => {
    console.log(`MongoDB Connected !!!`)

    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is listening on port ${process.env.PORT || 4000}`)
    })
})
.catch((error) => {
    console.log(error?.message)
})