// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var db = require("/services/db");
var net = require("/services/net");
//Ti.API.info("default image:")
//Ti.API.info($.thumb.image);

//Ti.API.info("singleton:");
//Ti.API.info(Alloy.Models.todo);
var currentTodo = Alloy.Models.todo;

currentTodo.set({
    alarm: false,
    duedate: "Oggi",
    thumb: "/images/todo_default.png",
    isEditable: false
});

var inEditMode = false;

currentTodo.on("change", function() {
    Ti.API.info('todo cambiata');
    $.editBtn.title = "Modifica";
    // if (currentTodo.get("isEditable")) {
    //     $.editBtn.title = "Modifica";
    // }  else {
    //     $.editBtn.title = "Aggiungi";
    // }
    inEditMode = true;
    Ti.API.info("inEditMode: " + inEditMode);

});


function showMap() {
    var mapwin = Alloy.createController("todo_map").getView();
    if (OS_IOS) {
        $.openWindow(mapwin);
    } else {
        mapwin.open();
    }
    getPosition();

}

function findPosition() {
    Ti.API.info("cerco la tua posizione in find position");
    Ti.Geolocation.getCurrentPosition(function(e) {
        if (e.success) {
            Ti.API.info("Posizione trovata");
            Ti.API.info("Latitudine: " + e.coords.latitude);
            Ti.API.info("Latitudine: " + e.coords.longitude);
            Ti.Geolocation.reverseGeocoder(e.coords.latitude, e.coords.longitude, function(e) {
                if (e.success) {
                    Ti.API.info(e.places);
                    $.locationTxt.value = e.places[0].address;
                }
            });
        } else {
            Ti.API.info("Non sono riuscito a trovare la posizione");
            Ti.API.info(JSON.stringify(e.error));
        }
    });
};



function getPosition() {
        //Ti.API.info("cerco la tua posizione:");
        Ti.API.info('In getPosition');

        if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {
            Ti.API.info("Abbiamo i permessi");
            findPosition();
        } else {
            Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(e) {
                if (e.success) {
                    findPosition();
                } else {
                    Ti.API.info("Non sono riuscito ad ottenere i permessi");
                    Ti.API.info("Some errror occured");
                    Ti.API.info(e.error);
                }
            })
            //alert("non hai i permessi !");
        }
};


function addTodo() {
    var todo = {};
    todo.title = $.titleTxt.value;
    if (!todo.title) {
        alert("Please insert a title at least!");
        return;
    }
    todo.location = $.locationTxt.value;
    todo.alarm = $.alarmSwt.value;
    if ($.scegliScadenzaBtn.title == "Oggi") {
        var duedate = new Date()
    } else {
        var duedate = new Date($.scegliScadenzaBtn.title);
    }
    todo.duedate = duedate.toISOString().split("T")[0];

    // invia todo alla elenco_todo

    //$.switchTab(1);

    // && $.thumb.image.indexOf("todo_default.png") == -1
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

        todo.filename = Alloy.Models.todo.get("filename");
        Ti.API.info("setto il filname: " + todo.filename);
    }

    //$.addTodo(todo);

    $.titleTxt.value = "";
    $.locationTxt.value = "";
    $.alarmSwt.value = false;
    $.scegliScadenzaBtn.title = "Oggi";
    $.thumb.image = "/images/todo_default.png";


    // salva todo su db
    // usando il modulo db.js
    //db.saveTodo(todo);
    // salva todo con Alloy Model
    Ti.API.info(todo);
    if (inEditMode) {
        Ti.API.info('Modifico todo');
        // currentTodo contiene una copia del modello todo selezionato dalla collection
        // il metodo .get() restituisce il modello della collection che ha lo stesso id (alloy_id)
        // invocando il metodo set sul modello restituito aggiorno la collection
        // e di conseguenza il binding aggiorna la TableView nella elenco_todo.xml
        // così abbiamo rimosso il fetch() dal database
        Alloy.Collections.todo.get(currentTodo).set(todo);
        //currentTodo.set(todo);
        // Alloy.Collections.todo.fetch();
        currentTodo.save();
        //resettiamo la currentTodo in modo da avere nuovamente il tasto aggiungi todo
        currentTodo.set({
             title: "",
             location: "",
             alarm: false,
             duedate: "Oggi",
             thumb: "/images/todo_default.png",
             filename: "",
        //     isEditable: false
        }, {silent:true});
        // $.titleTxt.value = "";
        // $.locationTxt.value = "";
        // $.alarmSwt.value = false;
        // $.scegliScadenzaBtn.title = "Oggi";
        // $.thumb.image = "/images/todo_default.png";
        $.editBtn.title = "Aggiungi";
        inEditMode = false;

    } else {
        Ti.API.info('Aggiungo todo');

        var newTodo = Alloy.createModel("Todo", todo);
        Ti.API.info(newTodo);
        Alloy.Collections.todo.add(newTodo);
        newTodo.save();

    }
    $.switchTab(1);

    // persistenza usando Alloy Model




    // salva in rete
    if (Ti.Network.online) {
        todo.path = todo.thumb;
        net.saveTodo(todo);
    }


    // switch to tab1 (elenco_todo)

}


function scegliScadenza(e) {
    //var scadenza = $.scegliScadenzaBtn.title;
    var scadenzaViewCtrl = Alloy.createController("scadenza_todo",
        {
            scadenza: $.scegliScadenzaBtn.title,
            setDueDate: function(scadenza) {
                Ti.API.info("scadenza: ");
                Ti.API.info(scadenza);
                $.scegliScadenzaBtn.title = String.formatDate(scadenza, "medium");
            }});
    var scadenzaWin = scadenzaViewCtrl.getView();
    if (OS_IOS) {
        scadenzaWin.title = "Scegli la scadenza";
        //$.currentTab.open(scadenzaWin);
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
            alert("ma perchèèèèèèèè...");
        },
        allowEdition: true
    });
}
