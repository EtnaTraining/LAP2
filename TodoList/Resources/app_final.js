// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var isAndroid = Ti.Platform.osname == "android";

var EditTodoWindow = require('ui/EditTodoWindow');
var editTodoWin = new EditTodoWindow();
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Edit Todo',
    window:editTodoWin
});

var TodoListWindow = require("ui/TodoListWindow");
var todolistWin = new TodoListWindow();
var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_ui.png',
    title:'List Todo',
    window:todolistWin
});

todolistWin.addEventListener("todoSelected", function(todo) {
    editTodoWin.fireEvent("todoSelected", todo);
    tabGroup.setActiveTab(0);
});

editTodoWin.addEventListener("todoCreated", function(todo) {
    todolistWin.fireEvent("todoCreated", todo);
    tabGroup.setActiveTab(1);
});

var tabGroup = Titanium.UI.createTabGroup();
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.open();
