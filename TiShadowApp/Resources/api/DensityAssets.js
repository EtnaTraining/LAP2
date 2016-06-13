/*
 * Copyright (c) 2011-2014 YY Digital Pty Ltd. All Rights Reserved.
 * Please see the LICENSE file included with this distribution for details.
 */

var  os = Ti.Platform.osname;

// Density image setup for android
if (os === "android") {
  var density_orientation = (Ti.Gesture.orientation === Ti.UI.LANDSCAPE_LEFT) ? "land" : "port",
    density_folders = (function () {

    var folders = [],
      ratio = ((Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.platformHeight) < ((density_orientation === "land") ? (320 / 240) : (240 / 320))) ? "long" : "notlong",
      logicalDensityFactor = Ti.Platform.displayCaps.logicalDensityFactor,
      density;

    if (logicalDensityFactor <= 0.75) {
      density = "ldpi";
    } else if (logicalDensityFactor <= 1.0) {
      density = "mdpi";
    } else if (logicalDensityFactor <= 1.5) {
      density = "hdpi";
    } else if (logicalDensityFactor <= 2.0) {
      density = "xhdpi";
    } else if (logicalDensityFactor <= 3.0) {
      density = "xxhdpi";
    } else {
      density = "xxxhdpi";
    }

    folders.push("res-" + ratio + "-%ORIENTATION%-" + density);
    folders.push("res-%ORIENTATION%-" + density);
    folders.push("res-" + density);

    if (density === "ldpi") {
      folders.push("low");
    } else if (density === "mdpi") {
      folders.push("medium");
    } else if (density === "hdpi") {
      folders.push("high");
    }

    folders.push("res-mdpi");
    folders.push("");

    return folders;
  })();

  Ti.Gesture.addEventListener("orientationchange", function (e) {
    density_orientation = (e.orientation === Ti.UI.LANDSCAPE_LEFT) ? "land" : "port";
  });
}

function injectSuffix(file, suffix) {
  var file_parts = file.split(".");
  var ext = file_parts.pop();
  return file_parts.join(".") + suffix + "." + ext;
}

//density files only for png files
exports.find = function(file) {
  //iOS (HD) Retina Check
  if ((os === "ipad" || os === "iphone")) {
    if (Ti.Filesystem.getFile(file).exists()) {
      return file;
    }
    // if retina only provided - this is needed even for non-retina devices...
    var ret_file_name = injectSuffix(file, "@2x");
    if (Ti.Filesystem.getFile(ret_file_name).exists()) {
      return ret_file_name;
    }
    var rethd_file_name = injectSuffix(file, "@3x");
    if (Ti.Filesystem.getFile(rethd_file_name).exists()) {
      return rethd_file_name;
    }
  } else if (os === "android") {
    if (typeof file !== "string") {
      return null;
    }
    var file_parts = file.split("/");
    file_parts.splice(file_parts.length -1, 0, "%FOLDER%");
    var d_file_name = file_parts.join("/");
    var do_file_name;

    for (i in density_folders) {
      do_file_name = d_file_name.replace("%FOLDER%", density_folders[i].replace('%ORIENTATION%', density_orientation));
      do9_file_name = injectSuffix(do_file_name, '.9');
      if (Ti.Filesystem.getFile(do_file_name).exists() || Ti.Filesystem.getFile(do9_file_name).exists()) {
        return do_file_name;
      }
    }
  }
  return null;
};

