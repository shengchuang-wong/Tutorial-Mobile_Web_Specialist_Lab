self.addEventListener('install', () => {
  console.log('install')
})

self.addEventListener('sync', event => {
  console.log('sync is triggered')
  if(event.tag === 'myFirstSync-ok') {
    console.log('executing sync function 1')
    event.waitUntil(
      console.log('executing sync function 2')
    )
  }
})