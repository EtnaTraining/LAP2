
Parse.Cloud.define('hello', function(req, res) {
  console.log("ciao");
  console.error("bye");
  res.success('Hi');
});
