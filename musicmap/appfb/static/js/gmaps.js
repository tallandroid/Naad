var markers = [];
  
      function initialize() {
        letssee();
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
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
        var input = document.getElementById('target');
        var searchBox = new google.maps.places.SearchBox(input);
        searchBox.setBounds(map.getBounds());

        google.maps.event.addListener(searchBox, 'places_changed', function() {
          var places = searchBox.getPlaces();
          if (!places.length) {
            return;
          }

          for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
          }
          markers = [];

          var bounds = new google.maps.LatLngBounds();

          for (var i = 0, place; place = places[i]; i++) {
            if (place.photos) {
              markers.push(new PhotoMarker(place, map, modalWindow));
            } else {
              var div = '<ul class="menu"><li><a href="#"><img src="/static/images/test.jpg"></a></li><li><a href="#">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">5</a></li></ul>'
              img = "/static/images/test.jpg";
               marker = new RichMarker({
               position: place.geometry.location,
                map: map,
                draggable: true,
                //content: '<ul class="menu"><li><a href="#">+</a></li><li><a href="#">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">5</a></li></ul>'
                content: div,
                visible:false
                });
               letssee(marker);
              google.maps.event.addListener(marker, 'ready', function() {
                letssee(this);
              });
              markers.push(marker);
            }
            bounds.extend(place.geometry.location);
          }

          map.fitBounds(bounds);
        });

        google.maps.event.addListener(map, 'bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
      }

      function letssee(marker){
      $('ul').circleMenu({
        item_diameter: 40,
        circle_radius: 100,
        direction: 'full'
      });
        if(marker){
          marker.setVisible(true);
        }
      }
      google.maps.event.addDomListenerOnce(window, 'load', initialize);
