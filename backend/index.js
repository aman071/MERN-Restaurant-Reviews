import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import resDAO from "./dao/resDAO.js"
import reviewsDAO from "./dao/reviewsDAO.js"

dotenv.config()
process.setMaxListeners(1)

const MongoClient=mongodb.MongoClient
const port = process.env.PORT || 8000
// console.log(process.env.RESETREVIEWS_DB_URI);
MongoClient.connect(
    process.env.RESETREVIEWS_DB_URI,        //Connect to mongoclient cluster
    {
        // poolSize:50,
        wtimeoutMS: 2500,
        // useNewUrlParse: true
    })
    // .catch(err => {
    //     console.log(err.stack)
    //     process.exit(1)
    // })
    .then(async client => {
        // console.log(client);
        await resDAO.injectDB(client)
        await reviewsDAO.injectDB(client)
        app.listen(port, ()=>{
            console.log(`Listening on ${port}...`)
        })
    })
