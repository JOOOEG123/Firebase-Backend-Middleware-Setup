/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// https://firebase.google.com/docs/functions/typescript
// import { onRequest } from "firebase-functions/1v/https";
import { onRequest } from "firebase-functions/v1/https";
import { apiGatewayFunc } from "./config/express.config";
import "./controllers";

exports.apiEndPoint = onRequest(apiGatewayFunc);
