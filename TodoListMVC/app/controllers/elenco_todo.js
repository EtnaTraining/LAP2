// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//var todolist = [];
//Ti.API.info("loading todolist from Properties");
//var todolist = Ti.App.Properties.getList("todolist", [])

var db = require("/services/db");
var net = require("/services/net");
var TodoParse = Parse.Object.extend("Todo");

function editTodo(e) {

    var index = e.index;
    if (e.source.checkmark) {
        //Ti.API.info("sul checkmark");
        toggleTodo(index, e.source);
        return;
    }

    //Ti.API.info(todolist.at(index));
    var todo = todolist.at(index);

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
    currentTodo.clear();
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
    Ti.API.info("chiamo correctPath");
    var todoModel = todo;
    var todo = todo.toJSON();
    if (Alloy.Globals.useCloud) {
        // check if a local copy of the thumbnail exists
        todo.thumb = todo.filename && Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, todo.filename).exists() ?
            Ti.Filesystem.applicationDataDirectory + todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
            (todo.url?  todo.url : "/images/todo_default.png");
        //Ti.API.info("thumb", todo.thumb);
        if (todo.thumb == todo.url) {
            Ti.API.info("DownloadImage", todo.url, todo.filename);
            net.downloadImage(todo.filename, todo.url, function(e) {
                if (e.success) {
                    //todo.thumb = e.thumb;
                    setTimeout(function() {
                        Ti.API.info("setting thumb");
                        todoModel.set("thumb", e.thumb);
                    },1000);

                }
            });
            // the previous call is asyncronous so while it's loading will set a default img
            todo.thumb = "/images/todo_default.png";
        }



    } else {
        todo.thumb = todo.filename?
            Ti.Filesystem.applicationDataDirectory +
            todo.filename.substr(0, todo.filename.length-4) + "_thumb.jpg" :
            "/images/todo_default.png";
    }

    todo.isDone = (todo.done == "true") ? "✓" : "☐";
    //Ti.API.info(todo.done);
    //Ti.API.info(todo);
    return todo;
}


//var todolist = Alloy.createCollection("todo");
var todolist = Alloy.Collections.todo;
todolist.fetch();
Ti.API.info(todolist);

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

function deleteTodoFromParse(index) {
    if (Alloy.Globals.useCloud) {

      var toDeleteTodoParse = new TodoParse();
      var toDeleteTodoAlloy =  Alloy.Collections.todo.at(index);
      Ti.API.info(toDeleteTodoAlloy.id);
      toDeleteTodoParse.set(toDeleteTodoAlloy);
      toDeleteTodoParse.destroy({
        success: function(todoParse) {
            // The object was deleted from the Parse Cloud.
            Ti.API.info("Successfully deleted");
            Alloy.Collections.todo.remove(toDeleteTodoAlloy, {silent:true});


        },
        error: function(todoParse, error) {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
            Ti.API.info("error");
            alert(error);
        }
      });
  }
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
                 if (Alloy.Globals.useCloud) {
                     deleteTodoFromParse(e.index);
                     Alloy.Collections.todo.remove(Alloy.Collections.todo.at(e.index));
                 } else {
                     Alloy.Collections.todo.at(e.index).destroy();
                 }

            }
        });
        dialog.show();
    } else { // ON iOS
         if (Alloy.Globals.useCloud) {
             deleteTodoFromParse(e.index);
         } else {
             Alloy.Collections.todo.at(e.index).destroy();
         }
    }
}



$.addTodo = function(todo) {
    $.lista.appendRow(createRow(todo));
}

//var todoDone = false;
function toggleTodo(index, rowCheckmark){

    var selectedTodo = Alloy.Collections.todo.at(index);
    var isDone = selectedTodo.get("done");
    isDone = (isDone == "true") ? "false" : "true";
    selectedTodo.set("done", isDone);

    if (Alloy.Globals.useCloud) {
        var selectedTodoParse = new TodoParse();
        selectedTodoParse.set(selectedTodo);

        Ti.API.info(selectedTodoParse);
        selectedTodoParse.save({"done": isDone}, {
            success: function() {
                Ti.API.info("saved on parse");
            },
            error: function(todo, error) {
                Ti.API.info("error", error);
            }
        });
    } else {

        selectedTodo.save();
    }
    //e.source.text = todoDone ? "✓" : "☐";

    //todoDone = !todoDone;
}

function refresh(e){
    //Alloy.Globals.loading.show("loading", false);
    if (Alloy.Globals.useCloud) {
        Alloy.Collections.todo.reset();
        var TodoParse = Parse.Object.extend("Todo");

        var query = new Parse.Query(TodoParse);
        //query.equalTo("user", Parse.User.current());

        query.find({
          success: function(results) {

            //Ti.API.info(results.toJSON());
            //Ti.API.info("success");
            //Alloy.Collections.todo.reset();
            //Ti.API.info(typeof(results));
            Ti.API.info("Successfully retrieved", results.length );
            // Do something with the returned Parse.Object values
            var todolist = [];
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              object.set("alloy_id", object.id);
              todolist.push(object.toJSON());
              //Alloy.Collections.todo.add(object.toJSON());
            }
            Alloy.Collections.todo.reset(todolist);
            $.ptr.hide();
          },
          error: function(error) {
            Ti.API.info("Error retrieving data");
            console.log("Error: " + error.code + " " + error.message);
            //Alloy.Globals.loading.hide();
            $.ptr.hide();
          }
        });
    } else {
        $.ptr.hide();
    }

}
