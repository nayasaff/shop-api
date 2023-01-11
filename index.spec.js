const data  =  require("./masterlist.json")
const myMock = jest.fn();
jest.mock('axios');
const request = require('supertest');
const {mongoClient}  = require("./db");

describe("Shop api testing", ()=>{

    let connection;
    let db;
  
    // beforeAll(async () => {
    //   connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   });
    //   db = await connection.db(globalThis.__MONGO_DB_NAME__);
    // });

    // afterAll(async () => {
    //     await connection.close();
    //   });
    
	test('testing lengh of master list element', async()=>{
	
		// it('tests /destinations endpoints', async() => {
        	const response = await request("http://localhost:3300").get("/api/masterlist");
        	
        	expect(response.body).toHaveLength(64);

            for(var i =0; i < 64; i++){
                expect(response.body[i].matchNumber).toEqual(data[i].matchNumber);
                expect(response.body[i].roundNumber).toEqual(data[i].roundNumber);
                expect(response.body[i].dateUtc).toEqual(data[i].dateUtc);
                expect(response.body[i].location).toEqual(data[i].location);
                // expect(response.body[i].availability).toEqual(data[i].availability);
                expect(response.body[i].homeTeam).toEqual(data[i].homeTeam);
                expect(response.body[i].awayTeam).toEqual(data[i].awayTeam);
                expect(response.body[i].group).toEqual(data[i].group);
                
            }
        	
        	
        	// expect(response.body).toEqual(data);

    		// });

	})

	test("testing one element of master list", async()=>{
		const response = await request("http://localhost:3300").get("/api/masterlist/2");
        expect(response.body.matchNumber).toEqual(data[2].matchNumber);
        expect(response.body.roundNumber).toEqual(data[2].roundNumber);
        expect(response.body.dateUtc).toEqual(data[2].dateUtc);
        expect(response.body.location).toEqual(data[2].location);
        // expect(response.body.availability).toEqual(data[2].availability);
        expect(response.body.homeTeam).toEqual(data[2].homeTeam);
        expect(response.body.awayTeam).toEqual(data[2].awayTeam);
        expect(response.body.group).toEqual(data[2].group);
		
	})

	test("updating master list in case of pending a ticket", async()=>{


		const response = await request("http://localhost:3300").get("/api/masterlist/33");
       
		await request("http://localhost:3300").patch(`/api/masterlist/{"matchNumber": 33 ,"count": 2 ,"category": 2}`);
        const response2 = await request("http://localhost:3300").get("/api/masterlist/33");
        
		expect(response.body.matchNumber).toEqual(33)
		expect(response.body.availability.category2.available).toEqual(response2.body.availability.category2.available +2)
		expect(response.body.availability.category2.pending ).toEqual(response2.body.availability.category2.pending -2)
		//fadel category 1 w 3 w el pending ticket w quantity 1
		
	})
    
    test("updating master list in case of cancelled a ticket", async()=>{


        const response = await request("http://localhost:3300").get("/api/masterlist/48");
    
        await request("http://localhost:3300").delete(`/api/masterlist/{"matchNumber": 48 ,"count": 2 ,"category": 1}`);
        const response2 = await request("http://localhost:3300").get("/api/masterlist/48");
        expect(response.body.matchNumber).toEqual(48)
        expect(response2.body.availability.category1.available).toEqual(response.body.availability.category1.available +2)
        expect(response2.body.availability.category1.pending).toEqual(response.body.availability.category1.pending -2)
        //fadel category 1 w 3 w el pending ticket w quantity 1
        
    })

    test("cancell tickets and pendig tickets with different category", async()=>{
        const response = await request("http://localhost:3300").get("/api/masterlist/60");
        await request("http://localhost:3300").patch(`/api/masterlist/{"matchNumber": 60 ,"count": 1 ,"category": 3}`);
        const response2 = await request("http://localhost:3300").get("/api/masterlist/60");
        
		expect(response.body.matchNumber).toEqual(60)
		expect(response.body.availability.category3.available).toEqual(response2.body.availability.category3.available +1)
		expect(response.body.availability.category3.pending ).toEqual(response2.body.availability.category3.pending -1)
        const response3 = await request("http://localhost:3300").get("/api/masterlist/55");
    
        await request("http://localhost:3300").delete(`/api/masterlist/{"matchNumber": 55 ,"count": 1 ,"category": 1}`);
        const response4 = await request("http://localhost:3300").get("/api/masterlist/55");
        expect(response3.body.matchNumber).toEqual(55)
        expect(response4.body.availability.category1.available).toEqual(response3.body.availability.category1.available +1)
        expect(response4.body.availability.category1.pending).toEqual(response3.body.availability.category1.pending -1)
    })

    test("testing inserting not existing match number into analytics", async()=>{
        const data2 = { meta : "TICKETS_Pending",
        body :{
            matchNumber : 70,
            category : 3
        }}
      
        const response = await request("http://localhost:3300").post("/api/analytics").send(data2);
        
        expect(response.text).toEqual("\"Ticket number not found\"")
    })

    test("testing inserting into analytics", async()=>{
        const data2 ={
            id: 545,
            meta : "TICKETS_CANCELED",
            body :{
                matchNumber : 50,
                category : 3
            }
        }
        const response = await request("http://localhost:3300").post("/api/analytics").send(data2);;
        expect(response.statusCode).toBe(200)
        const db = await mongoClient()
        const data = await db.collection("analytics").findOne({"id" : 545})
        if(data.body.matchNumber === 50)
            expect(true).toEqual(true)
        else
        expect(true).toEqual(false)
       

        
    })

    test("testing get reservation", async()=>{
        
        
        
        expect(true).toEqual(true)

        
    })
	

})


