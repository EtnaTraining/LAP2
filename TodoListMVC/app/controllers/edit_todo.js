// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var db = require("services/db");

function addTodo() {
    var todo = {};
    todo.title = $.titleTxt.value;
    todo.location = $.locationTxt.value;
    todo.alarm = $.alarmSwt.value;
    todo.duedate = $.scegliScadenzaBtn.title;
    // invia todo alla elenco_todo

    //$.switchTab(1);
    $.titleTxt.value = "";
    $.locationTxt.value = "";
    $.alarmSwt.value = false;
    $.scegliScadenzaBtn.title = "Oggi";
    var filename = todo.title.replace(/ /g, "_") + "-" + new Date().getTime();
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename + ".jpg");
    f.write($.thumb.image);


    todo.thumb = filename + "_thumb.jpg";
    f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,todo.thumb);
    f.write($.thumb.image.imageAsThumbnail(60,0, 30));
    f = null;
    $.addTodo(todo);

    // salva todo su db

    db.saveTodo(todo);


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
