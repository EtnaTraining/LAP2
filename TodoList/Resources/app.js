// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var tabGroup = Titanium.UI.createTabGroup();
var isAndroid = Ti.Platform.osname == "android";

var EditTodoWindow = require('ui/EditTodoWindow');
var editTodoWin = new EditTodoWindow();
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Edit Todo',
    window:editTodoWin
});
editTodoWin.addEventListener("todoCreated", function(todo) {
    //win2.fireEvent("todoCreated", todo);
    todoListWin.addTodo(todo);
});

var TodoListWindow = require("ui/TodoListWindow");
var todoListWin = new TodoListWindow(handleTodoSelection);
var tab2 = Titanium.UI.createTab({
    icon:'KS_nav_ui.png',
    title:'List Todo',
    window:todoListWin
});

function handleTodoSelection(todo){
    //Ti.API.info('in listener in app.js');
    //Ti.API.info(todo);
    //editTodoWin.fireEvent("todoSelected", todo);
    editTodoWin.editTodo(todo);
    tabGroup.setActiveTab(0);
}

//todoListWin.addEventListener("todoSelected", selectedTodo);


tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.open();
