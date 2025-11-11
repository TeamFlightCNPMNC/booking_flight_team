function showNotification(title, message) {
  console.log(title, message);

  if (!("Notification" in window)) {
    console.warn("Trình duyệt không hỗ trợ Notification API.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: message });
      }
    });
  }
}
export default showNotification;
