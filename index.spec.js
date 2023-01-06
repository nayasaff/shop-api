const data  =  require("./masterlist.json")
const myMock = jest.fn();
jest.mock('axios');
const request = require('supertest');


describe("Shop api testing", ()=>{
	test('testing lengh of master list element', async()=>{
	
		// it('tests /destinations endpoints', async() => {
        	const response = await request("http://localhost:3300").get("/api/masterlist");
        	
        	expect(response.body).toHaveLength(64);

            for(var i =0; i < 64; i++){
                expect(response.body[i].matchNumber).toEqual(data[i].matchNumber);
                expect(response.body[i].roundNumber).toEqual(data[i].roundNumber);
                expect(response.body[i].dateUtc).toEqual(data[i].dateUtc);
                expect(response.body[i].location).toEqual(data[i].location);
                expect(response.body[i].availability).toEqual(data[i].availability);
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
        expect(response.body.availability).toEqual(data[2].availability);
        expect(response.body.homeTeam).toEqual(data[2].homeTeam);
        expect(response.body.awayTeam).toEqual(data[2].awayTeam);
        expect(response.body.group).toEqual(data[2].group);
		
	})

	// test("testing one element of master list", async()=>{
	// 	// const response = await request("http://localhost:3300").get("/api/masterlist/33");
		
    //     const num = 34; const count = 2; const category = 1;
	// 	const response2 = await request("http://localhost:3300").patch(`/api/masterlist/{"matchNumber": 33 ,"count": 2 ,"category": 1}`);
	// 	expect(response2.body).toEqual(33)
	// 	expect(response2.body.availability.category).toEqual(2)
	// 	expect(response.body.availability.category.count).toEqual(response2.body.availability.category.count +2)
	// 	//fadel category 1 w 3 w el pending ticket w quantity 1
		
	// })
	
	

})