import { writable } from 'svelte/store';

const buildingData = writable({
    loading: true,
    error: null,
    buildings: [],
});
export default buildingData;
