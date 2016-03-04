'use strict';
console.log("Server start: " + new Date().toString());
const API_PORT = 8080;	//	eighty-eighty
const HTTP_PORT = 8000;	//	eight-thousand

var request = require('request');
var md5 = require("md5");
// var chalk=require('chalk');
var http = require('http');
const spawn = require('child_process').spawn;
var moment=require('moment');

startHTTPServer();

var server = http.createServer(function(req,res) {
	if(req.url==="/favicon.ico") return;
	console.log('req.url: ',req.url);
	console.log('req.method: ', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

	var urlParts = req.url.match(/[^/]+/g);
	var switcher = urlParts.shift();
	
	var result = '';
	switch(switcher) {
		case "math":
			var mathswitcher=urlParts.shift();
			switch(mathswitcher) {
				case "square":
					result = urlParts.map(e=>e*e);
					result = {type:"square",input:urlParts,result:result};
				break;

				case "sum":
				case "add":
					result = urlParts.reduce((p,c)=>p+parseInt(c),0);
					result = {type:"sum",input:urlParts,result:[result]};

				break;

				case "mult":
					result = urlParts.reduce((p,c)=>p*parseInt(c),1);
					result = {type:"mult",input:urlParts,result:[result]};
				break;

				case "pow":
					result = (urlParts[1]!==undefined) ? Math.pow(parseInt(urlParts[0]),parseInt(urlParts[1])) : NaN;
					result = {type:"pow",input:urlParts,result:[result]};
				break;

				case "diff":
				case "sub":
					result = (urlParts[1]!==undefined) ? parseInt(urlParts[0])-parseInt(urlParts[1]) : NaN;
					result = {type:"sub",input:urlParts,result:[result]};
				break;

				case "div":
					result = (urlParts[1]!==undefined) ? parseInt(urlParts[0])/parseInt(urlParts[1]) : NaN;
					result = {type:"div",input:urlParts,result:[result]};
				break;

				case "neg":
					result=urlParts.map(e=>-e);
					result={type:"neg",input:urlParts,result:result};
				break;

				case "min":
					console.warn("if this causes errors, run node w/ following V8 options: \n--harmony_spreadcalls \n--harmony_concat_spreadable \n--harmony_spread_arrays\nMight not need ALL of these, but I'm thinking at least #1 & #3");
					result = Math.min(...urlParts);	
					result = {type:"min",input:urlParts,result:[result]};
				break;

				case "max":
					console.warn("if this causes errors, run node w/ following V8 options: \n--harmony_spreadcalls \n--harmony_concat_spreadable \n--harmony_spread_arrays\nMight not need ALL of these, but I'm thinking at least #1 & #3");
					result = Math.max(...urlParts);	
					result = {type:"max",input:urlParts,result:[result]};
				break;

				case "fact":
					result = urlParts.map(function(e){
						var res=1;
						if(e<1)	return NaN;				//	bc factorial is undefined for integers < 1
						for(var i=2; i<=e;i++) {	//	[2,e] : a *teeeeeny* *tiiiiny* optimization XD
							res=res*i;
						}
						return res;
					});
					result = {type:"fact",input:urlParts,result:result};
				break;

				default:
					result = {type:"math/none",input:urlParts,result:"No math operation specified"};
				break;
		}
		break;


		case "gravatar":
			var hashes = urlParts.map(e=>md5(decodeURI(e)));
			
			var urls=hashes.map(e=>[`http://www.gravatar.com/avatar/${e}?s=50`,
											`http://www.gravatar.com/avatar/${e}?s=100`,
											`http://www.gravatar.com/avatar/${e}?s=200`,
											`http://www.gravatar.com/avatar/${e}?s=300`]);
			result={type:"gravatar",input:urlParts,md5:hashes,url:urls};
		break;

		case "birthday":
			var month=urlParts[0];
			var day=urlParts[1];
			var year=urlParts[2];

			var birthday=moment(`${month}-${day}-${year}`,"MM-DD-YYYY");
			var now=moment();
			var formatted=birthday.format("dddd, MMMM D, YYYY");
			var years=now.diff(birthday, 'years');
			result={type:"birthday",input:urlParts,result:{age:years,date:formatted}};
		break;

		case "sentence":
			var stats = [];
			var words = urlParts.join(' ');
			urlParts.forEach(function(w) {
				var words = decodeURI(w).split(' ');
				var lettercount = words.reduce(function(p,c) {
					return p+(c.match(/\w/g) || []).length;
				},0);
				var wordcount = words.length;
				var avgwordlength = lettercount/wordcount;
				stats.push({num_letters:lettercount,num_words:wordcount,avg_word_length:avgwordlength});
				console.log(words);
			});
			result = {type:"sentence",input:urlParts.map(e=>decodeURI(e)),result:stats};
		break;
		
		default:
			result = {type:"none",input:urlParts,result:"No operation specified"};
		break;
		
	}

	res.write(JSON.stringify(result)+"\n");
	console.log("result: ",result);
	res.end();
});

server.listen(API_PORT);
console.log(`API Server listening on port ${API_PORT}...`);

function startHTTPServer() {
	var port = HTTP_PORT;
	const ls = spawn('python', ['-m', 'SimpleHTTPServer',port]);

	ls.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	ls.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	ls.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});
}7