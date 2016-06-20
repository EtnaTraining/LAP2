// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function loadUsers() {
    var query = new Parse.Query(Parse.User);
    query.find({
      success: function(users) {
        // Do stuff
        var data = [];
        _.each(users, function(user) {
            data.push({
                title: user.get("username"),
                id: user.id,
                color: "black",
                hasCheck: user.id in args.currentACL});
        });
        $.userList.setData(data);
      }
    });
}


function shareWith(e){
    args.shareWith(e.rowData.id);
    $.share_todo.close();
}
