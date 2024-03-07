const express = require("express");
const app = express();
const db = require("./database/db");


const PORT = 3000;
app.listen(PORT, ()=>{console.log(`Server running on PORT ${PORT}`)});