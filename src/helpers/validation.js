const isValidEmailRegex = RegExp(
  "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
);

export function isEmpty(val) {
  if (val === undefined || val === null) {
    return true
  }
  if (typeof val !== "string") {
    val = val.toString();
  }
  return val.trim().length === 0;
}

export function isValidEmail(val) {
  return isValidEmailRegex.test(val);
}

const isValidIntegerRegex = RegExp(
  "^-?[0-9]+$"
);

export function isInteger(val) {
  return isValidIntegerRegex.test(val);
}

const isValidPositiveIntegerRegex = /^[0-9]$/;

export function isPositiveInteger(val) {
  return isValidPositiveIntegerRegex.test(val);
}

const isValidPositiveNumberWithDecimalRegex = /^\d+(\.\d+)?$/;

export function isPositiveNumberWithDecimal(val) {
  return isValidPositiveNumberWithDecimalRegex.test(val);
}

const isValidNumberWithDecimalRegex = /^[-+]?\d+(\.\d+)?$/;

export function isNumberWithDecimal(val) {
  return isValidNumberWithDecimalRegex.test(val);
}

export function isUserValidOrganizationId(organizationId, userStore) {
  if (userStore && userStore.extendedData && userStore.extendedData.organizations && userStore.extendedData.organizations.length > 0) {
    let organizations = userStore.extendedData.organizations;
    for (let i = 0; i < organizations.length; ++i) {
      if (organizations[i].id === organizationId) {
        return true;
      }
    }
  }

  return false;
}

export function parseApiErrorParameter(error) {
  if (error === null || error === undefined) {
    return { errorCode: "", params: { default: "" } };
  }
  if (error.errorCode === null || error.errorCode === undefined) {
    let message = error.message;
    if (message === null || message === undefined) {
      message = "";
    }
    return { errorCode: "", params: { default: message } };
  }

  let errorCode = error.errorCode;
  let errorCodeSplit = errorCode.split("|");
  let errorValues;
  if (errorCodeSplit.length > 1) {
    errorValues = JSON.parse(errorCodeSplit[1]);
    errorCode = errorCodeSplit[0];
  }

  return { errorCode, params: { values: errorValues, default: error.message } };
}

export function validateErrorJsonParam(paramName, errorJson) {
  let $t = get(t);
  
  let paramExists = false;
  let touched;
  let valid;
  let error;

  if (Array.isArray(errorJson[paramName])) {
    paramExists = true;
    touched = true;
    valid = false;
    error = "";
    for (let i = 0; i < errorJson[paramName].length; ++i) {
      let errorParams = parseApiErrorParameter(errorJson[paramName][i]);
      if (error != "") {
        error += " ";
      }
      error += $t(errorParams.errorCode, errorParams.params);
    }
  }

  return { paramExists, touched, valid, error };
}