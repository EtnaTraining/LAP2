
function EditTodoWindow() {
    var win1 = Titanium.UI.createWindow({
        title:'Edit Todo',
        backgroundColor:'#fff',
        layout: "vertical"
    });

    var titleView = Ti.UI.createView({
        height: "20%",
        //backgroundColor: "red"
    });

    var titleLbl = Ti.UI.createLabel({
        text: "Title",
        left: 5,
        color: "black"
    });

    var titleTxt = Ti.UI.createTextField({
        left: 80,
        right: 5,
        hintText: "what do you want to do",
        hintTextColor: "#d3d3d3",
        color: "#623030"
    });
    titleView.add(titleLbl);
    titleView.add(titleTxt);

    win1.add(titleView);

    var locationView = Ti.UI.createView({
        height: "20%",
        //backgroundColor: "green"
    });

    var locationLbl = Ti.UI.createLabel({
        text: "Location",
        left: 5,
        color: "black"
    });

    var locationTxt = Ti.UI.createTextField({
        left: 80,
        right: 5,
        hintText: "where",
        hintTextColor: "#d3d3d3",
        color: "#623030"
    });
    locationView.add(locationLbl);
    locationView.add(locationTxt);

    win1.add(locationView);

    var alarmView = Ti.UI.createView({
        height: "20%",
        //backgroundColor: "yellow"
    });

    var alarmLbl = Ti.UI.createLabel({
        text: "Alarm",
        left: 5,
        color: "black"
    });

    var alarmSwitch = Ti.UI.createSwitch({
        left: 80,
        value: false
    });

    alarmView.add(alarmLbl);
    alarmView.add(alarmSwitch);

    win1.add(alarmView);

    var duedateView = Ti.UI.createView({
        height: "20%",
        //backgroundColor: "gray"
    });

    var duedateLbl = Ti.UI.createLabel({
        text: "Due Date",
        left: 5,
        color: "black"
    });

    var duedateBtn = Ti.UI.createButton({
        title: "Today",
        left: 80,
        right: 5
    });

    duedateView.add(duedateLbl);
    duedateView.add(duedateBtn);

    var DueDateWindow = require('/ui/DueDateWindow');
    var dueDateWindow = new DueDateWindow(function(newDate) {
        duedateBtn.title = String.formatDate(newDate, "medium");
    });

    duedateBtn.addEventListener("click", function() {
        if (isAndroid) {
            dueDateWindow.open();
        } else {
            tab1.open(dueDateWindow);
        }

    });

    win1.add(duedateView);



    var addTodoBtn = Ti.UI.createButton({
        title: "Add Todo",
        //borderWidth: 1,
        //borderColor: "black",
        width: isAndroid? Ti.UI.SIZE : Ti.UI.FILL,
        height: isAndroid? Ti.UI.SIZE : Ti.UI.FILL
    });

    addTodoBtn.addEventListener("click", function() {
        var todo = {};
        todo.title = titleTxt.value;
        todo.location = locationTxt.value;
        todo.alarm = alarmSwitch.value;
        todo.duedate = duedateBtn.title;
        Ti.API.info('sono dentro EditTodoWindow e questa');
        //Ti.API.info(tab1);
        win1.fireEvent("todoCreated", todo);
        //todolist.push(todo);


        titleTxt.value = "";
        //titleTxt.focus();
    });

    win1.addEventListener("todoSelected", function(todo) {
        Ti.API.info('todo selezionata');
        titleTxt.value = todo.title;
        locationTxt.value = todo.location;
        alarmSwitch.value = todo.alarm;
        duedateBtn.title = todo.duedate;
        titleTxt.focus();
    });
    win1.add(addTodoBtn);
    return win1;
}

module.exports = EditTodoWindow;
