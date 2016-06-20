

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
    Ti.API.info("filename:", filename);
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

exports.downloadImage = function(localFilename, url, _callback) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function(e) {
        if (e.success) {
            var imgBlog = xhr.responseData;
            var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, localFilename);
            f.write(imgBlog);
            var thumb = localFilename.substr(0, localFilename.length-4) + "_thumb.jpg";
            Ti.API.info(thumb);
            var ft = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, thumb);
            ft.write(imgBlog.imageAsThumbnail(60,0, 30));
            Ti.API.info("done");
            f = null;
            tf = null;
            _callback({success: true, thumb: thumb});
        }
    };
    xhr.onerror = function(e) {
        alert("some error occured on the server");
        Ti.API.info(e);
        _callback({success: false, error: e.error });
    };
    xhr.open("GET", url);
    xhr.send();
}

exports.subscribeForPush = function(channels, deviceToken, deviceType, userId, _callback) {
    var xhr = Ti.Network.createHTTPClient();
    var url = Alloy.CFG.parseOptions.parseServerURL + "/installations/";
    xhr.onload = function(e) {
        if (e.success) {
            Ti.API.info(xhr.responseText);

        }
    };
    xhr.onerror = function(e) {
        alert("some error occured on the server");
        Ti.API.info(e);
    };
    xhr.open("POST", url);
    xhr.setRequestHeader("X-Parse-Application-Id", Alloy.CFG.parseOptions.applicationId);
    xhr.setRequestHeader("Content-Type",  "application/json");
    var options = {
        deviceType: deviceType,
        deviceToken: deviceToken,
        pushType: "gcm",
        channels: [""],
        user: {
            __type: "Pointer",
            className: "_User",
            objectId: userId
        }
    };
    Ti.API.info(options);
    xhr.send(JSON.stringify(options));
}
