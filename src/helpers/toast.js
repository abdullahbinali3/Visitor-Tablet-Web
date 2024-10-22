import notificationStore from "$stores/notifications-store.js";
let notificationId;
export function triggerToast(icon ,message ,title) {
  console.log("object");
   notificationId = notificationStore.showNotification(title, message, icon);
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Optionally, remove the notification after some time
  setTimeout(() => {
    notificationStore.removeNotification(notificationId);
  }, 5000); // Example timeout
}