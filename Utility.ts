export default class Utility {
  constructor() {}

  isDefinedWithContent(item) {
    if (typeof item !== "undefined" && item && item !== "" && item !== null) {
      if (item.constructor === Array && item.length > 0) {
        return true;
      } else if (item.constructor === Array && item.length === 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  getMin2dArray(arr) {
    let min = arr.length > 0 ? parseInt(arr[0]) : 0;
    arr.forEach((item, i) => {
      min = parseInt(item) < min ? parseInt(item) : min;
    });
    return min;
  }

  // objectToArray(obj) {
  //   let arr = [];
  //   Object.keys(obj).map(function(key) {
  //     arr.push({ [key]: obj[key] });
  //     return arr;
  //   });
  //   return arr;
  // }
}
