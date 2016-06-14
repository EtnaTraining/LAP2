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
        "thumb": currentTodo.get("filename")?
            Ti.Filesystem.applicationDataDirectory +
            currentTodo.get("filename").substr(0, currentTodo.get("filename").length-4) + "_thumb.jpg" :
            "/images/todo_default.png"
    });
    Ti.API.info("inEditMode: " + inEditMode);
    Ti.API.info(currentTodo);
    Ti.API.info("id =", currentTodo.id);

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
        var newTodo = Alloy.createModel("todo", todo);
        //Ti.API.info("alloyid", newTodo.id);
        Alloy.Collections.todo.add(newTodo);
        // switch to tab1 (elenco_todo)
        $.switchTab(1);
        newTodo.save();
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

                if (!inEditMode) {
                  newTodo.set({"alloy_id": parseTodo.id});
                  //Ti.API.info(parseTodo.id);
                  //Ti.API.info(newTodo.id);
                }
                //Ti.API.info(todo.id);
            },
            error: function(todo, error) {
                Ti.API.info("si è verifcato un errore");
                alert(error);
            }
          });
        }
    }
    inEditMode = false;
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
