// creazione di un oggetti
// definisco la classe TodoAntonio
var TodoAntonio = Parse.Object.extend("TodoAntonio");
// instanzion un oggetto vuoto di tipo TodoAntonio
var newTodo = new TodoAntonio();
newTodo.set({
   title: "iPhone 7s Plus",
   location: "Cupertino",
   alarm: true,
   duedate: "2016-02-08T10:32.322Z",
   filename: "pippo.jpg"
});
newTodo.save(null, {
   success: function(todo) {
       console.log("todo salvata correttamente");
       console.log(todo);
   },
   error: function(todo, error) {
       console.log("si è verifcato un errore");
       console.log(error);
   }
});

// recuperare un singolo oggetto con dato objectId
var query = new Parse.Query(TodoAntonio);
query.get("cTy8cyg8jq", {
    success: function(todo) {
        console.log(todo);
    },
    // The object was retrieved successfully,
    error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
        console.log(error);
    }
});

// recupera tutti gli oggetti di una data classe
query.find({
  success: function(results) {
    console.log("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      console.log(object.id + ' - ' + object.get('title'));
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});

// creazione utente
var user = new Parse.User();
user.set("username", "acaland2");
user.set("password", "pippo1234");
user.set("email", "calanducci@unict.it");

// other fields can be set just like with Parse.Object
user.set("phone", "415-392-0202");

user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
    console.log(user);
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    console.log("Error: " + error.code + " " + error.message);
  }
});

// login utente
Parse.User.logIn("acaland2", "pippo1234", {
  success: function(user) {
    // Do stuff after successful login.
    console.log("login con successo");
    console.log(user);
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
    console.log("login fallito");
    console.log(error);
  }
});




// creazione todo con ACL dell'utente loggato
var newTodo = new TodoAntonio();
newTodo.set({
   title: "iPhone 7s Plus loggato con acl esclusiva",
   location: "Cupertino",
   alarm: true,
   duedate: "2016-02-08T10:32.322Z",
   filename: "pippo.jpg",
   user: Parse.User.current(),
   ACL: new Parse.ACL(Parse.User.current())
});
newTodo.save(null, {
   success: function(todo) {
       console.log("todo salvata correttamente");
       console.log(todo);
   },
   error: function(todo, error) {
       console.log("si è verifcato un errore");
       console.log(error);
   }
});


// recupero delle todo dell'utente corrente
var query = new Parse.Query(TodoAntonio);
query.equalTo("user", Parse.User.current());
query.find({
  success: function(results) {
    console.log("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      console.log(object.id + ' - ' + object.get('title'));
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});


// File upload
