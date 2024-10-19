export function validateForm(visitors, userFields) {
  let errors = {}; // Object to hold validation errors
  if (!visitors || !userFields) {
    return { isValid: false, errors: { form: "Form data is not available." } };
  }

  // Check required fields in the visitors object one by one
  for (const key of Object.keys(visitors || {})) {
    if (key !== "users" && !visitors[key]) {
      errors[key] = `${key} is required.`;
      return { valid: false, errors };
    }
  }

  // Validate email
  if (userFields.email && !isEmailValid(userFields.email)) {
    errors.email = "Invalid email address.";
    return { valid: false, errors };
  }

  // Validate phone
  if (userFields.mobileNumber && !isPhoneValid(userFields.mobileNumber)) {
    errors.mobileNumber = "Invalid phone number.";
    return { valid: false, errors };
  }

  // Validate date ranges
  if (!validateDates(visitors)) {
    errors.dates = "Start date must be earlier than end date.";
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
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPhoneValid(phone) {
  return /^\+?[0-9]{10,15}$/.test(phone);
}

function validateDates(visitors) {
  return (
    new Date(`${visitors.startDate}T${visitors.startTime}`) <
    new Date(`${visitors.endDate}T${visitors.endTime}`)
  );
}
