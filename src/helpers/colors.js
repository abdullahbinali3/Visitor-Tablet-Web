// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript/16348977#16348977
export function stringToColor(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// Based on https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379#43195379
// With edits by Shane.
export function stringToPastelColor(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }

  let h = ((hash >> (0 * 8)) & 0xFF) / 256;
  let s = ((hash >> (1 * 8)) & 0xFF) / 256;
  let l = ((hash >> (2 * 8)) & 0xFF) / 256;

  return "hsl(" + 360 * h + ',' +
    (25 + 70 * s) + '%,' +
    (85 + 10 * l) + '%)';
}

// Based on https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379#43195379
// With edits by Shane.
export function stringToPastelColorDark(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }

  let h = ((hash >> (0 * 8)) & 0xFF) / 256;
  let s = ((hash >> (1 * 8)) & 0xFF) / 256;
  let l = ((hash >> (2 * 8)) & 0xFF) / 256;

  return "hsl(" + 360 * h + ',' +
    (25 + 70 * s) + '%,' +
    (62 + 10 * l) + '%)';
}

// Based on https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379#43195379
// With edits by Shane.
export function stringToPastelColorDarker(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }

  let h = ((hash >> (0 * 8)) & 0xFF) / 256;
  let s = ((hash >> (1 * 8)) & 0xFF) / 256;
  let l = ((hash >> (2 * 8)) & 0xFF) / 256;

  return "hsl(" + 360 * h + ',' +
    (25 + 70 * s) + '%,' +
    (40 + 10 * l) + '%)';
}

// Based on https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379#43195379
// With edits by Shane.
export function stringToPastelTextColor(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  let h = ((hash >> (0 * 8)) & 0xFF) / 256;
  let s = ((hash >> (1 * 8)) & 0xFF) / 256;
  let l = ((hash >> (2 * 8)) & 0xFF) / 256;

  return "hsl(" + 360 * h + ',' +
    (25 + 70 * s) + '%,' +
    (23 + 10 * l) + '%)';
}

// Based on https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript/43195379#43195379
// With edits by Shane.
export function stringToPastelTextColorDark(str) {
  let hash = 0;
  if (str !== undefined && str !== null && str !== "") {
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  let h = ((hash >> (0 * 8)) & 0xFF) / 256;
  let s = ((hash >> (1 * 8)) & 0xFF) / 256;
  let l = ((hash >> (2 * 8)) & 0xFF) / 256;

  return "hsl(" + 360 * h + ',' +
    (25 + 70 * s) + '%,' +
    (10 + 9 * l) + '%)';
}

// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex/44134328#44134328
export function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex/44134328#44134328
export function hslStringToHex(hslString) {
  hslString = hslString.substring(4, hslString.length - 1);
  const hslSplit = hslString.split(',');
  let h = hslSplit[0].replace(/[\s%]+/g, '');
  let s = hslSplit[1].replace(/[\s%]+/g, '');
  let l = hslSplit[2].replace(/[\s%]+/g, '');

  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}