import { get } from 'svelte/store';
import moment from 'moment-timezone';
import appData from "$stores/app-data-store.js";

export function jsdateToString(input) {
  if (isNaN(input)) {
    return "N/A";
  }

  var mm = input.getMonth() + 1; // getMonth() is zero-based
  var dd = input.getDate();
  var hh = input.getHours();
  var mi = input.getMinutes();
  var ss = input.getSeconds();

  return [(dd > 9 ? '' : '0') + dd,
    '/',
  (mm > 9 ? '' : '0') + mm,
    '/',
  input.getFullYear(),
    ' ',
  (hh > 9 ? '' : '0') + hh,
    ':',
  (mi > 9 ? '' : '0') + mi,
    ':',
  (ss > 9 ? '' : '0') + ss
  ].join('');
};

export function jsdateOnlyToString(input) {
  if (isNaN(input)) {
    return "N/A";
  }

  var mm = input.getMonth() + 1; // getMonth() is zero-based
  var dd = input.getDate();

  return [(dd > 9 ? '' : '0') + dd,
    '/',
  (mm > 9 ? '' : '0') + mm,
    '/',
  input.getFullYear()
  ].join('');
};

// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd/50130338#50130338
export function jsdateToISOString(input) {
  if (isNaN(input)) {
    return "N/A";
  }

  return new Date(input.getTime() - (input.getTimezoneOffset() * 60000))
    .toISOString()
    .split("T")[0];
}

export function jsdatetimeToISOString(input) {
  if (isNaN(input)) {
    return "N/A";
  }

  return new Date(input.getTime() - (input.getTimezoneOffset() * 60000))
    .toISOString();
}

// Date and Time with internationalization
export function jsdateDateToIntlString(input, language, timezone) {
  if (isNaN(input)) {
    return "N/A";
  }

  // Due to compatability issues with Intl.DateTimeFormat, now swapped to moment-timezone
  return moment(input, timezone).format("dddd, D MMMM YYYY");

  /*
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' })
    .format(input);
  */
}

export function jsdateTimeToIntlString(input, language, timezone) {
  if (isNaN(input)) {
    return "N/A";
  }

  // Due to compatability issues with Intl.DateTimeFormat, now swapped to moment-timezone
  return moment(input, timezone).format("h:mm a");

  /*
  return new Intl.DateTimeFormat(language, { hour: 'numeric', minute: 'numeric', timezone: timezone })
    .format(input);
  */
}

export function getExampleTypeString(exampleTypeInt) {
  let foundExample = exampleTypes.find(item => item.value === exampleTypeInt);
  return foundExample !== undefined ? foundExample.text : exampleTypeInt;
}

// https://javascript.plainenglish.io/how-to-strip-all-punctuation-from-a-string-in-javascript-using-regex-99c6857790d1
export function removePunctuation(str) {
  if (str === "" || str === undefined || str === null) {
    return "";
  }

  return str
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ");
}

// https://stackoverflow.com/questions/33076177/getting-name-initials-using-js/63763497#63763497
// Modified by Shane to use removePunctuation()
export function getInitials(fullName) {
  const allNames = removePunctuation(fullName).trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    // if (index === 0 || index === allNames.length - 1) { // first word + last word
    if (index === 0 || index === 1) { // first word + second word
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
}

export function buildImageUrl(url) {
  if (url && url[0] === '/') {
    let $appData = get(appData);
    return $appData.apiUrl + url;
  }

  return url;
}