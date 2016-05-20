// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var setDueDate = args.setDueDate;
var scadenza = args.scadenza;

if (scadenza != "Oggi") {
    $.picker.value = new Date(scadenza);
}

//var dataScelta = null;

function closeDueDateWin() {
    $.scadenza_todo.close();
    //setDueDate($.picker.value);
}

function dataScelta(e) {
    Ti.API.info("current Value of Picker");
    Ti.API.info(e.value); // valore cambiato
    //dataScelta = e.value;

    Ti.API.info($.picker.getValue()); // valore iniziale
    setDueDate(e.value);
}
