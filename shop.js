const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config()
const { mongoClient } = require("./conn");
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;


mongoClient();


app.get('/api/masterlist', async(req, res) => {
    
      try{
          // database and collection code goes here
          const db = await mongoClient();
          const data = await db.collection("master_list").find({}).toArray() ;
         
          res.status(200).json(data)
          
      }
      catch(e){
        console.log(e)
      }
  }
);

app.get('/api/masterlist/:id', async(req,res)=>{
  try{
    const db = await mongoClient();
    const id = req.params.id;
    
    const data = await db.collection("master_list").findOne({"MatchNumber" : parseInt(id)});
    
    if(!data)
      res.json("Match does not exist")
    else  
      res.status(200).json(data);
  }
  catch(e){
    console.log(e);
  }

})

app.patch('/api/masterlist/:id', async(req,res)=>{

  const db = await mongoClient();
  const id = req.params.id;
  
  //const data = await db.collection("master_list").updateOne() ;

  res.json(data)

})

app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});

