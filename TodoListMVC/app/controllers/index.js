$.index.open();
//$.index.setActiveTab(1);

//var tab1 = $.index.tabs[0];
//var tab2 = $.index.tabs[1];

//$.editTodoCtrl.currentTab = tab1;
$.editTodoCtrl.openWindow = function(win) {
    $.index.activeTab.open(win);
}

//$.editTodoCtrl.addTodo = $.listTodoCtrl.addTodo;

function addTodo(todo) {
    $.listTodoCtrl.addTodo(todo);
    $.index.setActiveTab(1);
}

$.editTodoCtrl.addTodo = addTodo;

function switchTab(tabNum) {
    $.index.setActiveTab(tabNum);
}

$.editTodoCtrl.switchTab = $.listTodoCtrl.switchTab = switchTab;

function showLogin() {
  var loginWinCtrl = Alloy.createController("login");
  var loginWin = loginWinCtrl.getView();
  if (OS_IOS) {
    var navWin = Ti.UI.iOS.createNavigationWindow({
      window: loginWin,
      modal: true
    });
    loginWinCtrl.closeNav = function() {
      navWin.close();
    }
    navWin.open();
  } else {
    loginWin.open();
  }
}

$.editTodoCtrl.showLogin = showLogin;


showLogin();
//switchTab(1);

$.editTodoCtrl.showLogin = showLogin;


if (OS_ANDROID) {
    var gcm = require('ti.goosh');
    Ti.API.info("registeringForPushNotifications");
    gcm.registerForPushNotifications({

        senderId: '602715859242',
        // The callback to invoke when a notification arrives.
        callback: function(e) {

            //var data = JSON.parse(e.data || '');
            //var notification = JSON.parse(e.notification || '');
            Ti.API.info(e);
            alert(e);
            var todoId = JSON.parse(e.data).objectId;
            var TodoParse = Parse.Object.extend("Todo");
            var newTodoParse = new TodoParse();
            newTodoParse.set({id: todoId});
            newTodoParse.fetch({
                success: function(todo) {
                    Ti.API.info("todo recuperata:");
                    Ti.API.info(todo);
                    todo.set("alloy_id", todoId);
                    Alloy.Collections.todo.add(todo.toJSON());
                },
                error: function(todo, error) {
                    Ti.API.info("error trying to retrieve the todo", todoId);
                    Ti.API.info(error);
                }
            });

            // faccio la query e recupero la todo e la aggiungo alla collections!
            //alert(data);

        },

        // The callback invoked when you have the device token.
        success: function(e) {

            // Send the e.deviceToken variable to your PUSH server
            Ti.API.log('Notifications: device token is ' + e.deviceToken);
            Ti.App.Properties.setString("deviceToken", e.deviceToken);

        },

        // The callback invoked on some errors.
        error: function(err) {
            Ti.API.error('Notifications: Retrieve device token failed', err);
        }
    });
}

function share(e){
    // se non c'è selezionata alcuna todo non
    if (Alloy.Models.todo.id) {
        $.editTodoCtrl.share();
    } else {
        alert("select some todo first");
    }

}
