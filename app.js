const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const app = express();
const port = 3000;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017/newdb';

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    robots.find({}).toArray(function (err, docs) {
      res.render("index", {robots: docs})
    })
  })
})

app.get('/index/:id', function(req, res){
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    let id = parseInt(req.params.id);
    robots.find({"id": id}).toArray(function (err, docs) {
      res.render("robot", {robots: docs})
    })
  })
})

app.get('/country/:country', function(req, res){
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    robots.find({"address.country": req.params.country}).toArray(function (err, docs) {

      res.render("index", {robots: docs})
    })
  })
})

app.get('/skills/:skill', function(req, res){
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    robots.find({"skills": req.params.skill}).toArray(function (err, docs) {

      res.render("index", {robots: docs})
    })
  })
})

app.get('/looking', function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    robots.find({"job": null}).toArray(function (err, docs) {
      res.render("index", {robots: docs})
    })
  })
})

app.get('/employed', function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const robots = db.collection('robots');
    robots.find({"job": {$not: {$in: [null]}}}).toArray(function (err, docs) {
      res.render("index", {robots: docs})
    })
  })
})

app.listen(port, function() {
  console.log('Example listening on port 3000')
})
