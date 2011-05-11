/* Author: Sean Caetano Martin
      xonecas.com
*/

(function (window, undefined) {
   var document = window.document;

   function draw(ctx, lat, lng) {
      var w = ctx.canvas.width,
         h = ctx.canvas.height,
         x = Math.floor( lat*(w/360) ),
         y = Math.floor( lng*(h/180) * -1 );

      var grad = ctx.createRadialGradient(x, y, 1, x, y, 4);

      var rgb = Math.floor(Math.random()*256) +', ';
      rgb += Math.floor(Math.random()*256) +', ';
      rgb += Math.floor(Math.random()*256) +', ';
      

      grad.addColorStop(0, 'rgba('+rgb+'1)');
      grad.addColorStop(1, 'rgba('+rgb+'0)');

      ctx.fillStyle = grad;
      ctx.fillRect(x-4,y-4,8,8);
   }

   $(window).ready(function () {
      $(".handle").click(function (ev) {
         var target = '#'+$(this).data('target');
         $(target).slideToggle('slow');
      });

      var canvas = document.createElement('canvas');
      if (!Modernizr.canvas && G_vmlCanvasManager)
         G_vmlCanvasManager.initElement(canvas);

      var ctx = canvas.getContext('2d');

      $('#container').append(canvas);

      var width = canvas.width = $(window).width();
      var height = $(window).height(),
         minHeight = Math.floor(width/2);
      canvas.height = (height < (minHeight))? minHeight: height;

      ctx.translate(
         Math.floor(canvas.width/2),
         Math.floor(canvas.height/2)
      );

      var socket = new io.Socket('xonecas.com'); 
      socket.connect();

      socket.on('connect', function () {
         socket.send('track');
      });

      socket.on('message', function(data){ 
         var point = $.parseJSON(data);

         var lat = Math.floor(point.lat),
            lng = Math.floor(point.lng);

         if (point.repoint !== undefined) {
            var repoint = point.repoint;
            draw(ctx, repoint.lat, repoint.lng);
         }

         draw(ctx, lat, lng);

      });
   });
}) (window);

