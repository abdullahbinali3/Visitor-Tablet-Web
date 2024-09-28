// Convert GUID string to Base-64 in Javascript
// by Mark Seecof, 2012-03-31
// https://stackoverflow.com/questions/6095115/javascript-convert-guid-in-string-format-into-base64/9998010#9998010

const hexlist = "0123456789abcdef";
const b64list =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// GUID string with four dashes is always MSB first,
// but base-64 GUID's vary by target-system endian-ness.
// Little-endian systems are far more common.  Set le==true
// when target system is little-endian (e.g., x86 machine).
//
export function guid_to_base64(g, le) {
  if (g === null || g === undefined) {
    return null;
  }

  if (le === undefined) {
    le = true;
  }

  let s = g.replace(/[^0-9a-f]/gi, "").toLowerCase();
  if (s.length != 32) return null;

  if (le)
    s =
      s.slice(6, 8) +
      s.slice(4, 6) +
      s.slice(2, 4) +
      s.slice(0, 2) +
      s.slice(10, 12) +
      s.slice(8, 10) +
      s.slice(14, 16) +
      s.slice(12, 14) +
      s.slice(16);
  s += "0";

  let a, p, q;
  let r = "";
  let i = 0;
  while (i < 33) {
    a =
      (hexlist.indexOf(s.charAt(i++)) << 8) |
      (hexlist.indexOf(s.charAt(i++)) << 4) |
      hexlist.indexOf(s.charAt(i++));

    p = a >> 6;
    q = a & 63;

    r += b64list.charAt(p) + b64list.charAt(q);
  }
  //r += "==";

  r = r.replace(/[\/]/g, "-");
  r = r.replace(/[\+]/g, "_");

  return r;
} // guid_to_base64()

// Convert Base-64 string back to GUID in Javascript.
// Written by Shane 2022-06-02, based on:
// Decode: https://stackoverflow.com/questions/39460182/decode-base64-to-hexadecimal-string-with-javascript/39460727#39460727
// Endian-ness: https://stackoverflow.com/questions/6095115/javascript-convert-guid-in-string-format-into-base64/9998010#9998010
// Valid base64 regex: https://thewebdev.info/2021/08/28/how-to-determine-if-a-string-is-a-base64-string-using-javascript/

// GUID string with four dashes is always MSB first,
// but base-64 GUID's vary by target-system endian-ness.
// Little-endian systems are far more common.  Set le==true
// when target system is little-endian (e.g., x86 machine).
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export function base64_to_guid(b64, le) {
  if (b64 === undefined || b64 === null || b64.length !== 22) {
    return null;
  }

  let s = b64.replace(/[\-]/g, "/");
  s = s.replace(/[\_]/g, "+");
  s += "==";

  if (!base64regex.test(s)) return null;

  const raw = window.atob(s);
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }

  s = result;

  if (le === undefined) {
    le = true;
  }

  if (le)
    s =
      s.slice(6, 8) +
      s.slice(4, 6) +
      s.slice(2, 4) +
      s.slice(0, 2) +
      s.slice(10, 12) +
      s.slice(8, 10) +
      s.slice(14, 16) +
      s.slice(12, 14) +
      s.slice(16);

  s =
    s.slice(0, 8) +
    "-" +
    s.slice(8, 12) +
    "-" +
    s.slice(12, 16) +
    "-" +
    s.slice(16, 20) +
    "-" +
    s.slice(20, 32);

  return s;
} // base64_to_guid()