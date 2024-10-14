import { get } from 'svelte/store';
import organizationData from '$stores/organization-store.js'; 
import appData from "$stores/app-data-store.js";


export async function getorganizationData(id) {
  organizationData.set({ loading: true, organization: [], error: null });
  let newAppData = get(appData);
  newAppData.loginError = false;
  newAppData.initialUserLoggedInCheckDone = false;

  // Get buildings details details
  try {
    const res = await fetch(`${get(appData).apiUrl}/users/${id}/listForDropdown`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newAppData.authToken}`,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uid");
      localStorage.removeItem("organizationId");

      throw new Error("Not logged in");
    }
    if (!res.ok) {
      throw new Error("An error occurred when requesting data. Please try again.");
    }
    const data = await res.json();
    organizationData.set({ organization: data.records, loading: false, error: null }); // Update the store with API response
    return data;
  } catch (error) {
    if (error && error.message === "Not logged in") {
      return;
    }
    organizationData.set({ organization: [], loading: false, error: error.message });
  }

}