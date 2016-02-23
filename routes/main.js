var express = require('express');
var router = express.Router();
var db = require('../db.js');
var qr = require('qrcode-js');
var moment = require('moment');
var shortid = require('shortid');

router.get('/', function(req, res, next) {
  
  //generate timestamp
  var ts = +moment();
  var ts_readable = moment().format('MMMM Do YYYY, h:mm:ss a');
  var uid = shortid.generate();
  var base64 = qr.toDataURL( uid , 4);

db.insertQR( ts , uid , base64 , res , function(ts , uid , base64){

  res.render('index', {qr : base64 , title : 'QR-APP' , ts : ts , readable : ts_readable});

});

});


router.post('/newQR' ,function(req , res){


//generate timestamp
  var ts = +moment();
  var ts_readable = moment().format('MMMM Do YYYY, h:mm:ss a');
  var uid = shortid.generate();
  var base64 = qr.toDataURL( uid , 4);

db.insertQR( ts , uid , base64, res ,function(ts , uid , base64){

  
  var sender = {
  	unix : ts,
  	qr : base64
  };

  res.send(sender);

});
  

});


router.post('/addUser' , function(req ,res){
	var name = req.query.name;
	var uid = shortid.generate();
	var qrCode = req.query.qrid;

	if( typeof name == 'undefined' ){
		res.send('Missing Param : NAME');
		return false;
	}

	if( typeof uid == 'undefined' ){
		res.send('Missing Param : UID');
		return false;
	}

	if( typeof qrCode == 'undefined' ){
		res.send('Missing Param : QRCODE');
		return false;
	}


	db.addUser(name, uid , qrCode, res,  function(name , uid , qrCode){

		//user inserted, send the data
		var sender = {
			name : name,
			token : uid
		};

		res.send(sender);


	});
});


router.post('/attendUser', function(req, res){
	var token = req.query.token;

	if( typeof token == 'undefined' ){
		res.send('Missing Param : TOKEN');
		return false;
	}

	db.attendUser(token , res, function(){

		res.send('Updated');

	});


});

module.exports = router;
