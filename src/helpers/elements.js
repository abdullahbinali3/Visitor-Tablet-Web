export function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function generateName() {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.apply(null, Array(12))
    .map(function () {
      return chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    })
    .join("")
}