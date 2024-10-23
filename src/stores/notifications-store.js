import { writable } from 'svelte/store';
import { generateName } from "$helpers/elements.js";

const notifications = writable([]);

export default {
  subscribe: notifications.subscribe,
  showNotification: (icon, messages, title) => {
    let notificationId = generateName();

    notifications.update(items => {
      return [...items, {
        icon, messages, title, notificationId
      }];
    })

    return notificationId;
  },
  removeNotification: notificationId => {
    notifications.update(items => {
      return items.filter((value) => {
        return value.notificationId != notificationId;
      });
    });
  },
  clearNotifications: () => {
    notifications.update([]);
  }
};
