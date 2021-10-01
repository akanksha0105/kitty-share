const { register } = require("./serviceWorkerRegistration");

const ignored = self.__WB_MANIFEST;
console.log("I am there. My name is Service Worker");

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.text();

    console.log("What the heck is event object here");
    console.log(data);
    console.log("Push event!! ", data);

    self.registration.showNotification(data.title, {
      body: "221B Baker Street",
    });
  } else {
    console.log("Push event but no data");
  }
});
