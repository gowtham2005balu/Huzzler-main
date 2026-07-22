export function addNotification(setNotifications, title, body) {
  setNotifications(prev => [
    { title, body, createdAt: new Date() },
    ...prev,
  ]);
}

export function clearNotifications(setNotifications) {
  setNotifications([]);
}
