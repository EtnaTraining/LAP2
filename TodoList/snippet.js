if (isAndroid) {
    win.addEventListener("open", function() {
        var actionbar = win.activity.actionBar;
        actionbar.title = "Choose a date";
        actionbar.displayHomeAsUp = true;
        actionbar.onHomeIconItemSelected = function() {
            win.close();
        }
    });
} else {
    win.title = "Choose a date";
}


if (isAndroid) {
    dueDateWindow.open();
} else {
    tab1.open(dueDateWindow);
}
