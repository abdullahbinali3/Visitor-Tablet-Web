import { goto } from "@roxi/routify";
import { get } from 'svelte/store';
import { t } from "svelte-i18n";
import user from "$stores/user-store.js";
import appData from "$stores/app-data-store.js";

export async function parseResponse(res, expectBlob) {
  const responseContentType = res.headers.get("content-type");
  let responseContentData = null;
  let isJsonResponse = false;

  if (responseContentType) {
    if (responseContentType.includes("application/json") || responseContentType.includes("application/problem+json")) {
      isJsonResponse = true;
      responseContentData = await res.json();
    } else if (expectBlob === true) {
      responseContentData = await res.blob();
    }
    else {
      responseContentData = await res.text();
    }
  }

  if (res.status === 404) {
    let $t = get(t);
    throw new Error($t("error.requestError404"));
  }

  if (res.status === 401) {
    // Set session expired flag in app data so we can show the
    // appropriate message on login screen.
    appData.update(function (data) {
      let newData = { ...data };
      newData.sessionExpired = true;
      return newData;
    });

    // Clear user data
    user.set({ isLoggedIn: false, userData: null });

    // Redirect to login page
    try {
      let $goto = get(goto);
      $goto("/login", {}, true);
    }
    catch { }

    // throw error so caller stops parsing response
    let $t = get(t);
    throw new Error($t("error.sessionExpired"));
  }

  // Check for Forbidden response
  if (res.status === 403 && (!isJsonResponse || !responseContentData.errorMessages || responseContentData.errorMessages.length === 0)) {
    let $t = get(t);
    throw new Error($t("error.doNotHavePermission"));
  }

  return Promise.all([res, res.status === 204 ? null : responseContentData])
}

export function throwOnFetchError(res, data) {
  if (!res.ok) {
    if (!data) {
      let $t = get(t);
      throw new Error($t("error.unknown.emptyResponse"));
    }

    const responseContentType = res.headers.get("content-type");
    if (responseContentType && (responseContentType.includes("application/json") || responseContentType.includes("application/problem+json"))) {
      if (data.errorMessages) {
        throw new Error(JSON.stringify(data.errorMessages));
      }
      throw new Error(JSON.stringify(data));
    }
    else {
      throw new Error(data);
    }
  }
}

// code from: https://plainenglish.io/blog/how-to-download-a-file-using-javascript-fec4685c0a22
// modified by shane to use parseResponse() and throwOnFetchError()
export function downloadFile(url, params, fallbackFileName) {
  return fetch(url, params)
    .then((res) => {
      return parseResponse(res, true)
    })
    .then(([res, blobData]) => {
      throwOnFetchError(res, blobData);

      let contentDisposition = res.headers.get('content-disposition');
      let fileName = fallbackFileName;

      // Specify default fallback filename if none given
      if (fileName === null || fileName === undefined || fileName === "") {
        fileName = "Download";
      }

      // Parse filename from Content-Disposition header
      if (contentDisposition) {
        // Try using UTF-8 filename first
        let utf8Filename = contentDisposition.split("filename*=UTF-8''");

        if (utf8Filename.length === 2) {
          fileName = decodeURIComponent(utf8Filename[1]);
        }
        else {
          // Parse regular filename if UTF-8 filename not present
          fileName = contentDisposition.split('filename=')[1].split(';')[0];

          // If filename in content-disposition header has double quotes, remove them.
          if (fileName.length > 2) {
            if (fileName[0] === '"' && fileName[fileName.length - 1] === '"') {
              fileName = fileName.substring(1, fileName.length - 1);
            }
          }
        }
      }

      // Download file
      const aElement = document.createElement("a");
      aElement.setAttribute("download", fileName);
      const href = URL.createObjectURL(blobData);
      aElement.href = href;
      aElement.setAttribute("target", "_blank");
      aElement.click();
      URL.revokeObjectURL(href);
    });
}