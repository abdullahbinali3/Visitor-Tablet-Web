import { writable } from 'svelte/store';

const defaults = {
  isLoggedIn: false,
  userData: null
};

const user = writable({ ...defaults });

export default {
  subscribe: user.subscribe,
  set: user.set,
  update: user.update,
  reset: () => {
    user.set({ ...defaults });
  }
};
