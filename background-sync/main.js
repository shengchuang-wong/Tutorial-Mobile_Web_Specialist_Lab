navigator.serviceWorker.register('sw.js')

// navigator.serviceWorker.ready.then(swReg => {
//   return swReg.sync.register('myFirstSync')
// })

if('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(reg => {
    return reg.sync.register('myFirstSync-ok')
  })
  .catch(() => {
    // system was unable to register for a sync.
    // this could be an OS-level restriction
    // doSomething()
    console.log('something wrong while resiger sync')
  })
} else {
  // service worker/sync no supported
  console.log('Service worker or sync manager is not supported')
}