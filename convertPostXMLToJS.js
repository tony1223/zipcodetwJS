var fs = require("fs");
var parseString = require('xml2js').parseString;


fs.readFile("Zip32_10307.xml",function(err,file){
	parseString(file, function (err, result) {
		/*
		{"NewDataSet":{"Zip32":[{"Zip5":["10058"],"City":["臺北市"],"Area":["中正區"],"R
oad":["八德路１段"],"Scope":["全"]},{"Zip5":["10079"],"City":["臺北市"],"Area":[
"中正區"],"Road":["三元街"],"Scope":["單全"]},{"Zip5":["10070"],"City":["臺北市"
],"Area":["中正區"],"Road":["三元街"],"Scope":["雙  48號以下"]},{"Zip5":["10079"
],"City":["臺北市"],"Area":["中正區"],"Road":["三元街"],"Scope":["雙  50號以上"]
}]}}	*/

		var zips = {};
		var citys = {/* zips:[],areas:[],roads:[]*/};
		var areas = {/* zips:[],roads:[],scopes:[] */};
		var roads = {/* zips:[],scopes:[] */}
		result.NewDataSet.Zip32.forEach(function(zip32){

			var zipcode = {
				code:zip32.Zip5[0],
				city:zip32.City[0],
				area:zip32.Area[0],
				road:zip32.Road[0],
				scope:zip32.Scope[0]
			};

			zips[zipcode.code] = zips[zipcode.code] || [];
			zips[zipcode.code].push(zipcode);

			citys[zipcode.city] = citys[zipcode.city] || {};
			//citys[zipcode.city].zips = citys[zipcode.city].zips || [];
			//citys[zipcode.city].zips.push(zipcode);


			citys[zipcode.city].areas = citys[zipcode.city].areas || {};
			citys[zipcode.city].areas[zipcode.area] = citys[zipcode.city].areas[zipcode.area]  || [];
			citys[zipcode.city].areas[zipcode.area].push(zipcode);

			citys[zipcode.city].roads = citys[zipcode.city].roads || {};
			citys[zipcode.city].roads[zipcode.road] = citys[zipcode.city].roads[zipcode.road]  || [];
			citys[zipcode.city].roads[zipcode.road].push(zipcode);

		});

	    fs.writeFile("zip_out.json",JSON.stringify(citys));
	});
});

