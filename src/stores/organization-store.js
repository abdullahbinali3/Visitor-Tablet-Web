import { writable } from 'svelte/store';
const defaults = {
  organizations: [],
  loading: false,
  error: null,
};
const organizationData = writable(null);

export default {
  subscribe: organizationData.subscribe,
  set: organizationData.set,
  update: organizationData.update,
  reset: () => {
    organizationData.set({ ...defaults });
  },
};