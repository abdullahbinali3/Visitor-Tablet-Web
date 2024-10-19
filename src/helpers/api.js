import buildingData from "$stores/buildings-store.js";
import { fetchApi } from "./apiCall.js";
const server_URL = "http://localhost:5695";

// api calling for saving getting building according to the organizations
export async function getbuildingData(id) {
  buildingData.set({ loading: true, buildings: [], error: null });
  const url = `${server_URL}/buildings/${id}/listForDropdown`;

  try {
    const data = await fetchApi(url, "GET");
    buildingData.set({ buildings: data.records, loading: false, error: null });
    buildingData.subscribe((value) => {
      console.log("Updated buildingData:", value);
    })();
    return data;
  } catch (error) {
    if (error.message === "Not logged in") {
      return;
    }
    buildingData.set({ buildings: [], loading: false, error: error.message });
    buildingData.subscribe((value) => {
      console.log("Error buildingData:", value);
    })();
  }
}

// Api calling for submission of register data
export async function postVisitorData(body, header) {
  try {
    const data = await fetchApi(
      `${server_URL}/visit/register`,
      "POST",
      body,
      header
    );
    return data;
  } catch (error) {
    return error;
  }
}

// api calling for getting hosts name
export async function getHosts(id) {
  try {
    const data = await fetchApi(
      `${server_URL}/users/${id}/listForDropdown`,
      "GET"
    );
    return data;
  } catch (error) {
    return error;
  }
}
