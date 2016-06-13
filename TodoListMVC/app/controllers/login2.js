// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function usercreate(e){
    var login = $.username.value;
    var password = $.password.value;

    var user = new Parse.User();
    user.set("username", login);
    user.set("password", password);


    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        //alert("utente creato con successo")
        $.login2.close();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });

}

function login(e){
    var login = $.username.value;
    var password = $.password.value;
    Parse.User.logIn(login, password, {
      success: function(user) {
        // Do stuff after successful login.
        //alert("login con successo");
        $.login2.close();
        console.log(user);
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert("login fallito");
        console.log(error);
      }
    });
}
