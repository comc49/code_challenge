var http = require("http")
var path = require("path")
var express = require("express")
var mongo = require("mongodb").MongoClient
var ObjectID = require('mongodb').ObjectID;
var app = express();

var url = 'mongodb://localhost:27017/adverse_events'
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

app.use(express.static(path.join(__dirname, '../../')));
//console.log(path.join(__dirname, "../../"))




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
                  d.push(db);
                  resolve(d);
              })
          })
      }
  )
  getEvents.then(
      (data) => {
        var doc = data[0];
        var res = data[1];
        var db = data[2];
        res.write(JSON.stringify(doc));
        res.end();
        db.close();
      }
      ).catch (
          (reason) => {
              console.log("REJECTED BECAUSE " +reason)    
          }
      );
})

app.post('/events', (req,res) => {
  var json = req.body
  var insertEvent = new Promise(
      (resolve,reject) => {
        mongo.connect(url, (err,db) => {
            if(err) {
                reject(err);
            }
            var events = db.collection("events");
            var d = []
            d.push(events)
            d.push(json)
            d.push(db)
            resolve(d);
        })
  })
  insertEvent.then(
    (data) => {
      var events = data[0];
      var json = data[1]
      var db = data[2];
      events.insertOne(json, (err, res) => {
        if(err) throw err;
        console.log("INSERTED!",res.result)
      })
      res.send("GOOD")
      db.close();
    }).catch( (reason)=> {
      console.log(reason)
    })
  
})


    
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
            d.push(events);
            d.push(id);
            d.push(db);
            resolve(d);
        })
      })
      deleteEvent.then(
        (data) => {
          var db = data[2];
          console.log(data[1])
          data[0].remove(
            { _id: new ObjectID(data[1])}, (err,res) => {
            //can chain promises as well
            if(err) {
              throw err
            }
              db.close();
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
        

app.listen(8081);





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