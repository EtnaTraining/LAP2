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
    $.addTodo(todo);
    //$.switchTab(1);
    $.titleTxt.value = "";
    $.locationTxt.value = "";
    $.alarmSwt.value = false;
    $.scegliScadenzaBtn.title = "Oggi";
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
            $.thumb.image = e.media;
        },
        cancel: function() {
            alert("ma perchèèèèèèèè...");
        },
        allowEdition: true
    });
}
