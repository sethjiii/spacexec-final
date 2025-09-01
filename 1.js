function flatten(arr) {
  const res = [];
  const visted = new Set();
  function solve(arr) {
    for (const item of arr) {
      if (Array.isArray(item)) {
        solve(item);
      } else {
        if (!visted.has(item)) {
          visted.add(item);
          res.push(item);
        }
      }
    }
    solve(arr);
    return res;
  }
}
const arr = [2, [1, 2, [4, [5], 1]]];
console.log(flatten(arr));
