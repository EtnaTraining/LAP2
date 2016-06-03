// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//var todolist = [];
//Ti.API.info("loading todolist from Properties");
//var todolist = Ti.App.Properties.getList("todolist", [])

var db = require("/services/db");
var net = require("/services/net");

function editTodo(e) {
    var index = e.index;
    //Ti.API.info(todolist.at(index));
    var todo = todolist.at(index).toJSON();
    var todoToBeEdit = Alloy.Models.todo;
    //Ti.API.info("singleton:");
    //Ti.API.info(todoToBeEdit);
    todo.thumb = todo.filename?
        Ti.Filesystem.applicationDataDirectory +
        todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
        "/images/todo_default.png";
    todo.duedate = String.formatDate(new Date(todo.duedate), "long");
    todo.isEditable = true;
    todoToBeEdit.set(todo);
    // todoToBeEdit.set({
    //     title: todo.title,
    //     location: todo.location,
    //     alarm: todo.alarm,
    //     duedate: todo.duedate,
    //     filename: todo.filename?
    //         Ti.Filesystem.applicationDataDirectory +
    //         todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
    //         "/images/todo_default.png"
    // });
    Ti.API.info(todoToBeEdit);
    $.switchTab(0);

}

function correctPath(todo) {
    //Ti.API.info("siamo qui!!!");
    var todo = todo.toJSON();
    todo.thumb = todo.filename?
        Ti.Filesystem.applicationDataDirectory +
        todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
        "/images/todo_default.png"
    //Ti.API.info(todo);
    return todo;
}


//var todolist = Alloy.createCollection("todo");
var todolist = Alloy.Collections.todo;
todolist.fetch();
//populate();

/*$.actInd.show();
var todolist = [];
if (Ti.Network.online) {
    //net.getTodolist("pippo");
    net.getTodolist(function(data) {
        todolist = data;
        //Ti.API.info(todolist);
        populate();
        $.actInd.hide();
    });

} else {
    todolist = db.getTodolist();
    populate();
    $.actInd.hide();
}*/



// load from the database the first time
function populate() {
    var tableRows = [];
    for (var i = 0; i<todolist.length; i++) {
        var todo = todolist.at(i).toJSON();
        tableRows.push(createRow(todo));
    }
    $.lista.setData(tableRows);
    // todolist.data = todolist;
}

function createRow(todo) {
    return {
        title: todo.title,
        color: "black",
        font: {
            fontSize: 20
        },
        hasChild: true,
        leftImage: todo.filename?
            Ti.Filesystem.applicationDataDirectory +
            todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
            "/images/todo_default.png"
    };
}


$.addTodo = function(todo) {
    $.lista.appendRow(createRow(todo));
}
