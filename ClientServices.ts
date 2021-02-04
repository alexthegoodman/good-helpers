import Strings from "./Strings";
import RestClient from "./RestClient";
import AuthClient from "./AuthClient";
import ItemClient from "./ItemClient";
import StringHandler from "./StringHandler";
import IntegrationClient from "./IntegrationClient";
import ApolloClient from "apollo-client";
import client from "./ApolloClient";
import Logs from "./Logs";
import Utility from "./Utility";
import Regex from "./Regex";

export default class ClientServices {
  // public strings: Strings;
  // public restClient: RestClient;
  // public authClient: AuthClient;
  // public integrationClient: IntegrationClient;
  // public apolloClient: ApolloClient<any>;
  // public itemClient: ItemClient;
  // public stringHandler: StringHandler;
  // public logs: Logs;
  // public utility: Utility;
  // public regex: Regex;
  public strings;
  public restClient;
  public authClient;
  public integrationClient;
  public apolloClient;
  public itemClient;
  public stringHandler;
  public logs;
  public utility;
  public regex;

  constructor() {
    this.apolloClient = client;
    this.strings = new Strings();
    this.restClient = new RestClient();
    this.authClient = new AuthClient();
    this.integrationClient = new IntegrationClient();
    this.itemClient = new ItemClient();
    this.stringHandler = new StringHandler();
    this.logs = new Logs();
    this.utility = new Utility();
    this.regex = new Regex();
  }
}
