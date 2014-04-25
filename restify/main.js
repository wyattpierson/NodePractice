//Require modules
var restify = require('restify');
var mongojs = require("mongojs");

//Define network settings
var ip = '127.0.0.1';
var port = '8080';

//initalize server object
var server = restify.createServer({
	name : "myAPI"
});

//plugins to use
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//setup listener callback
server.listen(port, ip, function(){
	console.log('%s listening at %s ', server.name, server.url);
});

//connect to mongo
var db_addr = '127.0.0.1:27017/myAPI';
var db = mongojs(db_addr, ['myAPI']);
var jobs = db.collection("jobs");

//set up routes
var jobPath = '/jobs'
server.get({path : jobPath, version : '0.0.1'}, getAllJobs);
server.get({path : jobPath + '/:jobId', version : '0.0.1'}, getJob);
server.post({path : jobPath, version : '0.0.1'}, createJob);
server.del({path : jobPath + '/:jobId', version : '0.0.1'}, deleteJob);

/***************  CRUD functions  ***************/

//GET functions
function getAllJobs(req, res, next){
	res.setHeader('Access-Control-Allow-Origin','*');
	jobs.find().limit(20).sort({postedOn : -1 }, function(err, success){
		if(success){
			res.send(200, success);
			return next();
		}
		else{
			return next(err);
		}
	});
}

function getJob(req, res, next){
	res.setHeader('Access-Control-Allow-Origin','*');
	jobs.findOne({_id:mongojs.ObjectId(req.params.jobId)}, function(err, success){
		if(success){
			res.send(200, success);
			return next();
		}
		else{
			return next(err);
		}
	});
}

//POST functions
function createJob(req, res, next){
	var job = {};
	job.title = req.params.title;
	job.description = req.params.description;
	job.location = req.params.location;
	job.postedOn = new Date();

	res.setHeader('Access-Control-Allow-Origin','*');

	jobs.save(job, function(err, success){
		if(success){
			res.send(201, job);
			return next();
		}
		else{
			return next(err);
		}
	});
}

function deleteJob(req, res, next){
	res.setHeader('Access-Control-Allow-Origin','*');
	jobs.remove({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
		if(success){
			res.send(204);
			return next();
		}
		else{
			return next(err);
		}
	});
}
