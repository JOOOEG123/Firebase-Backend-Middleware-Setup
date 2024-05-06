# Firebase-backend-middleware-setup
https://joooeg123.github.io/Firebase-Backend-Middleware-Setup/
Discover a meticulously crafted Firebase Node.js boilerplate. Designed to fortify endpoints with middleware and authentication verification, it ensures data integrity and user security for your web applications.

This repository provides a comprehensive Firebase Node.js boilerplate designed to establish secure endpoints, featuring a robust middleware configuration and robust authentication verification mechanisms. Its architecture is tailored to ensure data integrity and user authentication, making it an ideal foundation for developing web applications that prioritize security and reliability.

Middleware Function ''functions\src\config\express.config.ts''

```
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
```

function for secured endpoint ''functions\src\config\express.config.ts''
```
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
```

function for unsecured endpoint ''functions\src\config\express.config.ts''
```
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
```

Gateway function ''functions\src\config\express.config.ts''

```
export const apiGatewayFunc = async (req, res: res) => {
  return apiService(req, res);
};
```

root Request ''functions\src\index.ts''
```
exports.synclink = onRequest(apiGatewayFunc);
```

example ''functions\src\controllers\example.controller.ts''

```
const helloWorld = async (request, response: res) => {
  logger.info("Hello logs!", { structuredData: true });
  const innerRes = {status: "success", data: { test1: "test6" }};
  response.send(innerRes);
  return innerRes;
};

addUnsecureEndPoint("POST", "helloWorld", helloWorld);
addSecureEndPoint("POST", "helloWorld", helloWorld);
```


