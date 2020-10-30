// self.addEventListener('fetch', (event) => {
//   console.log('[Custom service worker] fetching resources');
//   event.respondWith(fetch(event.request));
// })

self.addEventListener('push', (event) => {
  console.log('Notification received', event);

  let data = {
    title: 'New notification',
    content: 'You have new notifications',
    openUrl: '/'
  }

  if(event.data) {
    data = JSON.parse(event.data.text());
  }

  const options = {
    body: data.content,
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    data: {
      url: data.openUrl
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  if(action === 'confirm') {
    console.log('Notification confirmed');
  } else {
    console.log(action);
    clients.matchAll()
      .then((clis) => {
        const client = clis.find(c => {
          return c.visibilityState === 'visible';
        })
        
        if(client !== undefined) {
          client.navigate(notification.data.url);
        } else {
          clients.openWindow(notification.data.url);
        }
      })
  }
  notification.close();
})