import { addUnsecureEndPoint, addSecureEndPoint } from "../config/express.config";
import * as logger from "firebase-functions/logger";
import { res } from "../models/api_types";

const helloWorld = async (request, response: res) => {
  logger.info("Hello logs!", { structuredData: true });
  const innerRes = {status: "success", data: { test1: "test6" }};
  response.send(innerRes);
  return innerRes;
};

addUnsecureEndPoint("POST", "helloWorld", helloWorld);
addSecureEndPoint("POST", "helloWorld", helloWorld);
