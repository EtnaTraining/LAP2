$.index.open();
//$.index.setActiveTab(1);

//var tab1 = $.index.tabs[0];
//var tab2 = $.index.tabs[1];

//$.editTodoCtrl.currentTab = tab1;
$.editTodoCtrl.openWindow = function(win) {
    $.index.activeTab.open(win);
}

//$.editTodoCtrl.addTodo = $.listTodoCtrl.addTodo;

function addTodo(todo) {
    $.listTodoCtrl.addTodo(todo);
    $.index.setActiveTab(1);
}

$.editTodoCtrl.addTodo = addTodo;

function switchTab(tabNum) {
    $.index.setActiveTab(tabNum);
}

$.editTodoCtrl.switchTab = $.listTodoCtrl.switchTab = switchTab;
