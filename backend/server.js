// const express = require('express')
import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app=express()
app.use(cors())

app.use(cors(
    {
        origin: ["https://deploy-mern-1whq.vercel.app"],
        methods: ["POST", "GET", "PUT"],
        credentials: true
    }
))

/*
Earlier version required us to explicitly use bodyParser also
But newer versions has body parser included in request. It means
our server can accept json object direclty in the request body
*/
app.use(express.json())


app.use("/api/v1/restaurants", restaurants)

app.use("*", (req,res)=> res.status(404).json({error:"Not found"})) //* is a wildcard

export default app;