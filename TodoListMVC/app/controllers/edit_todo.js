// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var db = require("/services/db");
var net = require("/services/net");

var currentTodo = Alloy.Models.todo;
    var TodoParse = Parse.Object.extend("Todo");

// da fixare
if (OS_IOS) {
    $.sv.contentHeight = $.edit_todo.size.height;
} else {
    $.sv.contentHeight = 464*2;
}



$.scegliScadenzaBtn.title = "Oggi";
$.thumb.image = "/images/todo_default.png";

var inEditMode = false;
// data corrente della scadenza
var selectedDate = new Date();


// aggiorna la view nel caso di selezione di una todo dalla lista
currentTodo.on("edit", function() {

    $.editBtn.title = "Modifica";
    $.edit_todo.title = "Modifica Todo";
    inEditMode = true;
    selectedDate = new Date(currentTodo.get("duedate"));

    currentTodo.set({
        "duedateFormatted": String.formatDate(new Date(currentTodo.get("duedate")), "medium"),
        "thumb": currentTodo.get("url") ? currentTodo.get("url") : (currentTodo.get("filename")?
            Ti.Filesystem.applicationDataDirectory +
            currentTodo.get("filename").substr(0, currentTodo.get("filename").length-4) + "_thumb.jpg" :
            "/images/todo_default.png")
    });
    Ti.API.info("inEditMode: " + inEditMode);
    Ti.API.info(currentTodo);
    Ti.API.info("id =", currentTodo.id);
    $.edit_todo.rightNavButton = $.shareBtn;
    $.shareBtn.visible = true;
});


function showMap() {
    var mapwin = Alloy.createController("todo_map", {
      location: $.locationTxt.value,
      title: $.titleTxt.value,
      setLocation: function(address) {
        $.locationTxt.value = address;
      }
    }).getView();
    if (OS_IOS) {
        $.openWindow(mapwin);
    } else {
        mapwin.open();
    }
}




function addTodo() {
    if (!$.titleTxt.value) {
        alert("Please insert a title at least!");
        return;
    }
    var todo = {};
    todo.title = $.titleTxt.value;
    todo.location = $.locationTxt.value;
    todo.alarm = $.alarmSwt.value;
    todo.duedate = selectedDate.toISOString().split("T")[0];


    if (typeof($.thumb.image) != "string") {
        var filename = todo.title.replace(/ /g, "_") + "-" + new Date().getTime();
        todo.filename = filename + ".jpg";
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename + ".jpg");
        f.write($.thumb.image);
        var thumb = filename + "_thumb.jpg";
        f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, thumb);
        f.write($.thumb.image.imageAsThumbnail(60,0, 30));
        f = null;
    } else {
        // in editMode
        if (inEditMode) {
            todo.filename = currentTodo.get("filename");
        } else {
            todo.filename =  null; // default image
        }

    }

    //$.addTodo(todo);
    // salva todo su db
    // usando il modulo db.js
    //db.saveTodo(todo);
    // salva todo con Alloy Model
    //Ti.API.info(todo);

    if (inEditMode) {
        Ti.API.info('Modifico todo');
        // currentTodo contiene una copia del modello todo selezionato dalla collection
        // il metodo .get() restituisce il modello della collection che ha lo stesso id (alloy_id)
        // invocando il metodo set sul modello restituito aggiorno la collection
        // e di conseguenza il binding aggiorna la TableView nella elenco_todo.xml
        // così abbiamo rimosso il fetch() dal database
        Ti.API.info(currentTodo.id);
        Ti.API.info(currentTodo.cid);
        Ti.API.info(Alloy.Collections.todo);
        Ti.API.info("corrente");
        Ti.API.info(Alloy.Collections.todo.get(currentTodo));
        Alloy.Collections.todo.get(currentTodo).set(todo);
        // if we are offline
        if (!Alloy.Globals.useCloud) {
          Alloy.Collections.todo.get(currentTodo).save();
        }

        // switch to tab1 (elenco_todo)
        $.switchTab(1);
        $.editBtn.title = "Aggiungi";
        $.edit_todo.title = "Aggiungi Todo";


    } else {
        Ti.API.info('Aggiungo nuova todo');
        todo.done = "false";
        Ti.API.info(todo);
        var newTodo = Alloy.createModel("todo", todo);
        Ti.API.info(newTodo);
        //Ti.API.info("alloyid", newTodo.id);
        if (!Alloy.Globals.useCloud) {
            newTodo.save();
            Alloy.Collections.todo.add(newTodo);
        }


        // switch to tab1 (elenco_todo)
        $.switchTab(1);

    }

    selectedDate = new Date();
    $.titleTxt.value = "";
    $.locationTxt.value = "";
    $.alarmSwt.value = false;
    $.scegliScadenzaBtn.title = "Oggi";
    $.thumb.image = "/images/todo_default.png";

    $.titleTxt.focus();

    // salva in rete
    if (Ti.Network.online) {
        todo.path = todo.thumb;
        // salvataggio su server custom
        //net.saveTodo(todo);
        // salvataggio su Parse Server
        if (Alloy.Globals.useCloud) {
          todo.alarm = (todo.alarm == "true") ? true : false;
          if (inEditMode) {
            todo.id = currentTodo.id;
          }
          var newTodoParse = new TodoParse();
          newTodoParse.set(todo);
          newTodoParse.save({
            user: Parse.User.current(),
            ACL: new Parse.ACL(Parse.User.current())
          }, {
            success: function(parseTodo) {
                Ti.API.info("todo salvata correttamente");
                // Parse.Cloud.run('notifyUser', { userId: 'DL0CFKuBMf', todoId: parseTodo.id })
                //     .then(function(e) {
                //   // ratings should be 4.5
                //     Ti.API.info("vaaa bene");
                //     Ti.API.info(e);
                // });
                Ti.API.info("inEditMode", inEditMode);
                if (!inEditMode) {
                    Ti.API.info("setting todo id");
                    todo.alloy_id = parseTodo.id;
                    Alloy.Collections.todo.add(todo);
                }
                Ti.API.info("ciao");
                Ti.API.info("todo.filename:", todo.filename);
                if (todo.filename) {
                    net.fileUpload(todo.filename, function(e) {
                        if (e.success) {
                            parseTodo.set("url", e.url);
                            parseTodo.save();
                            if (!inEditMode) {
                                newTodo.set({"url": e.url});
                            }

                            inEditMode = false;
                        }
                    });
                } else {
                    inEditMode = false;
                }

            },
            error: function(todo, error) {
                Ti.API.info("si è verifcato un errore");
                alert(error);
            }
          });
        }

    } else {
        inEditMode = false;
    }
    //$.shareBtn.visible = false;
    $.edit_todo.rightNavButton = null;
}


function scegliScadenza(e) {

    var scadenzaViewCtrl = Alloy.createController("scadenza_todo",
        {
            scadenza: selectedDate,
            setDueDate: function(nuovaScadenza) {
                Ti.API.info("scadenza: ");
                selectedDate = nuovaScadenza;
                //currentTodo.set({"duedate": scadenza}, {silent: true});
                Ti.API.info("setting todo date:");

                $.scegliScadenzaBtn.title = String.formatDate(nuovaScadenza, "medium");
            }});
    var scadenzaWin = scadenzaViewCtrl.getView();
    if (OS_IOS) {
        scadenzaWin.title = "Scegli la scadenza..";

        $.openWindow(scadenzaWin);
    } else {
        scadenzaWin.open();
    }

}

function chooseImage(e){
    Ti.Media.openPhotoGallery({
        success: function(e) {
            var blob = e.media;
            Ti.API.info(blob.width + " x " + blob.height);
            var aspect_ratio = blob.height / blob.width;
            var newHeight = 120 * aspect_ratio;

            $.thumb.image = blob.imageAsResized(120, newHeight);
            Ti.API.info($.thumb.image.width + " x " + $.thumb.image.height);


            /*var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "prova.jpg");
            f.write(e.media);
            f = null;
            var f2 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "prova_thumb.jpg");
            f2.write(e.media.imageAsThumbnail(120));
            f2 = null;
            var f3 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "prova_resized.jpg");
            f3.write(e.media.imageAsResized(1024, newHeight));
            f3 = null; */
        },
        cancel: function() {
            alert("ma perchèèèèèèèè....");
        },
        allowEdition: true
    });
}

function login(e){
  $.showLogin();
}

function share(e){
    if (!Alloy.Globals.useCloud) {
        alert("you are offline! Log in to share");
        return;
    }
    var shareWin = Alloy.createController("share_todo", {
        currentACL: currentTodo.get("ACL"),
        shareWith: function(userId) {
            if (!currentTodo.id) {
                alert("please select a todo first");
                return;
            }
            if (currentTodo.get("ACL")[userId]) {
                alert("already shared with this user");
                return;
            }
            currentTodo.get("ACL")[userId] = {"read": true, "write":true};
            Ti.API.info("currentTodo");
            //Ti.API.info(currentTodo);
            var newTodoParse = new TodoParse();
            newTodoParse.set({id: currentTodo.id});
            newTodoParse.setACL(new Parse.ACL(currentTodo.get("ACL")));
            Ti.API.info(newTodoParse);
            Ti.API.info(userId);
            newTodoParse.save(null, {
              success: function(parseTodo) {
                  Ti.API.info("ACL set correctly");
                  Parse.Cloud.run('notifyUser', { userId: userId, todoId: parseTodo.id })
                      .then(function(e) {
                    // ratings should be 4.5
                      Ti.API.info("push inviata");
                      Ti.API.info(e);
                      alert("Shared successfully!!")
                  });
              },
              error: function(parseTodo, error) {
                  Ti.API.info("error while setting ACL");
                  Ti.API.info(error);
              }
          });
        }
    }).getView();
    if (OS_IOS) {
        $.openWindow(shareWin);
    } else {
        shareWin.open();
    }
}

$.share = share;
