import { get } from 'svelte/store';
import appData from "$stores/app-data-store.js";
import user from "$stores/user-store.js";
import { parseResponse } from "$helpers/parseResponse.js";

export function sessionLogout() {
  let newAppData = get(appData);
  newAppData.loginError = null;
  newAppData.authToken = null;
  newAppData.initialUserLoggedInCheckDone = true;
  appData.set(newAppData);

  user.set({ isLoggedIn: false });

  localStorage.removeItem("authToken");
  localStorage.removeItem("uid");
  localStorage.removeItem("organizationId");
  localStorage.removeItem("buildingId");
}

export function sessionLogin(email, password) {
  return fetch(`${get(appData).apiUrl}/auth/passwordLoginJwtTablet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(res => Promise.all([res, res.status === 204 ? null : res.json()]))
    .then(async ([res, data]) => {
      if (!res.ok) {
        user.set({ isLoggedIn: false });

        if (data && data.errorMessages) {
          throw new Error(
            JSON.stringify(data.errorMessages)
          );
        }

        throw new Error(
          "An error occurred when requesting data. Please try again."
        );
      }

      let newAppData = get(appData);
      newAppData.authToken = data.accessToken;
      appData.set(newAppData);

      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("uid", data.userId); // FastEndpoints response uses "userId", not "uid"
      await getUserData();
      return get(user);
    })
    .catch(err => {
      user.set({ isLoggedIn: false });
      throw err;
    });
}

export function getUserData() {
  let newAppData = get(appData);
  newAppData.loginError = false;
  newAppData.initialUserLoggedInCheckDone = false;

  // Get user profile details
  return fetch(`${newAppData.apiUrl}/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${newAppData.authToken}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("uid");
        localStorage.removeItem("organizationId");
        localStorage.removeItem("buildingId");

        throw new Error("Not logged in");
      }
      if (!res.ok) {
        throw new Error("An error occurred when requesting data. Please try again.");
      }

      return res.json();
    })
    .then((data) => {
      if (data && data.disabled) {
        newAppData.noPortalAccess = true;
        noAccessErrorMessage = "The user account has been disabled by an administrator.";
        return;
      }

      data.timezone = data.timezone || "Australia/Melbourne";

      user.set({
        isLoggedIn: true,
        userData: data
      });
    })
    .catch((error) => {
      if (error && error.message === "Not logged in") {
        return;
      }

      newAppData.loginError = error;
    })
    .finally(() => {
      newAppData.initialUserLoggedInCheckDone = true;
      appData.set(newAppData);
    });
}