if(navigator.serviceWorker){
    navigator.serviceWorker.register("./sw.js").then((res) => {
        console.log("Service Worker Registered Successsfully")
    }).catch(err => {
        console.error("Error registering service worker", err)
    })
}