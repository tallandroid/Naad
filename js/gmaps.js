var markers = [];
  
      function initialize() {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          maxZoom: 5,
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
//if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) { 
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        map.fitBounds(defaultBounds);
                }
                
                );
        var input = document.getElementById('target');
        var searchBox = new google.maps.places.SearchBox(input);
        searchBox.setBounds(map.getBounds());

        var modalWindow = new ModalWindow(map);

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
      
      /* Photo Marker */
      function PhotoMarker(place, map, modalWindow) {
        this.modalWindow_ = modalWindow;
        this.place_ = place;
        this.setMap(map);
      }

      PhotoMarker.prototype = new google.maps.OverlayView();

      PhotoMarker.prototype.onAdd = function() {
        this.img_ = document.createElement('img');
        this.img_.className = 'photo-marker';
        this.img_.title = this.place_.name;
        this.img_.src = this.place_.photos[0].getUrl({
            'maxWidth': 35,
            'maxHeight': 35
        });
        this.getPanes().overlayImage.appendChild(this.img_);

        var that = this;
        google.maps.event.addDomListener(this.img_, 'click', function() {
          that.modalWindow_.getDetails(that.place_);
        });
      };

      PhotoMarker.prototype.draw = function() {
        var that = this;
        if (!this.img_ || (this.img_ && !this.img_.complete)) {
          window.clearTimeout(this.imgLoader_);
          this.imgLoader_ = window.setTimeout(function() {
              that.draw();
          }, 50);
          return;
        }
        var proj = this.getProjection();
        var pos = proj.fromLatLngToDivPixel(this.place_.geometry.location);
        var w = this.img_.offsetWidth;
        var h = this.img_.offsetHeight;
        this.img_.style.left = Math.floor(pos.x - w / 2) + 'px';
        this.img_.style.top = Math.floor(pos.y - h / 2) + 'px';
      };

      PhotoMarker.prototype.onRemove = function() {
        this.img_.parentNode.removeChild(this.img_);
        this.img_ = null;
      };

      /* Modal Window */
      function ModalWindow(map) {
        this.service_ = new google.maps.places.PlacesService(map);
        this.createDOMElements_();
        this.addEventListeners_();
      }

      ModalWindow.prototype.createDOMElements_ = function() {
        this.modal_ = document.createElement('div');
        this.modal_.id = 'modal';
        document.body.appendChild(this.modal_);

        var modalWindow = document.createElement('div');
        modalWindow.id = 'window';
        this.modal_.appendChild(modalWindow);

        var close = document.createElement('img');
        close.id = 'close';
        close.className = 'close';
        close.src = '../images/close.png';
        close.alt = 'Close window';
        modalWindow.appendChild(close);

        this.info_ = document.createElement('div');
        this.info_.id = 'info';
        modalWindow.appendChild(this.info_);

        this.photo_ = document.createElement('div');
        this.photo_.id = 'photo';
        modalWindow.appendChild(this.photo_);

        this.photos_ = document.createElement('div');
        this.photos_.id = 'photos';
        modalWindow.appendChild(this.photos_);

        this.attribution_ = document.createElement('div');
        this.attribution_.id = 'attribution';
        modalWindow.appendChild(this.attribution_);

        var mask = document.createElement('div');
        mask.id = 'mask';
        this.modal_.appendChild(mask);
      };

      ModalWindow.prototype.addEventListeners_ = function() {
        var that = this;

        google.maps.event.addDomListener(this.modal_, 'click', function(e) {
          if (e.target && (e.target.id == 'close' || e.target.id == 'mask')) {
            that.hideWindow_();
          }
        });

        google.maps.event.addDomListener(document, 'keyup', function(e) {
          // Esc key
          if (e.keyCode == 27) {
            that.hideWindow_();
          }
        });
      };

      ModalWindow.prototype.getDetails = function(place) {
        if (this.place_ && place.id == this.place_.id) {
          this.showWindow_();
          return;
        }

        var that = this;
        this.service_.getDetails({'reference': place.reference},
            function(details, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          that.place_ = place;
          that.details_ = details;
          that.createContent_();
          that.showWindow_();
        });
      };

      ModalWindow.prototype.createContent_ = function(place, status) {
        this.createInfo_();
        this.createPhoto_(this.place_.photos[0]);
        this.createThumbnails_();
        this.createAttribution_(this.place_.photos[0]);
      };

      ModalWindow.prototype.createPhoto_ = function(photo) {
        this.photo_.innerHTML = '';

        var img = document.createElement('img');
        img.src = photo.getUrl({'maxWidth': 480, 'maxHeight': 246});
        this.photo_.appendChild(img);
      };

      ModalWindow.prototype.createInfo_ = function() {
        this.info_.innerHTML = '';

        var name = document.createElement('h3');
        name.innerHTML = this.place_.name;
        this.info_.appendChild(name);

        var address = document.createElement('p');
        address.innerHTML = this.place_.formatted_address;
        this.info_.appendChild(address);
      };

      ModalWindow.prototype.createThumbnails_ = function() {
        this.photos_.innerHTML = '';

        for (var i = 0; i < this.details_.photos.length; i++) {
          var thumbnail = document.createElement('img');
          thumbnail.id = i;
          thumbnail.src = this.details_.photos[i].getUrl({'maxWidth': 88,
              'maxHeight': 88});
          this.photos_.appendChild(thumbnail);
        }

        this.photos_.firstChild.className = 'selected';
        this.selected_ = this.photos_.firstChild;

        var that = this;
        google.maps.event.addDomListener(this.photos_, 'click', function(e) {
          if (e.target && e.target.nodeName == 'IMG' &&
              e.target.className != 'selected') {
            that.changeSelected_(e.target);
          }
        });
      };

      ModalWindow.prototype.changeSelected_ = function(thumbnail) {
        this.selected_.className = '';
        thumbnail.className = 'selected';
        this.selected_ = thumbnail;

        this.createPhoto_(this.details_.photos[thumbnail.id]);
        this.createAttribution_(this.details_.photos[thumbnail.id]);
      };

      ModalWindow.prototype.createAttribution_ = function(photo) {
        this.attribution_.innerHTML = '';

        if (photo.html_attributions.length) {
          this.attribution_.innerHTML = photo.html_attributions[0];
          var link = this.attribution_.getElementsByTagName('a');
          if (link[0]) {
            link[0].target = '_blank';
          }
        }
      };

      ModalWindow.prototype.showWindow_ = function() {
        this.modal_.style.display = 'block';
      };

      ModalWindow.prototype.hideWindow_ = function() {
        this.modal_.style.display = 'none';
      };
      

      google.maps.event.addDomListenerOnce(window, 'load', initialize);