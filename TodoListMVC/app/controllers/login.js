// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Alloy.Globals.loading.show("Loggin in", true);


Alloy.Globals.useCloud = false;

function usercreate(e){
    $.loading.show('Signing up', false);
    var login = $.username.value;
    var password = $.password.value;

    var user = new Parse.User();
    user.set("username", login);
    user.set("password", password);


    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        //alert("utente creato con successo")
        Alloy.Globals.useCloud = true;
        $.loading.hide();
        Alloy.Collections.todo.reset();
        close();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        $.loading.hide();
        alert("Error: " + error.code + " " + error.message);
      }
    });

}

function login(e){
    $.loading.show('Logging in', false);
    var login = $.username.value;
    var password = $.password.value;
    Parse.User.logIn(login, password, {
      success: function(user) {
        // Do stuff after successful login.
        //alert("login con successo");
        Ti.API.info(user);
        Alloy.Globals.useCloud = true;
        close();
        var TodoParse = Parse.Object.extend("Todo");

        var query = new Parse.Query(TodoParse);
        //query.equalTo("user", Parse.User.current());

        query.find({
          success: function(results) {

            //Ti.API.info(results.toJSON());
            Ti.API.info("success");
            Alloy.Collections.todo.reset();
            //Ti.API.info(typeof(results));
            Ti.API.info("Successfully retrieved", results.length );
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              object.set("alloy_id", object.id);
              Alloy.Collections.todo.add(object.toJSON());
              //Ti.API.info(object.id + ' - ' + object.className);

            }
            if (OS_ANDROID) {
                var net = require("services/net");
                net.subscribeForPush([""], Ti.App.Properties.getString("deviceToken"), "android", Parse.User.current().id);
            }

            $.loading.hide();

          },
          error: function(error) {
            $.loading.hide();
            alert("Error retrieving data");
            console.log("Error: " + error.code + " " + error.message);
            //Alloy.Globals.loading.hide();
          }
        });


        //console.log(user);
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        $.loading.hide();
        alert("login fallito");
        console.log(error);
      }
    });
}

function close(e){
  if (!Alloy.Globals.useCloud) {
    var currentUser = Parse.User.current();
    Ti.API.info("in close");
    //Ti.API.info(currentUser.authenticated());
    if (currentUser && currentUser.authenticated()) {
      Parse.User.logOut()
        .then(function(results) {
          Ti.API.info(results);
        });
    }
    Alloy.Collections.todo.fetch();
  }
  if (OS_IOS) {
    $.closeNav();
  } else {
    $.login.close();
  }
}

$.username.value = "acaland";
$.password.value = "pippo1234";
//login();
