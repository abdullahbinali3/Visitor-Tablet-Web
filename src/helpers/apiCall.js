import { get } from "svelte/store";
import appData from "$stores/app-data-store.js";

//common function for all the api in which we just pass header,body,url and tell the method according to our api
export async function fetchApi(url, method, body = null, headers = {}) {
  let newAppData = get(appData);
  newAppData.loginError = false;
  newAppData.initialUserLoggedInCheckDone = false;
  const defaultHeaders = {
    Authorization: `Bearer ${newAppData.authToken}`,
    ...headers,
  };

  try {
    const res = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uid");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("buildingId");
      throw new Error("Not logged in");
    }

    if (!res.ok) {
      const errorText = await res.text(); // Capture error response
      throw new Error(`An error occurred: ${errorText}`);
    }

    return await res.json(); // Return the parsed JSON data
  } catch (error) {
    throw error; // Propagate the error for handling in the calling function
  }
}
