curl -X POST \
  -H "X-Parse-Application-Id: TodoListMVC20160611" \
  -H "Content-Type: application/json" \
  -d '{ "movie": "The Matrix" }' \
  https://todolistmvc-lap2.rhcloud.com/parse/functions/hello





curl -X POST \
  -H "X-Parse-Application-Id: TodoListMVC20160611" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceType": "android",
    "deviceToken": "eMjJZ5I-H7s:APA91bFbEBaf1bEdAh5wV5nAyX3jshBsxVDfCOG3fDlykFCFLRu9WliYDC8plTvl6-O__4GLW2BMJN6Q5YjuhDELobJR4HnrbuCggI979CON1JT__qyyfx6KRAGqCkXxiS4Uz8BhPZrT",
    "pushType": "gcm",
    "user": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "Ozd2TYYxuU"
    }
}' \
  https://todolistmvc-lap2.rhcloud.com/parse/installations

  curl -X POST \
    -H "X-Parse-Application-Id: TodoListMVC20160611" \
    -H "X-Parse-Master-Key: 4h5igh24igh2h4g2h54igh2i45hg2i5hgiu245hgi2h54gih5gi2h54iguerg3ihg35" \
    -H "Content-Type: application/json" \
    -d '{
        "channels": [""],
        "data": {
            "alert": "Saluti dal DMI ultima lezione"
          }
        }' \
    https://todolistmvc-lap2.rhcloud.com/parse/push

curl -X POST \
  -H "X-Parse-Application-Id: TodoListMVC20160611" \
  -H "X-Parse-Master-Key: 4h5igh24igh2h4g2h54igh2i45hg2i5hgiu245hgi2h54gih5gi2h54iguerg3ihg35" \
  -H "Content-Type: application/json" \
  -d '{
      "where": {
            "user": {"__type":"Pointer","className":"_User","objectId":"Ozd2TYYxuU"}},
      "data": {
          "alert": "The Giants scored a run! The score is now 2-2."
        }
      }' \
  https://todolistmvc-lap2.rhcloud.com/parse/push
