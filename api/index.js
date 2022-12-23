const express = require("express");
const app = express();
const cors=require("cors");
const {mongoClient}  = require("./db");

app.use(express.json());

const port = process.env.PORT || 5000;


mongoClient();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", value="*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","POST,PATCH,GET,DELETE");
  next();
});

app.use(function (req, res, next) {

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(cors({ origin : '*'}));

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
    
    const data = await db.collection("master_list").findOne({"matchNumber" : parseInt(id)});
    
    if(!data)
      res.json("Match does not exist")
    else  
      res.status(200).json(data);
  }
  catch(e){
    console.log(e);
  }

})



app.get('/api/tickets', async(req,res)=>{
  try{
    const db = await mongoClient();
    const id = req.params.id;
    
    const data = await db.collection("tickets").find({}).toArray();
    
    if(!data)
      res.json("No tickets available")
    else  
      res.status(200).json(data);
  }
  catch(e){
    console.log(e);
  }

})


//updating master list in case of pending a ticket
app.patch('/api/masterlist/:object', async(req, res)=>{
  
  const db = await mongoClient();
   const object2 = JSON.parse(req.params.object);
   const matchNo = object2.matchNumber;
   const count = object2.count
   const category = object2.category;
  console.log(matchNo + " " + count)
  
  if(category === 1){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category1.count"  : -count} }) 
  }
  else if(category ===2){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category2.count"  : -count} })     
  }
  else{
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category3.count"  : -count} }) 
  }

  res.json("Changes done")

})

//in case of cancelled payment increasing number of tickets
app.delete('/api/masterlist/:object', async(req, res)=>{
  
  const db = await mongoClient();
   const object2 = JSON.parse(req.params.object);
   const matchNo = object2.matchNumber;
   const count = object2.count
   const category = object2.category;
  console.log(matchNo + " " + count)
  
  if(category === 1){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category1.count"  : count} }) 
  }
  else if(category ===2){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category2.count"  : count} })     
  }
  else{
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category3.count"  : count} }) 
  }

  res.json("Changes done")

})


app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});

