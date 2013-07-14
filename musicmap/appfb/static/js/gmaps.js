var markers = [];
defaultId = 'me';
      /*function test() {
        
          initialize();
      }*/
      function initialize() {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          streetViewControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          maxZoom: 5,
          //center:new google.maps.LatLng(17.3667, 78.4667),
          styles: [
            {
              elementType: 'labels',
              stylers: [ { visibility: 'on' } ]
            },
            {
              stylers: [ { saturation: -70 }, { lightness: -20 } ]
            }
          ]
        });
        var defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(17.3667, 78.4667),new google.maps.LatLng(18.3667, 80.4667));
        map.fitBounds(defaultBounds);
        var places = jQuery.parseJSON($("#app-data").html());
          if (!places.songs.length) {
            return;
          }

          for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
          }
          markers = [];
        var bounds = new google.maps.LatLngBounds();
          for(var i = 0;i<places.songs.length;i++){
            if(places.songs[i].location){
              img = "/static/images/test.jpg";
              
              var latlng = new google.maps.LatLng(places.songs[i].location.latitude,places.songs[i].location.longitude);
              $.each(places.songs[i],function(test){
                if(test.match('[0-9]')){
                  //console.log(test,value);
                  img = "http://graph.facebook.com/"+test+"/picture";
                  defaultId = test;
                }      
              });
              var div = '<ul class="menu"><li><a href="#"><img src="'+img+'"></a></li><li><a href="#">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">5</a></li></ul>'
               marker = new RichMarker({
               position: latlng,
                draggable: true,
                //content: '<ul class="menu"><li><a href="#">+</a></li><li><a href="#">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">5</a></li></ul>'
                content: div,
                visible:true,
                map:map
                });
              google.maps.event.addListener(marker, 'ready', function() {
                letssee(this);
              });
              google.maps.event.addListener(marker, 'click', function() {
                letssee(this);
              });
              markers.push(marker);
            }
            //bounds.extend(place.geometry.location);
          }
         
        /*searchBox.setBounds(map.getBounds());
        google.maps.event.addListener(searchBox)*/
         /*var bounds = new google.maps.LatLngBounds();
          map.fitBounds(bounds);*/

        /*google.maps.event.addListener(map, 'bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });*/
      }

      function letssee(marker){
      $('ul').circleMenu({
        item_diameter: 40,
        circle_radius: 100,
        direction: 'full',
        trigger:'click'
      }).on('circleMenu-open',function(){
          $("#left").html('');
          count= (count+1)%100;
          leftie(count);
          console.log('menu opened 2');
        });
        if(marker){
          marker.setVisible(true);
        }
      }

      google.maps.event.addDomListenerOnce(window, 'load', initialize);
