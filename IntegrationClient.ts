import Utility from "./Utility";
import RestClient from "./RestClient";
import Logs from "./Logs";
import axios from "axios";

export default class IntegrationClient {
  public logs = new Logs();
  public restClient = new RestClient();
  public utility = new Utility();

  constructor() {}

  mailchimpSubscribe(values, callback) {
    // this.restClient.makeRequest(
    //   "/integration/mailchimp-subscribe",
    //   values,
    //   callback
    // );
  }

  sendEmail(email, data, subject, body) {
    return new Promise(async (resolve, reject) => {
      if (this.utility.isDefinedWithContent(email)) {
        axios
          .get(
            `https://climatescore.com/api/sendMail/${data.firstName}/${data.lastName}/${email}/${data.phone}/${body}`
          )
          .then((json) => {
            console.info("sendEmail ", json);
            resolve(json);
          })
          .catch((error) => {
            console.error("sendEmail ERROR: ", error);
            reject(error);
          });
      } else {
        const err = "Sorry! No email provided. Code 4407";
        console.error(err);
        alert(err);
        reject(err);
      }
    });
  }

  // must test on HTTPS / SSL
  // https://developer.mozilla.org/en-US/docs/Web/API/PaymentRequest/canMakePayment#Browser_Compatibility
  // https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts
  // https://webplatform.github.io/docs/concepts/experimental_features/
  // Firefox: about:config Search: dom.payments.request.enabled Set: true
  // chrome://flags/#allow-insecure-localhost
  // https://stackoverflow.com/a/15076602
  // https://gist.github.com/pgilad/63ddb94e0691eebd502deee207ff62bd
  // https://www.andrewconnell.com/blog/updated-creating-and-trusting-self-signed-certs-on-macos-and-chrome/ this one!

  // stripe.createToken
  // perhaps creating a PaymentIntent
  async createStripeCharge(stripe, clientSecret, cardElement, values) {
    return new Promise(async (resolve, reject) => {
      // const {
      //   error,
      //   paymentMethod,
      // } = await stripeRef.current.createPaymentMethod({
      //   type: "card",
      //   card: elements.getElement(CardElement),
      // });

      // TODO: Load coupons from Stripe
      // stripe.

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            // card: {
            //   // "brand": "visa",
            //   checks: {
            //     address_line1_check: null,
            //     cvc_check: "pass",
            //   },
            //   country: "US",
            //   exp_month: 8,
            //   exp_year: 2021,
            //   // "fingerprint": "Xt5EWLLDS7FJjR1c",
            //   // "funding": "credit",
            //   // "generated_from": null,
            //   last4: "4242",
            //   // "three_d_secure_usage": {
            //   //   "supported": true
            //   // },
            //   // "wallet": null
            // },
            billing_details: {
              // address: {
              //   city: values.city,
              //   country: "US",
              //   line1: values.streetAddress,
              //   line2: null,
              //   postal_code: values.zipCode,
              //   state: values.state,
              // },
              email: values.emailAddress,
              name: `${values.firstName} ${values.lastName}`,
              phone: values.phoneNumber,
            },
          },
        }
      );

      console.info("chargeStripe ", error, paymentIntent);

      if (this.utility.isDefinedWithContent(error)) {
        this.handleStripeError(error);
        reject(error);
      } else if (
        this.utility.isDefinedWithContent(paymentIntent) &&
        paymentIntent.status === "succeeded"
      ) {
        console.info("stripe charge success...");
        resolve({ values, paymentIntent });
        // onSuccess(values, paymentIntent);
        // const paymentRequest = stripeRef.current.paymentRequest({
        //   country: "US",
        //   currency: "usd",
        //   total: {
        //     label: "Recitations Premium Report",
        //     amount: 499000, // $499
        //   },
        //   requestPayerName: true,
        //   requestPayerEmail: true,
        // });

        // paymentRequest.canMakePayment().then(result => {
        //   console.info("canMakePayment", result);
        //   if (result !== null) {
        //     // no registered card in browser or payment method available
        //     paymentRequest.show();
        //   } else {
        //     alert("Credit card information required.");
        //   }
        // });
      }
    });
  }

  handleStripeError(error) {
    // https://stripe.com/docs/api/errors?lang=node
    this.logs.write(
      [error.type, error.code, error.message, error.decline_code],
      "error"
    );
    this.logs.event("Stripe Error", {
      type: error.type,
      code: error.code,
      message: error.message,
      decline_code: error.decline_code,
    });
    // alert(
    //   `Type: ${error.type} Code: ${error.code} Message: ${
    //     error.message
    //   } Decline Code: ${error.decline_code}`
    // );
    alert(`Something went wrong`);
  }

  getScoreSeverity(score): ScoreSeverity | null {
    let severity: ScoreSeverity | null = null;
    if (score > VeryLowRange.min && score <= VeryLowRange.max) {
      severity = {
        key: SeverityKeys.veryLow,
        label: SeverityLabels.veryLow,
        description: SeverityDescriptions.veryLow,
      };
    } else if (score > LowRange.min && score <= LowRange.max) {
      severity = {
        key: SeverityKeys.low,
        label: SeverityLabels.low,
        description: SeverityDescriptions.low,
      };
    } else if (score > ModerateRange.min && score <= ModerateRange.max) {
      severity = {
        key: SeverityKeys.moderate,
        label: SeverityLabels.moderate,
        description: SeverityDescriptions.moderate,
      };
    } else if (score > HighRange.min && score <= HighRange.max) {
      severity = {
        key: SeverityKeys.high,
        label: SeverityLabels.high,
        description: SeverityDescriptions.high,
      };
    } else if (score > VeryHighRange.min && score <= VeryHighRange.max) {
      severity = {
        key: SeverityKeys.veryHigh,
        label: SeverityLabels.veryHigh,
        description: SeverityDescriptions.veryHigh,
      };
    } else if (score > ExtremeRange.min && score <= ExtremeRange.max) {
      severity = {
        key: SeverityKeys.extreme,
        label: SeverityLabels.extreme,
        description: SeverityDescriptions.extreme,
      };
    } else {
      severity = {
        key: SeverityKeys.more,
        label: SeverityLabels.more,
        description: SeverityDescriptions.more,
      };
    }
    return severity;
  }
}

export interface ScoreSeverity {
  key: string;
  label: string;
  description: string;
}

export interface SeverityInfo {
  keys: SeverityKeys;
  labels: SeverityLabels;
  descriptions: SeverityDescriptions;
  ranges: SeverityRanges;
}

export enum SeverityKeys {
  veryLow = "veryLow",
  low = "low",
  moderate = "moderate",
  high = "high",
  veryHigh = "veryHigh",
  extreme = "extreme",
  more = "more",
}

export enum SeverityLabels {
  veryLow = "Very Low",
  low = "Low",
  moderate = "Moderate",
  high = "High",
  veryHigh = "Very High",
  extreme = "Extreme",
  more = "",
}

export enum SeverityDescriptions {
  veryLow = "",
  low = "",
  moderate = "",
  high = "",
  veryHigh = "",
  extreme = "",
  more = "",
}

export interface SeverityRanges {
  veryLow: VeryLowRange;
  low: LowRange;
  moderate: ModerateRange;
  high: HighRange;
  veryHigh: VeryHighRange;
  extreme: ExtremeRange;
  more: MoreRange;
}

export enum VeryLowRange {
  min = 0,
  max = 16.7,
}

export enum LowRange {
  min = 16.7,
  max = 33.3,
}

export enum ModerateRange {
  min = 33.3,
  max = 50,
}

export enum HighRange {
  min = 50,
  max = 66.7,
}

export enum VeryHighRange {
  min = 66.7,
  max = 83.3,
}

export enum ExtremeRange {
  min = 83.3,
  max = 100,
}

export enum MoreRange {
  min = 100,
  max = 100000,
}
