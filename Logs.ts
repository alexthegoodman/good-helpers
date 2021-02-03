const { info, warn, log, error, indent } = require("pretty-console-logs");
import * as mixpanel from "mixpanel-browser";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";
import Utility from "./Utility";
const publicIp = require("public-ip");

const defaultLogging = process.env.NODE_ENV === "development" ? true : false;

export default class Logs {
  public utility: Utility;
  public mixpanel;
  // public ReactPixel;
  public ReactGA;

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Privacy/Storage_access_policy/Errors/CookieBlockedTracker
    mixpanel.init(process.env.MIXPANEL_SECRET, {
      opt_out_tracking_by_default: false,
      loaded: function(mixpanel) {
        publicIp.v4().then(ip => {
          const eventTime = new Date().toISOString();
          const distinctId = mixpanel.get_distinct_id();
          const data = { ip, distinctId };
          const message = "Mixpanel loaded - IP: " + ip + " ID: " + distinctId;
          console.info(message);
          mixpanel.track(message, {
            env: process.env.NODE_ENV,
            time: eventTime,
            data,
          });
        });
      },
    });
    // if (typeof window !== "undefined") {
    //   ReactPixel.init(process.env.PIXEL_ID as string);
    // }
    console.info("init ReactGA", process.env.GTA_ID);
    ReactGA.initialize(process.env.GTA_ID as string, {
      testMode: process.env.NODE_ENV === "production" ? false : true,
    });

    this.mixpanel = mixpanel;
    // this.ReactPixel = ReactPixel;
    this.ReactGA = ReactGA;
    this.utility = new Utility();
  }

  getIp() {
    return publicIp.v4();
  }

  write(message, type = "info", logging = defaultLogging) {
    // TODO: named parameters or data object?
    // const prefix = arguments.callee.caller.name;
    const prefix = "";
    let logMessage = Array.isArray(message)
      ? JSON.stringify([prefix, ...message])
      : JSON.stringify([prefix, message]);
    // let logMessage = JSON.stringify(message);

    if (logging) {
      switch (type) {
        case "info":
          info(logMessage);
          break;
        case "warn":
          warn(logMessage);
          break;
        case "error":
          error(logMessage);
          break;
        case "indent":
          indent(logMessage);
          break;
        default:
          log(logMessage);
          break;
      }
    }
  }

  event(title, data) {
    // TODO: IP address? https://geoiplookup.io/
    // https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
    const eventTime = new Date().toISOString();
    this.write([`EVENT: ${title} @ ${eventTime}`, data], "info");
    this.mixpanel.track(title, {
      env: process.env.NODE_ENV,
      time: eventTime,
      data,
    });
  }

  ga(type, data) {
    if (process.env.NODE_ENV !== "development") {
      switch (type) {
        case "pageView":
          const pagePath = this.utility.isDefinedWithContent(data.path)
            ? data.path
            : null;
          this.ReactGA.pageview(pagePath);
          this.write(["ReactGA pageView", pagePath], "info");
          break;
        case "event":
          this.ReactGA.event({
            category: "Default Category",
            action: "Default Action",
            label: "Default Label",
            ...data,
          });
          this.write(["ReactGA event", pagePath], "info");
          break;
      }
    }
  }

  pixel(type, data) {
    if (process.env.NODE_ENV !== "development") {
      const testCode =
        process.env.NODE_ENV === "development"
          ? { test_event_code: "TEST17277" }
          : {};
      // switch (type) {
      //   case "event":
      //     this.ReactPixel.track(data.eventName, data);
      //     // this.ReactPixel.pageView();
      //     this.write(["ReactPixel event"], "info");
      //     break;
      //   case "pageView":
      //     this.ReactPixel.pageView();
      //     this.write(["ReactPixel pageView"], "info");
      //     break;
      //   case "lead":
      //     const leadData = [
      //       {
      //         event_name: data.eventName,
      //         event_time: Date.now(),
      //         user_data: {},
      //         custom_data: {},
      //       },
      //     ];
      //     const testData = {
      //       data: leadData,
      //       ...testCode,
      //     };
      //     this.ReactPixel.track("Lead", leadData);
      //     this.write(["ReactPixel track Lead", leadData], "info");
      //     break;
      // }
    }
  }
}
