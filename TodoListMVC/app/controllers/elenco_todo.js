// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//var todolist = [];
//Ti.API.info("loading todolist from Properties");
//var todolist = Ti.App.Properties.getList("todolist", [])

var db = require("services/db");
var todolist = db.getTodolist();

// load from the database the first time
var tableRows = [];
Ti.API.info(todolist);
for (var i = 0; i<todolist.length; i++) {
    var row = {
        title: todolist[i].title,
        color: "black",
        font: {
            fontSize: 20
        },
        hasChild: true,
        leftImage: Ti.Filesystem.applicationDataDirectory + todolist[i].thumb
    };
    tableRows.push(row);
}
$.lista.setData(tableRows);
// todolist.data = todolist;


$.addTodo = function(todo) {
    todolist.push(todo);
    Ti.App.Properties.setList("todolist", todolist);

    var row = {
        title: todo.title,
        color: "black",
        font: {
            fontSize: 20
        },
        hasChild: true,
        leftImage: Ti.Filesystem.applicationDataDirectory + todo.thumb
    };
    Ti.API.info(row);

    $.lista.appendRow(row);
}
