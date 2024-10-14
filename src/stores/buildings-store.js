import { writable } from 'svelte/store';
const defaults = {
  buildings: [],
  loading: false,
  error: null,
};
const buildingData = writable(null);

export default {
  subscribe: buildingData.subscribe,
  set: buildingData.set,
  update: buildingData.update,
  reset: () => {
    buildingData.set({ ...defaults });
  },
};
