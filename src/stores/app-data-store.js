import { writable } from 'svelte/store';

export default writable({
  apiUrl: "http://localhost:5695", // dev
  //apiUrl: "https://example.oraclecms.com/api", // live
  //apiUrl: "https://examplestaging.oraclecms.com/api", // staging
  initialUserLoggedInCheckDone: false,
  loginError: false,
  sessionExpired: false,
  authToken: null,
  language: "en-AU"
});
