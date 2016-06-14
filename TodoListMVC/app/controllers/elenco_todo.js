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

    //Ti.API.info(todo);
    var currentTodo = Alloy.Models.todo;

    //Ti.API.info("singleton:");
    //Ti.API.info(todoToBeEdit);
    // todo.thumb = todo.filename?
    //     Ti.Filesystem.applicationDataDirectory +
    //     todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
    //     "/images/todo_default.png";
    //todo.duedate = String.formatDate(new Date(todo.duedate), "long");

    //todo.isEditable = true;
    currentTodo.set(todo);
    currentTodo.trigger("edit");
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
    //Ti.API.info(todoToBeEdit);
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

function deleteTodo(e) {
    //Ti.API.info(e);
    if (OS_ANDROID) {
        var dialog = Ti.UI.createAlertDialog({
            cancel: 1,
            buttonNames: ['Confirm', 'Cancel'],
            message: 'Would you like to delete the todo?',
            title: 'Delete'
        });
        dialog.addEventListener('click', function(ev){
            if (ev.index === 0){
                Alloy.Collections.todo.at(e.index).destroy();
            }
        });
        dialog.show();
    } else {
      if (Alloy.Globals.useCloud) {
        var TodoParse = Parse.Object.extend("Todo");
        var toDeleteTodoParse = new TodoParse();
        var toDeleteTodoAlloy =  Alloy.Collections.todo.at(e.index);
        Ti.API.info(toDeleteTodoAlloy.id);
        toDeleteTodoParse.set(toDeleteTodoAlloy);
        toDeleteTodoParse.destroy({
          success: function(todoParse) {
              // The object was deleted from the Parse Cloud.
              Ti.API.info("Successfully deleted");
              Alloy.Collections.todo.remove(toDeleteTodoAlloy);
          },
          error: function(todoParse, error) {
              // The delete failed.
              // error is a Parse.Error with an error code and message.
              Ti.API.info("error");
              alert(error);
          }
        });
      } else {
        Alloy.Collections.todo.at(e.index).destroy();
      }

    }

}



$.addTodo = function(todo) {
    $.lista.appendRow(createRow(todo));
}
