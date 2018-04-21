var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";


(function() {
  var fs, http, qs, server, url, idnum;

  http = require('http');

  url = require('url');

  qs = require('querystring');

  fs = require('fs');
	
	finalcount = 0;
	
	idnum = 0;
	
	var userStatus, userLoginName;

  server = http.createServer(function(req, res) {
    var action, form, formData, msg, publicPath, urlData, stringMsg, psw;
    urlData = url.parse(req.url, true);
    action = urlData.pathname;
    publicPath = __dirname + "\\public\\";
   //console.log(req.url);
    if (action === "/Signup") {
       console.log("-----[SignUp] SignUp Mothed is running-----");
			 console.log(req.method);
      if (req.method === "POST") {
        console.log("[SignUp] action = post");
        formData = '';
        msg = '';
				psw = '';
        return req.on('data', function(data) {
          formData += data;
          
          console.log("form data=  " + formData);
          return req.on('end', function() {
            var user;
						idnum = idnum+1;
            user = qs.parse(formData);
            user.id = idnum;
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("[SignUp] msg = "+msg);
            console.log("[SignUp] formData = "+formData);

						/*res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": msg.length
            });*/
            
					MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
	          var vailableSignUp = 0;
						
						  console.log("-----[SignUp] verifty account-----")
							console.log("[SignUp] 1vail num : " + vailableSignUp);
						dbo.collection("customers").find({"Username" : myobj.Username}).count(function (error, count){
							if(err)throw err;		
							console.log("[SignUp] username : " + count);
							if (count >= 1){
							  console.log("[SignUp] Existed username : " + myobj.Username);
                console.log("-----[SignUp] End of verifty username-----");
                console.log("-----[SignUp] End of Method-----");
								db.close();
								return res.end("Existed username!");
							}else{vailableSignUp++;
									 console.log("[SignUp] 1va : " + vailableSignUp);
									 }
						});
						
							//console.log("2vail num : " + vailableSignUp);
						dbo.collection("customers").find({"EmailorPhone" :myobj.EmailorPhone}).count(function (error, count){
							if(err)throw err;
							console.log("[SignUp] From user : " + myobj.EmailorPhone);
							console.log("[SignUp] email or phone : " + count);
							if (count >= 1){
							  console.log("[SignUp] Existed Email or Phone : " + myobj.EmailorPhone);
                console.log("-----[SignUp] End of verifty email and phone number-----");
                console.log("-----[SignUp] End of Method-----");
								db.close();
								return res.end("Existed Email OR Phone number!");
							}else{
								vailableSignUp++;
								//console.log("2va : " + vailableSignUp);
								/******/
								dbo.collection("customers").insertOne(myobj, function(err, res) {
    				     if (err) throw err;
    			       	console.log("[SignUp] 1 document inserted to customers");
                  console.log("-----[SignUp] End of Method-----");
					      	vailableSignUp = 0;
    				      db.close();
  				      	});
								  return res.end("Sign up successfully!");
								/******/
							  }
							db.close();
						});
					
					});
						return res.end;
          });
        });
      } else {
        
				sendFileContent(res, "calldatabase.html", "text/html");
      }
    }else if (action === "/Search") {
       console.log("search");
      if (req.method === "POST") {
        console.log("action = post");
        formData = '';
        msg = '';
        return req.on('data', function(data) {
          formData += data;
          
          console.log("form data="+ formData);
          return req.on('end', function() {
            var user;
            user = qs.parse(formData);
            //user.id = "123456";
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("mess="+msg);
            console.log("mess="+formData);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": msg.length
            });
						MongoClient.connect(dbUrl, function(err, db) {
  					if (err) throw err;
  					var dbo = db.db("mydb");
  					var myobj = stringMsg;
  					

							dbo.collection("customers").find({"Username" : ""}).count(function (error, count) {
  						console.log(error, count);
								db.close();
							});
							
								console.log(count);
						
					});
						
            return res.end("1");
          });
        });
				
      } else {
        //form = publicPath + "ajaxSignupForm.html";
        form = "searchdb.html";
        return fs.readFile(form, function(err, contents) {
          if (err !== true) {
            res.writeHead(200, {
              "Content-Type": "text/html"
            });
            return res.end(contents);
          } else {
            res.writeHead(500);
            return res.end;
          }
        });
      }
    } else if( action=="/newpage"){
       res.writeHead(200, {
        "Content-Type": "text/html"
      });
      return res.end("<h1>歡迎光臨Node.js菜鳥筆記2</h1><p><a href=\"/Signup\">註冊</a></p>");
    } else if (action == "/Clear"){
			console.log("[Customers] Clear all data");
			
			MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				dbo.collection("customers").drop(function(err, delOk){
					if (delOk) console.log("Collection deleted");
					db.close();
				});
				return res.end;
			});
			
		} else if( action =="/SearchAll"){
			console.log("Search all");
			
			MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				 dbo.collection("customers").find().toArray(function(err, result) {
								if (err) throw err;
             console.log(result);
				  db.close();	 
		    });
				db.close();
				return res.end;
			});
		} else if( action == "/Login"){
			console.log("-----[Login] Method is running-----");
			if (req.method == "POST"){
			console.log("[Login] POST");
				formData = '';
        msg = '';
				psw = '';
				
				return req.on('data', function(data){
					formData += data;
				  console.log("[Login]  form data=  " + formData);
					//console.log(req.url);
					return req.on('end', function(){
						var user;
						user = qs.parse(formData);
            msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						console.log("[Login]  msg = " + msg);
						console.log("[Login]  username = " + stringMsg.Username);
						console.log("[Login]  password = " + stringMsg.Password);
						
						
						
						MongoClient.connect(dbUrl, function(err,db){
							if (err) throw err;
				      var dbo = db.db("mydb");
							var countUser;
							var resMsg, _stringObj, res_msg;
							
							dbo.collection("customers").find({"Username" :stringMsg.Username }).count (function (error, count) {
  						if (err) throw err;
							//console.log(count);
								
							if (count === 0){
								//username is not exist	
								 resMsg = { "Msg": "Username is not exist!"};
								 _stringObj = JSON.stringify(resMsg);	
                console.log("[Login] Username is not existed!");
                console.log("-----[Login] End of the Login method-----");
									db.close();
								return res.end(_stringObj);		
							 }else{
								dbo.collection("customers").findOne({"Username" :stringMsg.Username },function (error, result){
								if (err) throw err;
							  console.log("[Login]  User password : " + result.Password);
							  if(stringMsg.Password != result.Password){
									resMsg = { "Msg": "Incorrect password!"};
								 _stringObj = JSON.stringify(resMsg);
                 console.log("[Login] Password is not correct!");
                console.log("-----[Login] End of the Login method-----");
								db.close();
								return res.end(_stringObj);
								}else{
									resMsg = { "Msg": "Success Login!", "LoginName": result.Username};
								  _stringObj = JSON.stringify(resMsg);
									userLoginName = result.Username;
									userStatus = "logined";
									console.log("[Login]  User: " + result.Username + " Login!");
									console.log("[Login]  Loginstatus: " + userStatus);
									console.log("[Login]  UserLoginNamw: " + userLoginName);
                  console.log("[Login] Successfully Login");
                  console.log("-----[Login] End of the Login method-----");
									db.close();
									return res.end(_stringObj);
								}
							  });

							}
							});	
							return res.end;
						});
						
					});
				});
			}else{
          sendFileContent(res, "login.html", "text/html");
			}	
			console.log("Not POST");
		}else if(action =="/checkLoginStatus"){
               console.log("-----[checkLoginStatus] chechLoginStatues is running-----");
			         console.log("[checkLoginStatus] userState : " + userStatus);
			         if(userStatus ==="logined"){
								 
								 console.log("[checkLoginStatus] User has been logined : " + userLoginName);
                 console.log("-----[checkLoginStatus] End of chechLoginStatues-----");
								 return res.end(userLoginName);
							 }
               console.log("-----[checkLoginStatus] End of chechLoginStatues-----");
							 return res.end();
					 }
			      else if( action == "/Logout"){
				       userLoginName = "";
				       userStatus = "";
               console.log("-----[Logout] Logout method is running-----");
							 console.log("[Logout]  Logout successfully!");
				       console.log("[Logout]  Loginstatus: " + userStatus + " UserLoginNamw: " + userLoginName);
               console.log("-----[Logout] End of Logout-----");
				       return res.end("Logout successfully!")
							
		       	}else if(action == "/FavourList"){
              console.log("-----[FovourList] FavourList method is running-----");
							console.log("[FavourList] " + userStatus + " " + userLoginName);
							if (userStatus === undefined){
								console.log("[FavourList] Logouting!");
							 	var resMsg, _stringObj;
								resMsg = { "Msg": "Please login!"};
								_stringObj = JSON.stringify(resMsg);
                console.log("-----[FavourList] End of FavourList-----");
								return res.end(  "Please login!");
							}else{
								//console.log("----This is favour list method----");
								
								if (req.method === "POST") {
              		 	console.log("[FavourList] action = post");
       						 	formData = '';
       						 	msg = '';
										psw = '';
									 
        						return req.on('data', function(data) {
          					formData += data;
          					console.log("[FavourList] form data =  " + formData);
											
          			    return req.on('end', function() {
											console.log("[FavourList] Logined username : " + userLoginName);
											var favourlist = "";
											favourlist = qs.parse(formData);
											favourlist.Username = userLoginName;
											
            					msg = JSON.stringify(favourlist);
											stringMsg = JSON.parse(msg);
											console.log("[FavourList] msg = "+msg);
           	 					console.log("[FavourList] fromData = "+formData);
								/****/
								
								MongoClient.connect(dbUrl, function(err, db) {
  				     	if (err) throw err;

  					    var dbo = db.db("mydb");	
  					    var myobj = stringMsg;
									
								 dbo.collection("favourlist").insertOne(myobj, function(err, res) {
    				     if (err) throw err;
    			       	console.log("[FavourList] 1 document inserted to favourlist");
									console.log("-----[FavourList]End of the favour list method-----");
    				      db.close();
  				      	});
									return res.end("This article is added!");
								 });	 	
								});
							});
						 }
					  }
	   
	}else if( action == "/ClearFavour"){
					console.log("-----[ClearFavour] ClearFavour is running-----");			
			    MongoClient.connect(dbUrl, function(err,db){
				  if (err) throw err;
				  var dbo = db.db("mydb");
           if(userStatus === undefined){
             console.log("[ClearFavour] No user!");
             console.log("-----[ClearFavour]End of the ClearFavour method-----");
             return res.end("Please Login!");
           }else{
             dbo.collection("favourlist").count (function (error, count){
               if (err) throw err;		
							if (count === 0){
                 console.log("[ClearFavour] FavourList empty!");
                 console.log("-----[ClearFavour]End of the ClearFavour method-----");
                  return res.end("Favour List is empty!");
              }else{
                 dbo.collection("favourlist").drop(function(err, delOk){
					          if (delOk) console.log("[ClearFavour] Collection deleted");
				          	console.log("-----[ClearFavour]End of the ClearFavour method-----");
					          db.close();
                    return res.end("Delete successfully!");
                 });
              }
           	});
          }
				return res.end;
			});					 
  }else if( action == "/SearchFavour"){
		    console.log("-----[SearchFavour] SearchFavour is running-----");
				console.log("[FavourList] Search all data");
		    MongoClient.connect(dbUrl, function(err,db){
				if (err) throw err;
				var dbo = db.db("mydb");
				 dbo.collection("favourlist").find().toArray(function(err, result) {
								if (err) throw err;
             console.log(result);
				  db.close();	 
		    });
					console.log("-----[SearchFavour] End of the SearchFavour method-----");
				db.close();
				return res.end;
			});
	}else if( action == "/checkFavourList"){
		console.log("-----[checkFavourList] checkFavourList method is runnging-----");
		console.log("[FavourList] Resfresh the list");
     MongoClient.connect(dbUrl, function(err,db){
							if (err) throw err;
				      var dbo = db.db("mydb");
							var countUser;
							var resMsg, _stringObj, res_msg;
							
							dbo.collection("favourlist").find({"Username" :userLoginName }).count (function (error, count) {
  						if (err) throw err;		
							if (count === 0){
								//username is not exist	
								 resMsg = {"Msg": "Favour List is empty!"};
								 _stringObj = JSON.stringify(resMsg);		
								console.log("[checkFavourList] List is empty!");
                console.log("-----[checkFavourList] End of checkFavourList method -----");
									db.close();
								return res.end(_stringObj);		
							}else{
								/*dbo.collection("favourlist").findOne({"Username" :userLoginName },function (error, result){
								if (err) throw err;
								console.log("[FavourList] Result : " + result);
							  resMsg = result;
								_stringObj = JSON.stringify(resMsg);		
								db.close();
								return res.end(_stringObj);
								});*/
								var jqy = {Username : userLoginName};
								dbo.collection("favourlist").find(jqy).toArray(function(err, result) {
  						  if (err) throw err;
								 console.log("[checkFavourList] Find result : " + result);
									resMsg = result;
									_stringObj = JSON.stringify(resMsg);	
                  console.log("-----[checkFavourList] End of checkFavourList method -----");
									db.close();
									return res.end(_stringObj);
								});
								}
							});
			    return res.end;
							});	
							

	}else if( action == "/DeleteFavour"){
		console.log("-----[DeleteFavour] DeleteFavour method is running -----");
		console.log("[DeleteFavour] " + userStatus + " : " + userLoginName);
		console.log("[DeleteFavour] This function is to Delete the mark");
		
			if (req.method === "POST") {
        console.log("[DeleteFavour] action = post");
        formData = '';
        msg = '';
				psw = '';
        return req.on('data', function(data) {
          formData += data;
          console.log("[DeleteFavour] formData =  " + formData);
          return req.on('end', function() {
            msg = JSON.stringify(formData);
						stringMsg = JSON.parse(msg);
						console.log("[DeleteFavour] mess = "+ msg);
            console.log("[DeleteFavour] mess = "+ formData);
					
							MongoClient.connect(dbUrl, function(err, db) {
  						if (err) throw err;
  						var dbo = db.db("mydb");
  						var myobj = stringMsg;
		
							if (userStatus === undefined){
								console.log("[DeleteFavour] User is not login!");
                console.log("-----[DeleteFavour] End of the DeleteFavour method-----");
								return res.end("Please login!");
							}else{
								/*dbo.collection("favourlist").find({"Username" :userLoginName }).count (function (error, count) {
  								if (err) throw err;		
									if (count === 0){
										console.log("[DeleteFavour] Empty list!");
                    console.log("-----[DeleteFavour] End of the DeleteFavour method-----");
										db.close();
										return res.end("Favour List is empty!");
									}else{*/
										console.log("[DeleteFavour] Article name from user : " + myobj);
                    
										dbo.collection("favourlist").deleteOne({ArticleName : myobj},{Username : userLoginName}, function (error, result) {
												   
                        if (err) throw err;	
                        
											  console.log("[DeleteFavour] Deleted Articles Name : " + myobj);
											  console.log("[DeleteFavour] Deleted Articles Name2 : " + result);
                        console.log("-----[DeleteFavour] End of the DeleteFavour method-----");
											  db.close();
											  return res.end("Deleted successfully!");
										});
                   /* db.collection('favourlist', function(err, collection) {
                        collection.deleteOne({ArticleName : myobj.ArticleName},{Username : userLoginName});
                    });*/
                    /*db.collection('posts', function(err, collection) {
                     collection.deleteOne({_id: new mongodb.ObjectID('4d512b45cc9374271b00000f')});
                      });*/
									//}
								//});
							 }
								db.close();
								return res.end;
							});
					 });
					});
			}
	}else{
      
	//http.createServer(function(req, res) {
    //console.log("callhtml");
		//sendFileContent(res, "calldatabase.html", "text/html"); 
	if(req.url === "/index"){
		//sendFileContent(response, "callajax.html", "text/html");
		//alert("index");
		sendFileContent(res, "index.html", "text/html");
	}
	else if(req.url === "/"){
		//console.log("Requested URL is url" +req.url);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
	}
	else if(/^\/[a-zA-Z0-9\/]*.html$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/html");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/jpg");
	}
	else if(/^\/[a-zA-Z0-9\/]*.txt$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/txt");
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/png");	
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
	  sendFileContent(res, req.url.toString().substring(1), "image/svg");
  }
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/js");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/svg");
	}else{
		//console.log("Requested URL is: " + req.url);
		res.end();
	}
//		});
		}
		
  });

  server.listen(9001);

  console.log("Server is running，time is" + new Date());


  
  
function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}
}).call(this);





