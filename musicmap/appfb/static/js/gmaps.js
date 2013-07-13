var markers = [];
  
      function initialize() {
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
              markers.push(new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                icon: new google.maps.MarkerImage(
                    'https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png',
                    null, null, new google.maps.Point(3.5,3.5)),
                clickable: false
              }));
            }
            bounds.extend(place.geometry.location);
          }

          map.fitBounds(bounds);
        });

        google.maps.event.addListener(map, 'bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
      }

      google.maps.event.addDomListenerOnce(window, 'load', initialize);
