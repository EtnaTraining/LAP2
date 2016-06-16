

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

exports.fileUpload = function(filename, _callback) {
    var xhr = Ti.Network.createHTTPClient();
    var url = Alloy.CFG.parseOptions.parseServerURL + "/files/" + filename;
    xhr.onload = function(e) {
        if (e.success) {
            var uploadUrl = JSON.parse(xhr.responseText).url;
            Ti.API.info(uploadUrl);
            _callback({success: true, url: uploadUrl});
        }
    };
    xhr.onerror = function(e) {
        alert("some error occured on the server");
        Ti.API.info(e);
    };
    xhr.open("POST", url);
    xhr.setRequestHeader("X-Parse-Application-Id", Alloy.CFG.parseOptions.applicationId);
    xhr.send(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename));
}
