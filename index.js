const express = require("express");
const app = express();
const db = require("./database/db");
const bodyParser = require("body-parser")

app.use(bodyParser.json());


const parkingRoute = require("./Routes/parkingRoutes")
app.use("/api/", parkingRoute)

const PORT = 3000;
app.listen(PORT, ()=>{console.log(`Server running on PORT ${PORT}`)});