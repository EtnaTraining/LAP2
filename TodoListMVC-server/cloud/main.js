
Parse.Cloud.define('hello', function(req, res) {
  console.log("ciao");
  console.error("bye");
  res.success('Hi');
});

Parse.Cloud.define('notifyUser', function(req, res) {
  console.log("ciao");
  console.error("bye");
  var userId = req.params.userId;
  var todoId = req.params.todoId;
  console.log("userId", userId);
  console.log("todoId", todoId);
  Parse.Push.send({
      where: {
            user: {
                __type: "Pointer",
                className: "_User",
                objectId: userId
            }
      },
      data: {
        alert: "Nuova todo in arrivo!!",
        objectId: todoId
      }
    }, {
      useMasterKey: true,
      success: function() {
        // Push was successful
        console.log("we pushed!!");
      },
      error: function(error) {
        // Handle error
        console.log("Some error occurrd");
        console.log(error);
      }
    });
  res.success(true);
});


// Parse.Cloud.afterSave("Todo", function(request) {
//   // query = new Parse.Query("Post");
//   // query.get(request.object.get("post").id, {
//   //   success: function(post) {
//   //     post.increment("comments");
//   //     post.save();
//   //   },
//   //   error: function(error) {
//   //     console.error("Got an error " + error.code + " : " + error.message);
//   //   }
//   // });
//   console.log("ho salvato una Todo");
//   Parse.Push.send({
//       channels: [""],
//       data: {
//         alert: "Nuova todo in arrivo!!"
//       }
//     }, {
//       useMasterKey: true,
//       success: function() {
//         // Push was successful
//         console.log("we pushed!!");
//       },
//       error: function(error) {
//         // Handle error
//         console.log("Some error occurrd");
//         console.log(error);
//       }
//     });
// });
