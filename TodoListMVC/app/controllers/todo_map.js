// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

if (args.location != "") {
  Ti.Geolocation.forwardGeocoder(args.location, function(e) {
    if (e.success) {
      Ti.API.info(e);
      $.map.setRegion({
        latitude: e.latitude,
        longitude: e.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
      $.todoAnn.latitude = e.latitude;
      $.todoAnn.longitude = e.longitude;
      $.todoAnn.title = args.title ? args.title : "My Todo ";
      $.map.selectAnnotation($.todoAnn);
    } else {
      alert("Could not find the indicated location");
      Ti.API.info(e.error);
    }
  });
} else {
  // use the gps to geolocate the todo where the user is currently is
  checkPermission(function(e) {
    if (e.success) {
      findPosition(function(e) {
        if (e.success) {
          $.map.setRegion({
            latitude: e.latitude,
            longitude: e.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          });
          $.todoAnn.latitude = e.latitude;
          $.todoAnn.longitude = e.longitude;
          $.todoAnn.title = args.title ? args.title : "My Todo ";
          $.map.selectAnnotation($.todoAnn);
          if (args.setLocation) {
            args.setLocation(e.address);
          }
        } else {
          alert("I can't find your position");
          Ti.API.info(e.error);
        }
      });
    } else {
      alert("You have to enable the permission to use the GPS");
    }
  });
}



function findPosition(_callback) {
    Ti.API.info("cerco la tua posizione in find position");
    Ti.Geolocation.getCurrentPosition(function(e) {
        if (e.success) {
            Ti.API.info("Posizione trovata");
            Ti.API.info("Latitudine: " + e.coords.latitude);
            Ti.API.info("Latitudine: " + e.coords.longitude);
            Ti.Geolocation.reverseGeocoder(e.coords.latitude, e.coords.longitude, function(data) {
                if (e.success) {
                    Ti.API.info(data.places);
                    //$.locationTxt.value = e.places[0].address;
                    _callback({
                      success: true,
                      latitude: e.coords.latitude,
                      longitude: e.coords.longitude,
                      address: data.places[0].address
                    });
                }
            });
        } else {
            Ti.API.info("Non sono riuscito a trovare la posizione");
            Ti.API.info(JSON.stringify(e.error));
            _callback({success:false, error: e.error});
        }
    });
};



function checkPermission(_callback) {
        //Ti.API.info("cerco la tua posizione:");
        Ti.API.info('In getPosition');

        if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {
            Ti.API.info("Abbiamo i permessi");
            _callback({success:true});
        } else {
            Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(e) {
                if (e.success) {
                    _callback({success: true});
                } else {
                    Ti.API.info("Non sono riuscito ad ottenere i permessi");
                    Ti.API.info("Some errror occured");
                    Ti.API.info(e.error);
                }
            })
            //alert("non hai i permessi !");
            _callback({success: false});
        }
};
