export function parseCookie() {
  return document.cookie.split(/; */).reduce((obj, str) => {
    if (str === "") return obj;
    const eq = str.indexOf('=');
    const key = eq > 0 ? str.slice(0, eq) : str;
    let val = eq > 0 ? str.slice(eq + 1) : null;
    if (val != null) try { val = decodeURIComponent(val); } catch (ex) { /* pass */ }
    obj[key] = val;
    return obj;
  }, {});
}