//server.js
var server=require('http');


var startServer=function(req,res){
	res.writeHead(200,{'Content-Text':'text/plain'});
	res.end('Hello World');
}
server.createServer(startServer).listen(3000);
console.log('server running..');