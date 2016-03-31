var http = require('http')
  , express = require('express')
  , bodyParser = require('body-parser')
  , nodemailer = require("nodemailer")
  , app = express()
  , server = http.createServer(app)
  , creds = require('./gmail_auth.json');


// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: creds
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/capture', function(req, res, next){
  var data = req.body;
  var mailOptions = {
      from: "Audrey Dessauer <ardessau@gmail.com>", // sender address
      replyTo: data.name + '<' + data.email + '>',
      to: "ardessau@gmail.com", // list of receivers
      subject: "[WebForm] - " + data.name , // Subject line
      text: JSON.stringify(data, null, 4), // plaintext body
      html: JSON.stringify(data, null, 4) // html body
  }

  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }
  });

  return res.send("Thank You!");
})

app.use('/static', express.static('./assets'));
// path to pages:  http://localhost:3333/static/index.html

server.listen(3333);

// var express = require('express');
// var app = express();
// app.use(express.static('assets'));
//
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
//
// var port = process.env.PORT || 8080;
//
// app.listen(port, function () {
//   console.log('Listening on port' + port);
// });
