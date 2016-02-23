var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'asusp5glmx',
  database : 'qrcode'
});


module.exports.insertQR = function( ts, uid, base64, res, callback ){


 
connection.connect();
 
connection.query('INSERT INTO `qrcodes` (`uid` ,`image` , `timestamp` )  VALUES("'+uid+'" , "'+base64+'" , "'+ts+'"  ) ', function(err) {
  if (err){
  	res.send('An error occured, please retry');
  	return false;
  }else{
  	
callback( ts , uid , base64 );

  }
});
 
connection.end();



};


module.exports.addUser = function( name, uid , qrCode, res, callback ){


 
connection.connect();
 
connection.query('INSERT INTO `users` (`name` ,`uid` , `qrCode` )  VALUES("'+name+'" , "'+uid+'" , "'+qrCode+'"  ) ', function(err) {
  if (err){
  	res.send('An error occured, please retry');
  	return false;
  }else{

callback( name , uid , qrCode );
  	
  }
});
 
connection.end();



};



module.exports.attendUser = function( token, callback ){


 
connection.connect();
 
connection.query('SELECT * FROM `users` WHERE `uid` = "'+token+'"', function(err , rows) {
  if (err){
  	res.send('An error occured, please retry');
  	return false;
  }else{



  if(rows.length > 0){

  	var hit = parseInt( rows[0].hits );
  	var hit = hit+1;
  	var hit = hit.toString();
  	var id = rows[0].id;
  	//push the hits back to the db

  	connection.query('UPDATE `users` SET `hits` = '+ hit + ' WHERE `id` = '+id, function(err) {

  		if(err){
  			res.send('An error occured');
  		}else{
  		callback();		
  		}

  	});

  	
  }else{
  	res.send('No results found');
  }

	}

});
 


connection.end();


};



