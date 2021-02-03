export default class Strings {
  constructor() {}

  prepend(str, prefix, run) {
    let newStr = str;
    if (run) {
      newStr = prefix + str;
    }
    return newStr;
  }

  decode(item) {
    try {
      return decodeURI(decodeURIComponent(item));
    } catch (error) {
      // mixpanel
      // console.warn("WARNING", error);
      return item;
    }
  }

  getDisplayAddress(address) {
    address = this.decode(address);
    let displayAddress = "";
    if (address !== "") {
      const parts = address.split(",");
      parts.splice(parts.length - 1, 1);
      displayAddress = parts.join(",");
    }
    return displayAddress;
  }

  wordFreq(str) {
    const words = str.replace(/[.]/g, "").split(/\s/);
    const freqMap = {};
    words.forEach(w => {
      if (!freqMap[w]) {
        freqMap[w] = 0;
      }
      freqMap[w] += 1;
    });

    const graphMap = [];
    Object.keys(freqMap).forEach((key, i) => {
      graphMap[i] = { text: key, value: freqMap[key] };
    });

    return graphMap;
  }

  removeCommonWords(str) {
    str = str.replace(
      /\b(?:the|it is|we all|an?|by|to|you|[mh]e|she|they|and|of|on|with|my|i|I|it|are|in|am|that|too|but|be|has|would|song|we...)\b/gi,
      ""
    );
    str = str.replace(
      /\b(?:this|for|might|between|though|much|will|although|should|is|more|have|going|them|sure|thing|before|after|your|if|we...)\b/gi,
      ""
    );
    str = str.replace(
      /\b(?:at|his|her|how|anyway|yet|now|bit|may|say|actually|hear|into|something|alot|both|so|also|only|seem|don't|don|was|we...)\b/gi,
      ""
    );
    return str;
  }

  convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  createQueryString(params) {
    var queryString = Object.keys(params)
      .map(key => key + "=" + params[key])
      .join("&");
    return queryString;
  }

  formatUrl(path) {
    const pathBase = process.env.SERVER_URL;
    const adjustedPath = path[0] !== "/" ? "/" + path : path;

    return pathBase + adjustedPath;
  }

  paramsToString(params) {
    let sendParams = "?";
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        sendParams += key + "=" + params[key] + "&";
      }
    }
    return sendParams;
  }
}