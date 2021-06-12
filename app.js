var mysql = require('mysql');
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
const { Pinpoint } = require('aws-sdk');

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "root",
  port     : "3306",
  database : "car2"
});

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/views'));
//app.use('/static', express.static('static'));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/loginuser', function (req, res) {
  var email1=req.param('email', null);
  var password1=req.param('pass', null);
  var email=email1.toString();
  var password=password1.toString();
  console.log(email);
  console.log(password);

  //connection.connect(function (err) {
    //if (err) {
      //console.error('Database connection failed: ' + err.stack);
      //return;
   // }
    //console.log('Connected to CarDB.');

    connection.query('SELECT * from email2', function (error, results, fields) {
      if (error) {
          throw error;
      }
  
      console.log(results);
      
      var length = results.length;
      var test=0;
      for (i = 0; i < length; i++)
        if (results[i].email == email && results[i].password == password)
          test = 1;
  
      if (test == 1){
        console.log("Congratulations Login Success");
        var sql="SELECT * FROM user1 u1,aadhar ad WHERE u1.email = '"+email+"' AND u1.Aadhar_number = ad.Aadhar_number;";
        connection.query(sql, function (error, results, fields) {
          if (error) {
              throw error;
          }
        var userid = results[0].user_id;
        var name = results[0].name;
        
        connection.query('DELETE FROM test', function (error, results, fields) {
          if (error) {
              throw error;
          }
        });
        var sql2="INSERT INTO test VALUES ("+userid+");"
        connection.query(sql2, function (error, results, fields) {
          if (error) {
              throw error;
          }
        });
        console.log(userid);

        res.render("index-user", { username: name});
        res.end();
        });
        //res.sendFile(path.join(__dirname + '/index-user.html'));
      }
      else{
        var out='Incorrect username/password. Please try again.';
        res.render("login", { denied: 1});
        res.end();
      }
    });
  //});


});

app.post('/feedbackuser', function (req, res) {
  var feedback=req.param('textbox',null);
  var rating=req.param('rating',null);

  console.log(feedback,' ',rating);

  connection.query('SELECT * from test', function (error, results, fields) {
    if (error) {
        throw error;
    }
  var userid=results[0].user_id;

  var temp= Math.random().toString(20).substring(2, 4).toLocaleUpperCase();

  var temp2=Math.floor(Math.random() * (9999 - 1 + 1) + 1);

  var temp3=temp+temp2;
  if(feedback != ""){
  var sql="INSERT INTO feedback VALUES ("+userid+",'"+temp3+"','"+feedback+"',"+rating+");";
        connection.query(sql, function (error, results, fields) {
          if (error) {
              throw error;
          }
            res.render("feedback-successful");
            res.end();
        });
      }
  else{
    res.render("Feedback-user", { accepted: 0});
    res.end();
  }
  });

});

app.post('/enquire', function(req,res){
  var carinput=req.param('carName', null).split(':');
  var carType=carinput[0];
  var carName=carinput[1];
  var date=req.param('date', null);
  var fuelType=req.param('fuelType', null);
  var transmission=req.param('transmission', null);
  var colour=req.param('colour', null);
  var enquiryText=req.param('enquiryText', null);
  

    connection.query('SELECT * from test', function (error, results, fields) {
      if (error) {
          throw error;
      }
    var userid=results[0].user_id;

    var temp3=Math.floor((Math.random() * 10000) + 1);

        if(fuelType == "Select" || transmission == "Select" || carinput == "Select"){
          res.render("Enquire-user", { accepted: 0});
          res.end();
        }
        else{
          var sql="INSERT INTO enquiry VALUES('"+userid+"',DATE '"+date+"','"+enquiryText+"','"+temp3+"','"+fuelType+"','"+carName+"','"+colour+"','"+transmission+"','"+carType+"');";
        connection.query(sql, function (error, results, fields) {
          if (error) {
              throw error;
          }
          else{
            res.render("enquiry-successful");
            res.end();
          }
        });
        }
    console.log(carType,carName, date,fuelType,transmission,colour,enquiryText, userid, temp3);

    });

});

app.post('/register1', function(req,res){
  var email=req.param('email',null);
  var pwd=req.param('pass',null);
  var pwd2=req.param('cpass',null);

  if(pwd == pwd2){
    var temp3=Math.floor((Math.random() * 10000) + 1);
    var sql="INSERT INTO email2 values('"+email+"','"+pwd+"', '"+temp3+"');";
    connection.query(sql, function (error, results, fields) {
      if (error) {
        res.render("register", {accepted: 0});
        res.end();
        throw error;
      }
      else{
        res.render("user-details", null);
        res.end();
        var sql="INSERT INTO user1 (user_id,email) values('"+temp3+"','"+email+"');";
        connection.query(sql, function(error, results, fields){
          if (error) {
            throw error;
          }
        });

        connection.query('DELETE FROM test', function (error, results, fields) {
          if (error) {
              throw error;
          }
        });
        var sql2="INSERT INTO test VALUES ("+temp3+");"
        connection.query(sql2, function (error, results, fields) {
          if (error) {
              throw error;
          }
        });
        
      }
    });
  }
  else{
    res.render("register", {accepted: 0});
        res.end();
  }
});

app.post("/register2", function(req,res){
  var name=req.param('name',null);
  var gender=req.param('gender',null);
  var date=req.param('date',null);
  var phone=req.param('phone',null);
  var email=req.param('email',null);
  var adr1=req.param('adr1',null);
  var adr2=req.param('adr2',null);
  var adr3=req.param('adr3',null);
  var pin=req.param('pin',null);
  var city=req.param('city',null);
  var state=req.param('state',null);
  var aadhar=req.param('aadhar',null);
  var license=req.param('license',null);

  connection.query('SELECT * from test', function(error, results, fields){
    if (error) {
      throw error;
    }
    var userid=results[0].user_id;
    console.log(name, gender, date, phone, email,adr1+','+adr2+','+adr3+','+city+','+state+'-'+pin,aadhar,license)
    var sql2="INSERT INTO Aadhar VALUES('"+aadhar+"','"+name+"','"+phone+"','"+adr1+','+adr2+','+adr3+','+city+','+state+'-'+pin+"','"+userid+"','"+gender+"');";
        connection.query(sql2, function (error, results, fields) {
          if (error) {
              throw error;
          }
        });
    var sql3="INSERT INTO license VALUES ('"+license+"',DATE '"+date+"','"+userid+"');"
    connection.query(sql3, function (error, results, fields) {
      if (error) {
          throw error;
      }
    });
    var sql4="UPDATE user1 SET driving_license_no ='"+license+"' WHERE user_id='"+userid+"';";
    connection.query(sql4, function (error, results, fields) {
      if (error) {
          throw error;
      }
    });
    var sql5="UPDATE user1 SET Aadhar_number ='"+aadhar+"' WHERE user_id='"+userid+"';";
    connection.query(sql5, function (error, results, fields) {
      if (error) {
          throw error;
      }
      res.render("login2",{account: 1});
      res.end();
    });
  });
});

app.post('/configure', function(req, res){
  var carsel=req.param('carSel', null);
  var days=req.param('days', null);
  var hours=req.param('hours', null);
  var date=req.param('date', null);
  var fuelType=req.param('fuelType', null);
  var transmission=req.param('transmission', null);
  console.log(carsel, days, hours, date, fuelType, transmission);

  connection.query('SELECT * from test', function(error, results, fields){
    if (error) {
      throw error;
    }
    var userid=results[0].user_id;

    var temp= Math.random().toString(20).substring(2, 4).toLocaleUpperCase();

    var temp2=Math.floor(Math.random() * (9999 - 1 + 1) + 1);

    var temp3=temp+temp2;

    var sql2="SELECT car_id, base_price, hourly_price, rental_status FROM car_detail WHERE model_name LIKE '%"+carsel+"%'";
    connection.query(sql2, function(error, results, fields){
      if (error) {
        throw error;
      }
      var carid=results[0].car_id;
      var hourly_price=results[0].hourly_price;
      var base_price=results[0].base_price;
      var rental_status=results[0].rental_status;
      if(rental_status == 'Available'){
        var sql4="UPDATE car_detail SET rental_status='Rented' WHERE car_id='"+carid+"';";
        connection.query(sql4, function(error, results, fields){
          if (error) {
            throw error;
          }
        });
  
        var sql3="INSERT INTO rent_detail VALUES('"+temp3+"','"+userid+"','"+carid+"', CURRENT_TIMESTAMP(),'"+hours+"','"+days+"',date('"+date+"'));";
        connection.query(sql3, function(error, results, fields){
          if (error) {
            throw error;
          }
        });
  
        var temp4=Math.floor(Math.random() * (9999 - 1 + 1) + 1);
  
        var temp5='PAY'+temp4;
  
        var tot1=parseInt(days)*24;
        var tot2=tot1+parseInt(hours);
  
        var total=parseInt(base_price) + tot2*hourly_price;
        console.log(base_price,hourly_price,days,hours,tot1, tot2, total);
  
        var sql5="INSERT INTO payment_detail VALUES('"+temp5+"','"+temp3+"','Card Payment', 0, "+total+");";
        connection.query(sql5, function(error, results, fields){
          if (error) {
            throw error;
          }
          res.render("payment", {total: total});
          res.end();
        });
      }

      else{
        res.render("car-configure", {available: 0});
        res.end();
      }

    });

  });
});

app.post('/invoice', function(req,res){
  connection.query('SELECT * from test', function (error, results, fields) {
    if (error) {
        throw error;
    }
    var userid=results[0].user_id;
  var sql="select a.name, c.model_name, m.manufacturer, c.category, c.gearbox_type, c.fuel_type, r.rentdate, r.time_of_rent, p.payment_id, p.total_price, u.email, a.address, a.contact from car_detail c, manufacturer m, rent_detail r, payment_detail p, aadhar a, user1 u where c.car_id=r.car_id and r.rent_id=p.rent_id and r.user_id=u.user_id and u.Aadhar_number=a.Aadhar_number and m.model_name=c.model_name and u.user_id='"+userid+"';";
  connection.query(sql, function (error, results, fields) {
    if (error) {
        throw error;
    }
    var transactionid=results[0].payment_id;
    var total=results[0].total_price;
    var name=results[0].name;
    var carname=results[0].model_name;
    var manufacturer=results[0].manufacturer;
    var type=results[0].category;
    var transmission=results[0].gearbox_type;
    var fuel=results[0].fuel_type;
    var resdate=results[0].rentdate;
    var time=results[0].time_of_rent;
    var address=results[0].address;
    var email=results[0].email;
    var str=address.split(',');
    var adr1=str[0]+','+str[1]
    var adr2=str[2];
    for(var i=3;i<str.length;i++){
      adr2=adr2+','+str[i];
    }
    var number=results[0].contact;

    res.render("invoice-page.ejs", {transactionid: transactionid, total: total, carname: carname, name: name, manufacturer: manufacturer, type: type, transmission: transmission, fuel: fuel, resdate: resdate, time: time, email: email, adr1: adr1, adr2: adr2, number: number});
    res.end();
  });
  });
  
});

app.post('/admin-login', function(req,res){
  var userid=req.param('uname', null);
  var password=req.param('password', null);
  console.log(userid);
  console.log(password);

    connection.query('SELECT a.user_id, e.email, e.password, a.name from admin a, email e where a.email=e.email', function (error, results, fields) {
      if (error) {
          throw error;
      }
      console.log(results);
      
      var length = results.length;
      var test=0;
      for (i = 0; i < length; i++){
        if (results[i].user_id == userid && results[i].password == password){
            console.log("Congratulations Login Success");
            test=1;
            var name=results[i].name;
            console.log(userid, name);
            res.render("index-admin", { username: name});
            res.end();
        }
      }
      if(test == 0){
        res.render("Admin", { denied: 1});
        res.end();
      }
    });
});

app.post('/status', function(req, res){
  connection.query('select c.car_id, c.model_name, m.manufacturer ,c.category ,c.rental_status from car_detail c, manufacturer m where c.model_name=m.model_name ', function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.render("status-admin", {userData: results});
  });
});

app.post('/enquiry', function(req, res){
  connection.query('select * from enquiry ', function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.render("Enquire-admin", {userData: results});
  });
});

app.post('/feedback-admin', function(req,res){
  connection.query('select * from feedback ', function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.render("Feedback-admin", {userData: results});
  });
});

app.post('/modifyone', function(req,res){
  var car_id=req.param('radio',null);
  console.log(car_id);

  connection.query('DELETE FROM test2', function (error, results, fields) {
    if (error) {
        throw error;
    }
  });
  var sql2="INSERT INTO test2 VALUES ('"+car_id+"');"
  connection.query(sql2, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });

  var sql2="select base_price, hourly_price, rental_status from car_detail where car_id='"+car_id+"';";
  connection.query(sql2, function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.render("Cars-admin-modify-page2", {base: results[0].base_price, hourly: results[0].hourly_price, availability: results[0].rental_status});
    res.end();
  });

});

app.post('/modifytwo', function(req,res){
  var sel1=req.param('base',null);
  var sel2=req.param('hourly',null);
  var sel3=req.param('avail',null);
  var modbase=req.param('modifyBase',null);
  var modhourly=req.param('modifyHourly',null);
  var availability=req.param('availability',null);
  console.log(sel1,sel2,sel3);

  connection.query('select * FROM test2', function (error, results, fields) {
    if (error) {
        throw error;
    }
    var car_id=results[0].car_id;

    if(sel1 == '1'){
      var sql2="UPDATE car_detail set base_price="+modbase+" where car_id='"+car_id+"';"
      connection.query(sql2, function (error, results, fields) {
        if (error) {
          throw error;
        }
      });
    }
    if(sel2 == '2'){
      var sql2="UPDATE car_detail set hourly_price="+modhourly+" where car_id='"+car_id+"';"
      connection.query(sql2, function (error, results, fields) {
        if (error) {
          throw error;
        }
      });
    }
    if(sel3 == '3'){
      var sql2="UPDATE car_detail set rental_status='"+availability+"' where car_id='"+car_id+"';"
      connection.query(sql2, function (error, results, fields) {
        if (error) {
          throw error;
        }
      });
    }
  });
  res.render("admin-page-successful");
  res.end();
});

app.post('/add', function(req,res){
  var car_id=req.param('car_id',null);
  var model_name=req.param('model_name',null);
  var manufacturer=req.param('manufacturer',null);
  var car_colour=req.param('car_colour',null);
  var category=req.param('category',null);
  var capacity=req.param('capacity',null);
  var rental_status=req.param('rental_status',null);
  var base_price=req.param('base_price',null);
  var hourly_price=req.param('hourly_price',null);
  var fuel=req.param('fuel',null);
  var transmission=req.param('transmission',null);
  var leather=req.param('leather',null);
  var camera=req.param('camera',null);
  var bluetooth=req.param('bluetooth',null);
  var usb=req.param('usb',null);
  var gps=req.param('gps',null);
  var cushion=req.param('cushion',null);
  var file=req.param('file',null);

  console.log(car_id,model_name,manufacturer,car_colour,category,capacity,rental_status,base_price,hourly_price,fuel,transmission,leather,camera,bluetooth,usb,gps,cushion,file);

  if(leather == 'leather'){
    leather='Yes';
  }
  else{
    leather='No';
  }
  if(camera == 'camera'){
    camera='Yes';
  }
  else{
    camera='No';
  }
  if(bluetooth == 'bluetooth'){
    bluetooth='Yes';
  }
  else{
    bluetooth='No';
  }
  if(usb == 'usb'){
    usb='Yes';
  }
  else{
    usb='No';
  }
  if(gps == 'gps'){
    gps='Yes';
  }
  else{
    gps='No';
  }
  if(cushion == 'cushion'){
    cushion='Yes';
  }
  else{
    cushion='No';
  }

  var sql="INSERT INTO Manufacturer VALUES('"+model_name+"', '"+manufacturer+"');"
  connection.query(sql, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });

  var temp=Math.floor(Math.random() * (9999 - 1 + 1) + 1);
  var sql2="INSERT INTO Features VALUES('"+temp+"','"+leather+"','"+camera+"','"+bluetooth+"','"+usb+"','"+gps+"','"+cushion+"')"
  connection.query(sql2, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });

  var sql3="INSERT INTO Car_detail VALUES('"+car_id+"', '"+model_name+"', '"+car_colour+"', '"+category+"', '"+fuel+"', '"+transmission+"','"+capacity+"','"+file+"','"+temp+"','"+rental_status+"','"+base_price+"','"+hourly_price+"');"
  connection.query(sql3, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });
  res.render("admin-page-successful");
  res.end();
});

app.post('/removeone', function(req,res){
  connection.query('select c.car_id, c.model_name, m.manufacturer ,c.category ,c.colour, c.fuel_type from car_detail c, manufacturer m where c.model_name=m.model_name ', function (error, results, fields) {
    if (error) {
        throw error;
    }
    res.render("admin-remove", {userData: results});
  });
});

app.post('/remove', function(req,res){
var car_id=req.param('car_id',null);
console.log(car_id);
var sql="select car_id, model_name, feature_id from car_detail where car_id='"+car_id+"';";
connection.query(sql, function (error, results, fields) {
  if (error) {
      throw error;
  }
  var model_name=results[0].model_name;
  var feature_id=results[0].feature_id;
  var sql2="delete from features where feature_id='"+feature_id+"';";
  connection.query(sql2, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });

  var sql3="delete from manufacturer where model_name='"+model_name+"';";
  connection.query(sql3, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });
});
  var sql4="delete from car_detail where car_id='"+car_id+"';";
  connection.query(sql4, function (error, results, fields) {
    if (error) {
        throw error;
    }
  });
  res.render("admin-page-successful");
  res.end();
});

app.listen(8080);
  console.log("server listening in http://localhost:8080");