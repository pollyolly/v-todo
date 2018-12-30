const LocalNotifications = require("nativescript-local-notifications").LocalNotifications

const notif = {
    setNotif: function(id, title, body, ticker, at) {
        LocalNotifications.schedule([{
            id: id,
            title: title,
            body: body,
            bigTextStyle: true, // Adds an 'expansion arrow' to the notification (Android only)
            sound: null,
            ticker: ticker,
            at: new Date(new Date(at).getTime())
          }]).then(function() {
                console.log("Scheduled: " + title);
              },
              function(error){
                console.log("scheduling error: " + error);
              }
          )
    },
    unsetNotif: function(id){
        LocalNotifications.cancel(id).then(
            function(foundAndCanceled) {
                if (foundAndCanceled) {
                  console.log("OK, it's gone!");
                } else {
                  console.log("ID "+id+" was not found.");
                }
            }
        )
    },
    unsetNotifAll: function() {
        LocalNotifications.cancelAll();
    },
    receiveNotif: function() {
        LocalNotifications.addOnMessageReceivedCallback(
            function (notification) {
                alert({
                    title: notification.title,
                    message: notification.body,
                    okButtonText: "Copy!"
                });
            }
        ).then(
            function() {
              console.log("Listener added");
            }
        )
    },
    getNotif: function() {
        LocalNotifications.getScheduledIds().then(
            function(ids) {
              console.log("ID's: " + ids);
            }
        )
    },
    reqPermission: function() {
        LocalNotifications.requestPermission().then(
            function(granted) {
              console.log("Permission granted? " + granted);
            }
        )
    },
    checkPermission: function() {
        LocalNotifications.hasPermission().then(
            function(granted) {
              console.log("Permission granted? " + granted);
            }
        )
    }
}
export default notif