

var url = "https://6fd6170b9a42d16f84226e323f57a7cf4289c1b4.cloudapp.appcelerator.com";
var uuid = Ti.App.Properties.getString("uuid", "");
if (!uuid) {
    Ti.App.Properties.setString("uuid", Ti.Platform.createUUID());
}
Ti.API.info("uuid: " + uuid);


exports.getTodolist = function(_callback) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function() {
        var todolist = JSON.parse(xhr.responseText).data;
        //Ti.API.info(todolist);
        _callback(todolist);
    };
    xhr.onerror = function(e) {
        alert("some error occured on the server");
        Ti.API.info(e);
        _callback(null, {"error": "something went wrong"});
    };
    xhr.open("GET", url + "/" + uuid);
    xhr.send();
};

exports.saveTodo = function(todo) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function() {
        Ti.API.info(xhr.responseText);
    };
    xhr.onerror = function(e) {
        alert("some error occured on the server");
        Ti.API.info(e);
    };
    xhr.open("POST", url + "/" + uuid);
    xhr.send(todo);
};
