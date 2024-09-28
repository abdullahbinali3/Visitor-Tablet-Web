import { writable } from 'svelte/store';
import { generateName } from "$helpers/elements.js";

const modals = writable([]);

export default {
  subscribe: modals.subscribe,
  showModal: (icon, messages, title) => {
    let modalId = generateName();

    modals.update(items => {
      return [...items, {
        icon, messages, title, modalId
      }];
    })

    return modalId;
  },
  removeModal: modalId => {
    modals.update(items => {
      return items.filter((value, idx, arr) => {
        return value.modalId != modalId;
      });
    });
  },
  clearModals: () => {
    modals.update([]);
  }
};
