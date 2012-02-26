var app = require('express').createServer();
var mongo = require('mongodb'), db = new mongo.Db('playlistWars', new mongo.Server('localhost', 27017, {}), {});
db.open(function() {

});

app.get('/', function(req, res){
  res.send('hello world');
});

// get the top 5 playlists
app.get('/gettop5', function(req, res) {

});

// post a JSON object, put into mongo
app.post('submit/score', function(req, res) {
	db.collection('scores', function(err, collection) {
		var document = {
			"spotifyAnonymousId" : req.spotifyAnonymousId,
			"submittedTimestamp" : req.submittedTimestamp,
			"score" : req.score,
			"tracks" : req.tracks
		};
		collection.insert(document, function() {
		});
	});
});

app.listen(80);
