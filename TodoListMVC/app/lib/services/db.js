
var db = Ti.Database.open("ToDoDB");
db.execute("CREATE TABLE IF NOT EXISTS todolist(id INTEGER PRIMARY KEY, title TEXT, location TEXT, alarm INTEGER, dueDate TEXT)");
db.close();


exports.getTodolist = function() {
    var todolist = [];
    var db = Ti.Database.open("ToDoDB");
    var result = db.execute("SELECT * FROM todolist");
    for (var i=0, j=result.rowCount ; i < j; i++) {
    	var todo = {};
    	todo.title = result.fieldByName("title");
    	todo.location = result.fieldByName("location");
    	todo.alarm = result.fieldByName("alarm");
    	todo.dueDate = result.fieldByName("dueDate");
    	todo.hasChild = true;
    	todolist.push(todo);
    	result.next();
    }
    db.close();
    return todolist;
};


exports.saveTodo = function(todo) {
    var db = Ti.Database.open("ToDoDB");
    db.execute("INSERT INTO todolist(title, location, alarm, duedate)
        VALUES (?, ?, ?, ?)", todo.title, todo.location, todo.alarm, todo.duedate);
    db.close();
};
