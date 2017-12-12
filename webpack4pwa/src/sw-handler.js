// self.addEventListener('push', function (event) {
//   var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
//   var title = 'Progressive Times';
//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: payload.msg,
//       url: payload.url,
//       icon: payload.icon
//     })
//   );
// });

// self.addEventListener('push', function (event) {
//   var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
//   var title = 'Progressive Times';
//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: payload.msg,
//       url: payload.url,
//       icon: payload.icon
//     })
//   );
// });
self.addEventListener('push', function (event) {
  var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
  var title = 'Progressive Times';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.msg,
      url: payload.url,
      icon: payload.icon
    })
  );
});
console.log(navigator.serviceWorker);