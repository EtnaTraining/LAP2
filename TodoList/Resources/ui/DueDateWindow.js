
var isAndroid = Ti.Platform.osname == "android";

function DueDateWindow(/*function */ setSelectedDate) {

    var win = Ti.UI.createWindow({
        backgroundColor: isAndroid ? "black": "white",
        layout: "vertical",
        title: "Choose a date"
    });

    if (isAndroid) {
        win.addEventListener("open", function() {
            var actionBar = win.activity.actionBar;
            actionBar.displayHomeAsUp = true;
            actionBar.onHomeIconItemSelected = function() {
                win.close();
            }
        });
    }




    var picker = Ti.UI.createPicker({
        type: Ti.UI.PICKER_TYPE_DATE,
        minDate: new Date()
    });

    var closePickerWinBtn = Ti.UI.createButton({
        title: "Close"
    });

    closePickerWinBtn.addEventListener("click", function() {
        win.close();
    })

    win.add(picker);
    //win.add(closePickerWinBtn);

    picker.addEventListener("change", function(e) {
        setSelectedDate(e.value);
        //duedateBtn.title = String.formatDate(e.value, "medium");
    });

    return win;

};

module.exports = DueDateWindow;
