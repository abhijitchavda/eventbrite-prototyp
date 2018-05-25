var express = require('express');
var router = express.Router();
var Request=require('request');
var secret=require('../bin/credentials.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/categories',function(req,res,next){

	Request.get(secret.getcategories+secret.token, function (error, response, body) {
 	            if (error) {
                throw error;
            }
            if(response.statusCode==200){
 			var catChunks=[];
 			var category;
            data = JSON.parse(body);
            category=data.categories;
            var chunkSize=1;
            for(var i=0;i< category.length;i +=chunkSize){
            	catChunks.push(category.slice(i,i+chunkSize));
            }
            res.render('categories',{list:catChunks});
            //res.render('categories', { title: 'ninja product catalog',products: productChunks});
        }
        else
        {
        	res.json({'status':'ERROR','msg':'API server error.Try again'}).status(500);
        }
});
});

router.get('/searchevents/:categories/:location',function(req,res,next){
	var location=req.params.location;
	var categories=req.params.categories;
	var curPage;
	var sameURL="/searchevents/"+categories+"/"+location+"/";
	if(req.query.page){
		curPage=parseInt(req.query.page)+1;
	}
	else{
		curPage=1;
	}
	var url;
	if(location!="blank"){
		url=secret.getevents+secret.token+"&categories="+categories+"&location.address="+location+"&page="+curPage;
	}
	else {
		url=secret.getevents+secret.token+"&categories="+categories+"&page="+curPage;
	}
	Request.get(encodeURI(url),function(error,response,body){
		data=JSON.parse(body);
		if(response.statusCode==200){
		var pages=parseInt(data.pagination.page_count);
		var events=data.events;
		eventChunks=[];
            var chunkSize=3;
            for(var i=0;i< events.length;i +=chunkSize){
            	eventChunks.push(events.slice(i,i+chunkSize));
            }
            if(eventChunks.length==0){
            	res.render('empty',{msg:"NO EVENTS FOUND"});
            }
            else{
        	res.render('events',{events:eventChunks,pagesize:pages,url:sameURL,pagetype:"List Of Events",page:curPage});
			}
		}
		else
		{
			res.render('empty',{msg:"SERVER ERROR:TRY WITH OTHER CITY"});
		}
	});
});

router.get('/bookmarks',function(req,res,next){
	var curPage;
	var sameURL="/bookmarks/";
	if(req.query.page){
		curPage=parseInt(req.query.page)+1;
	}
	else{
		curPage=1;
	}
	var url=secret.getbookmarks+secret.token+"&page="+curPage;
	Request.get(encodeURI(url),function(error,response,body){
		data=JSON.parse(body);
		if(response.statusCode==200){
		var pages=parseInt(data.pagination.page_count);
		var events=data.events;
		eventChunks=[];
            var chunkSize=3;
            for(var i=0;i< events.length;i +=chunkSize){
            	eventChunks.push(events.slice(i,i+chunkSize));
            }
            if(eventChunks.length==0){
            	res.render('empty',{msg:"No bookmarks Present"});
            }
            else{
        	res.render('events',{events:eventChunks,pagesize:pages,url:sameURL,pagetype:"List of Bookmarks",page:curPage});
			}
		}
		else
		{
			res.render('empty',{msg:"SERVER ERROR:Unable to fetch the apis content"});
		}
	});
});

module.exports = router;
