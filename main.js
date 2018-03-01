const express = require('express')
const app = express()
const https = require("https");

app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/getXirServ', (req, res) => {
	// Node Get ICE STUN and TURN list
	let options = {
      	host: "global.xirsys.net",
      	path: "/_turn/channelX",
    	  method: "PUT",
  	    headers: {
	          "Authorization": "Basic " + new Buffer("krossruiz:f8a873ec-3436-11e7-949d-d5d041878f97").toString("base64")
  	    }
	}
	let httpreq = https.request(options, function(httpres) {
      	let str = ""
      	httpres.on("data", function(data){ str += data })
      	httpres.on("error", function(e){ console.log("error: ",e) })
      	httpres.on("end", function(){ 
    	      console.log("ICE List: ", str, "\n")
						res.send(str)
  	    })
	})
	httpreq.end()
})

app.get('/signaling', (req,res) => {

	const getToken = new Promise((resolve, reject) => {
	
		let options = {
	    	host: "ws.xirsys.com",
	     	path: "/_token/channelX",
	     	method: "PUT",
	     	headers: {
	      	 "Authorization": "Basic " + new Buffer("krossruiz:f8a873ec-3436-11e7-949d-d5d041878f97").toString("base64")
	     	}
		}
	
		let httpreq = https.request(options, function(httpres) {
	
	    	var str = ""
	    	httpres.on("data", function(data){ str += data; })
	    	httpres.on("error", function(e){ console.log("error: ",e); })
	   		httpres.on("end", function(){
					resolve(str)
	  	  })
		})
	
		httpreq.end()
	})
	
	const getHost = new Promise((resolve, reject) => {
	
	// Node GET Signal Host
	
		let options = {
		    host: "ws.xirsys.com",
		     path: "/_host?type=signal&k=user1",
		     method: "GET",
		     headers: {
		       "Authorization": "Basic " + new Buffer("krossruiz:f8a873ec-3436-11e7-949d-d5d041878f97").toString("base64")
		     }
		}
	
		let httpreq = https.request(options, function(httpres) {
	
		    let str = ""
		    httpres.on("data", function(data){ str += data; })
		    httpres.on("error", function(e){ console.log("error: ",e); })
		    httpres.on("end", function(){
					resolve(str)
	  	  })
		})
	
		httpreq.end()
	
	})

		let host;
		let token;

		getHost
			.then((res) => {
				host = JSON.parse(res).v
				getToken.then((res) => {
					token = JSON.parse(res).v
					console.log("HOST\n", host, "\nTOKEN\n", token)
				})
			})
	
		res.send('ran!')
});

app.listen(3000, () => {console.log("Listening on port 3000")})

