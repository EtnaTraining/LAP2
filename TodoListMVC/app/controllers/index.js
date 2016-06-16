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
