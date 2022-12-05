const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config()
const { mongoClient } = require("./conn");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//app.use(require("./routes/record"));
// get driver connection

mongoClient()

app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});
