var sys = require('sys'),
   io = require('socket.io'),
   _ = require('underscore'),
   connect = require('connect'),
   http = require('http'),
   Twitter = require('twitter');

var twitter = new Twitter({
   consumer_key: 'qRnYzQj3dxTkxaFwkkiw',
   consumer_secret: 'CGcMlTKdP9HKVelHijPzvSb4EfmJxzHxEccuXENs',
   access_token_key: '59268061-xuB5Wo0b9kGewqP3pGxbstTDCZTKQ9RxRofwotqD5',
   access_token_secret: 'qWJkB3kHyP9vdRW7zQcXShsjGazbWxK4GuwFsFrlQIE'
});

var server = connect.createServer(
//   connect.logger(),
   connect.conditionalGet(),
   connect.cache(),
   connect.gzip(),
   connect.staticProvider(__dirname)
);

server.listen(1234);

var stream = false;
var socket = io.listen(server);

socket.on('connection', function (client) {
   if (!stream) {
      twitter.stream('statuses/filter', {locations: '-180,-90,180,90'}, 
         function (newStream) {

         stream = newStream;

         console.log('===== New stream started =====');

         stream.on('data', function (twiit) {

            var geo = twiit.geo,
               coords = twiit.coordinates;
            if (typeof coords === 'object' && coords !== null) {
               var point = {lat: coords.coordinates[0],
                  lng: coords.coordinates[1]};
            }
            else if (typeof geo === 'object' && geo !== null) {
               var point = {lat: geo.coordinates[1],
                  lng: geo.coordinates[0]};
            }
               
            if (point !== undefined) 
               socket.broadcast(JSON.stringify(point));

         });
      });
   }

   client.on('disconnect', function () {
      if (_.size(socket.clients === 0)) {
         stream.destroy();
         stream = false;
         console.log('===== Stream destroyed, idle =====');
      }
   });
});

