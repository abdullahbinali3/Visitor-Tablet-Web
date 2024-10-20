import buildingData from '$stores/buildings-store.js'; 
import { fetchApi } from './apiCall.js'; 
const server_URL ="http://localhost:5695"

// api calling for saving getting building according to the organizations
export async function getbuildingData(id){
  buildingData.set({ loading: true, buildings: [], error: null });
  const url = `${server_URL}/visitorTablet/buildings/${id}/list`;

  try {
    const data = await fetchApi(url, "GET"); 
    buildingData.set({ buildings: data, loading: false, error: null });
    buildingData.subscribe(value => {
      console.log('Updated buildingData:', value);
    })();
    return data;
  } catch (error) {
    if (error.message === "Not logged in") {
      return; 
    }
    buildingData.set({ buildings: [], loading: false, error: error.message });
    buildingData.subscribe(value => {
      console.log('Error buildingData:', value);
    })();
  }
}

// Api calling for submission of register data
export async function postVisitorData(body ,header){
  try {
    const data = await fetchApi(`${server_URL}/visit/register`, "POST" , body , header ); 
    return data;
  } catch (error) {
    return error
  }
}

// api calling for getting hosts name
export async function getHosts(id) {
  try {
    const data = await fetchApi(`${server_URL}/host/${id}/listForDropdown`, "GET"  ); 
    return data;
  } catch (error) {
    return error
  }
  
}

// api calling for getting Vistors using host id
export async function getVisitorByHostIds(id) {
  try {
    const data = await fetchApi(`${server_URL}/visitor/${id}/listForDropdown`, "GET"  ); 
    return data;
  } catch (error) {
    return error
  }
  
}

export async function postSignIn(body ,header) {
  try {
    const data = await fetchApi(`${server_URL}/visitor/signin`, "PUT" , body ,header ); 
    return data;
  } catch (error) {
    return error
  }
  
}

export async function postSignOut(body ,header) {
  try {
    const data = await fetchApi(`${server_URL}/visitor/signout`, "PUT" , body ,header ); 
    return data;
  } catch (error) {
    return error
  }
  
}