


function init(cb){

	var fs = require("fs");

	fs.readFile("zip_out.json",function(err,content){
		var json = JSON.parse(content);
		//console.log(Object.keys(json));

		for(var k in json){
			json[k.replace("臺","台")] = json[k];
			for(var area in json[k].areas){
				json[k].areas[area.replace("臺","台")] = json[k].areas[area];
			}

			json["台北縣"] = json["新北市"];
			json["臺北縣"] = json["新北市"];
		}
		cb(json);
	});

}

var debug = false;

function checkCity(db,city,address){
	if(debug){
		console.log("[debug] found city ["+city+"] : "+address);
	}
	for(var area in db[city]["areas"]){
		
		if(address.indexOf(area)!= -1){
			if(debug){ console.log("[debug] found area ["+area+"] : "+address);}
			db[city].areas[area].forEach(function(zip){
				if(address.indexOf(zip.road) != -1){
					return zip.code;
				}
			});
			
			return  db[city].areas[area][0].code
		}

	}

	if(debug){ console.log("[debug] miss area in city ["+city+"] : "+address);}
	
	for(var roads in db[city]["roads"]){
		if(address.indexOf(roads)!= -1){
			if(debug){ console.log("[debug] found road in city ["+city+"] : "+address);}
			return  db[city]["roads"][roads][0].code;
		}
	}

	if(debug){ console.log("[debug] miss road in city ["+city+"] : "+address);}

	for(var roads in db[city]["roads"]){
		if(address.indexOf(roads.replace(/.段/,""))!= -1){
			if(debug){ console.log("[debug] found road in ["+city+"] after remove 段 : "+address);}

			return  db[city]["roads"][roads][0].code;
		}
	}

	if(debug){ console.log("[debug] didn't found road in ["+city+"] ,guess one : "+db[city].areas[Object.keys( db[city].areas)[0]][0].code +":"+address);}

	return db[city].areas[Object.keys( db[city].areas)[0]][0].code;
}

function checkZip(db,address){

	//special case

	address = address.replace(/北市/g,"臺北市");
	var guesszip = null;
	for(var city in db){
		if(debug){
			console.log("[debug] looking city ["+city+"] : "+address);
		}
		if(address.indexOf(city) != -1){
			return checkCity(db,city,address);
		}

		if(debug){
			console.log("[debug] miss city ["+city+"] : "+address);
		}
	}

	if(debug){
		console.log("[debug] miss all city,try find area instead : "+address);
	}


	for(var city in db){
		for(var area in db[city]["areas"]){
			
			if(address.indexOf(area)!= -1){
				if(debug){
					console.log("[debug] found area in ["+city+"] ,back to normal process in the city : "+address);
				}		
				return checkCity(db,city,address);
			}

		}
	}

	if(debug){
		console.log("[debug] miss all areas : "+address);
	}

	if(address.indexOf("新竹工業園區") != -1){
		return 30000;
	}

	return guesszip;

}

function check3Zip(db,address){
	var ret = checkZip(db,address);
	if(ret != null){
		return parseInt(ret/100,10);
	}
}


init(function(db){

	var datas = [
		
	];


	datas.forEach(function(address){
		console.log(address,",",check3Zip(db,address));
		
	})
	
});
