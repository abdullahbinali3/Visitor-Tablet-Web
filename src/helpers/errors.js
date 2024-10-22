import {isPhoneValid ,isValidEmail ,validateDates} from "./validation"
export function validateVisitorForm(visitors) {
  let errors = {}; // Object to hold validation errors
  if (!visitors) {
    return { isValid: false, errors: { form: "Form data is not available." } };
}

  // Validate date ranges

  // Check required fields in the visitors object one by one
  for (const key of Object.keys(visitors ||{})) {
    if (key !== "users" && !visitors[key]) {
        errors[key] = `${key} is required.`;
        return { valid: false, errors };
    }
}


  if (!validateDates(visitors)) {
    errors.dates = "Start date must be earlier than end date.";
    return { valid: false, errors };
}
 
  if (Object.keys(errors).length > 0) {
      return { valid: false, errors };
  }

  return { valid: true, errors: {} };
}

export function validateUserForm(userFields) {
    let errors = {}; // Object to hold validation errors
    if (!userFields) {
      return { isValid: false, errors: { form: "Form data is not available." } };
  }
  
    // Validate email
    if (userFields.email && !isValidEmail(userFields.email)) {
        errors.email = "Invalid email address.";
        return { valid: false, errors };
    }
  
    // Validate phone
    if (userFields.mobileNumber && !isPhoneValid(userFields.mobileNumber)) {
        errors.mobileNumber = "Invalid phone number.";
        return { valid: false, errors };
    }
  
    // Validate individual user fields
    if (!userFields.firstName) {
        errors.firstName = "First Name is required.";
    }
    if (!userFields.surname) {
        errors.surname = "Surname is required.";
    }
    if (!userFields.email) {
        errors.email = "Email is required.";
    }
    if (!userFields.mobileNumber) {
        errors.mobileNumber = "Mobile Number is required.";
    }

    if (Object.keys(errors).length > 0) {
        return { valid: false, errors };
    }
  
    return { valid: true, errors: {} };
  }

// Helper functions


