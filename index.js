const express = require("express");
const app = express();
const cors=require("cors");
const {mongoClient}  = require("./db");
const list  =  require("./masterlist.json")


const port = process.env.PORT || 5000;


mongoClient();


var corsOptions = {
  origin: 'http://localhost:3300',
  credentials : true
 }

app.use(cors(corsOptions));

app.use(function (req, res, next) {	
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3300');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');   
    res.setHeader('Access-Control-Allow-Credentials', true);    
    next();
});
app.use(express.json());

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




app.get('/api/reservation', async(req,res)=>{
 

  try{
    // database and collection code goes here
    const db = await mongoClient();
    const data = await db.collection("reservation").find({}).toArray() ;
   
    res.status(200).json(data)
    
}
catch(e){
  console.log(e)
}

})


//updating master list in case of pending a ticket

//use da http://localhost:4000/api/masterlist/{"matchNumber": 1, "count": 2, "category": 1}
app.patch('/api/masterlist/:object', async(req, res)=>{
  
  const db = await mongoClient();

   const object2 = JSON.parse(req.params.object);
   
   const matchNo = object2.matchNumber;
   const count = object2.count
   const category = object2.category;
  
  let data = {}
  if(category === 1){
    data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category1.available": -count}, $inc :{"availability.category1.pending" :count } }) 
  }
  else if(category ===2){
    data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
     {$inc : { "availability.category2.available"  : -count, 
    "availability.category2.pending" : count}  })     
  }
  else{
    data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category3.available"  : -count, "availability.category3.pending" :count }}) 
    
  }

  res.json(data)

})

//in case of cancelled payment increasing number of tickets
app.delete('/api/masterlist/:object', async(req, res)=>{
  
  const db = await mongoClient();
   const object2 = JSON.parse(req.params.object);
   const matchNo = object2.matchNumber;
   const count = object2.count
   const category = object2.category;
  console.log(matchNo + " " + count)
  //mongodb
  if(category === 1){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category1.available"  : count ,"availability.category1.pending" :-count} }) 
  }
  else if(category ===2){
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category2.available"  : count , "availability.category2.pending" :-count}})     
  }
  else{
    const data = await db.collection("master_list").updateOne({"matchNumber" : matchNo}, 
    {$inc : { "availability.category3.available"  : count, "availability.category3.pending" : -count} }) 
  }
  //masterlist
  let item = 0;
  for(let i =0; i < list.length; i++){
    if(list.matchNumber === matchNo)
      item = i;
  }
  list[item].availability[`category${category}`].available += count
  list[item].availability[`category${category}`].pending -= count

  res.json("Changes done")

})

app.post("/api/reservation", async(req,res)=>{
  const db = await mongoClient();
  const reservation = req.body
  const data = db.collection("reservation").insertOne(reservation)
  if(data)
    res.json(data)
  else
    res.json("Failed to insert data")                                                   

})

app.post('/api/analytics', async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const db= await mongoClient();
  const object2 = req.body
  if(object2.body.matchNumber > 64){
    res.json("Ticket number not found")
  }
  else{
    const data= db.collection("analytics").insertOne(object2)
    if(data)
      res.json("changes done")
    else
      res.json("Could not insert in analytics")
  }
 
  })

app.get("/delete", async(req,res)=>{
  const db = await mongoClient()
  const data = req.body 
  await db.collection("analytics").insertMany(req.body)
  res.json("done")
})

app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});

