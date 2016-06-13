/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var activity_win, activity_view, activity_label;
var osname = Ti.Platform.osname;

function Activity(message) {
	activity_win = Titanium.UI.createWindow({
		backgroundColor : '#000',
		top : 0,
    fullscreen: true,
    navBarHidden: true,
		bottom : 0,
		left : 0,
		right : 0,
		opacity : 0.70,
		theme:"Theme.NoActionBar"
	});
	activity_view = Titanium.UI.createView({
		width : 280,
		height : 90,
		backgroundColor : '#000',
		borderWidth : 2,
		borderColor : '#999'
	});

        var actStyle;
        if (parseInt(Ti.version.substr(0,1))<5){
            actStyle = Ti.Platform.osname === "android" ?  Titanium.UI.ActivityIndicatorStyle.BIG : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
        } else {
            actStyle = Titanium.UI.ActivityIndicatorStyle.BIG;
        }
	var activity_indicator = Titanium.UI.createActivityIndicator({
		color : '#fff',
		style : actStyle,
		height : 20,
		width : 20,
		left : 25
	});
	activity_label = Ti.UI.createLabel({
		left : 70,
		color : '#fff',
		font : {
			fontWeight : 'bold',
			fontSize : '16'
		},
		text : message
	});
	activity_view.add(activity_label);
	activity_view.add(activity_indicator);
  activity_indicator.show();
	activity_win.add(activity_view);
};

Activity.prototype.show = function(win) {
  activity_win.open();
};
Activity.prototype.hide = function() {
	activity_win.close();
};
Activity.prototype.setMessage = function(text) {
	activity_label.text = text;
};

module.exports = Activity;
