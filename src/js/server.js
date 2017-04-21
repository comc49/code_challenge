var http = require("http")
var path = require("path")
var express = require("express")
var mongo = require("mongodb").MongoClient
var ObjectID = require('mongodb').ObjectID;
var app = express();

var url = 'mongodb://localhost:27017/adverse_events'
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
  next();
});
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});


//function that returns a new arr
//params: start = start index, end = end index, data = data from db
//return: array that contains data[start-end]
const sendNewArr = (start,end, data) => {
  var a = [];
  for(var i = start; i <= end && i < data.length; ++i) {
    a.push(data[i])
  }
  return a;
}

    
app.get('/events', (req,res,next) => {
  var list = req.query.list.split('-');
  var start = list[0];
  var end = list[1];
  var limit = end - start;
  var getEvents = new Promise(
      (resolve, reject) => {
          mongo.connect(url, (err,db) => {
              if(err) {
                  reject(err);
              }
              var events = db.collection("events");
              events.find({}).limit(limit).toArray((err,doc) => {
                  if(err) 
                    return reject(err);
                  var d = [];
                  d.push(doc)
                  d.push(res)
                  resolve(d);
                  db.close();
              })
          })
      }
  )
  getEvents.then(
      (data) => {
        var doc = data[0];
        var res = data[1];
        res.write(JSON.stringify(doc));
        res.end();
      }
      ).catch (
          (reason) => {
              console.log("REJECTED BECAUSE " +reason)    
          }
      );
})
    
    /*
app.delete('/events', (req,res,next) => {
    var id = req.query.id;
    mongo.connect(url, (err,db) => {
        if(err) {
          console.log("SUP")
            throw(err);
        }
        var events = db.collection("events");
        events.remove({ _id: new ObjectID(id) }, (err,res) => {
          if(err) throw err
          console.log("WHAT IS GOING ON",res.result)
          
        })
        db.close()
    })
})
   */ 
app.delete('/events', (req,res,next) => {
  console.log(req.method)
    var id = req.query.id;
    var deleteEvent = new Promise(
      (resolve,reject) => {
        mongo.connect(url, (err,db) => {
            if(err) {
                reject(err);
            }
            var events = db.collection("events");
            var d = []
            d.push(events)
            d.push(id)
            resolve(d);
            //db.close();
        })
      })
      deleteEvent.then(
        (data) => {
          console.log(data[1])
          data[0].remove(
            { _id: new ObjectID(data[1])}, (err,res) => {
            //can chain promises as well
            if(err) {
              throw err
            }
              console.log("RESULT",res.result)
            }
            )
        }).catch (
          (reason) => {
            //console.log("REASON",reason)
            
          }
        )
        res.send('DELETE request to homepage');
});
        
/*       
mongo.connect(url, (err,db) => {
    if(err) throw err;
    let col = db.collection(col_name);
    col.remove({
        _id: id
    }, (err) => {
        if(err) throw err
        db.close();
        
    })
})
*/

app.listen(8081);





/*
//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
*/