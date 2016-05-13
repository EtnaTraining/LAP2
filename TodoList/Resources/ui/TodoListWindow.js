
var todolist = [];

var tv = Ti.UI.createTableView({
    data: todolist
});

// Ti.App.addEventListener("todoCreated", function(todo) {
//     //Ti.API.info('sono qui');
//     todolist.push(todo);
//     tv.setData(todolist);
// });

function addTodo(todo) {
//   Ti.API.info('sono qui');
     todo.color = "black";
     todo.rowHeight = 60;
     todolist.push(todo);
     tv.setData(todolist);
}


function TodoListWindow(/* */ _handleTodoSelection) {
    var win = Ti.UI.createWindow({
        backgroundColor: "white"
    });

    win.add(tv);
    win.addEventListener("todoCreated", addTodo);

    tv.addEventListener("click", function(e) {
        //Ti.API.info(e.)
        var selectedTodo = todolist[e.index];
        //Ti.API.info(selectedTodo);
        //win.fireEvent("todoSelected", selectedTodo);
        _handleTodoSelection(selectedTodo);
    });
    win.addTodo = addTodo;

    return win;
}




module.exports = TodoListWindow;
