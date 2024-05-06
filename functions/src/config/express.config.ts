import cors = require("cors");
import express = require("express");
import { res, apiMethod } from "../models/api_types";
import { admin } from "./firebase";

const defaultPath = "/api/";
const apiService = express();
apiService.use(cors({ origin: true }));

export const authMiddleware = async (req, res: res, next: () => unknown) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res
      .status(403)
      .send({ invalid: "Invalid Auth Token", header: req.headers });
    return;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    // using admin.auth() SDK's verifyIdToken to decode the token
    const tokenData = await admin.auth().verifyIdToken(idToken);
    req.user = tokenData;
    next();
    return;
  } catch (error) {
    res.status(403).send({ message: "Token Verification Failed.", error });
    return;
  }
};

export const addUnsecureEndPoint = (
  method: apiMethod,
  path: string,
  func: (...args) => unknown
) => {
  const fullPath = defaultPath + path;
  try {
    if (!method) {
      method = "GET";
    }
    apiService[method.toLowerCase()](fullPath, func);
  } catch (err) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

export const addSecureEndPoint = (
  method: apiMethod,
  path: string,
  func: (...args) => unknown
) => {
  const fullPath = defaultPath + path;
  try {
    if (!method) {
      method = "GET";
    }
    apiService[method.toLowerCase()](`/secure/${fullPath}`, authMiddleware, func);
  } catch (err) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
};



export const apiGatewayFunc = async (req, res: res) => {
  return apiService(req, res);
};
