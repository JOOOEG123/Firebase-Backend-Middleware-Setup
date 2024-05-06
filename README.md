# Firebase-backend-middleware-setup

Discover a meticulously crafted Firebase Node.js boilerplate. Designed to fortify endpoints with middleware and authentication verification, it ensures data integrity and user security for your web applications.

This repository provides a comprehensive Firebase Node.js boilerplate designed to establish secure endpoints, featuring a robust middleware configuration and robust authentication verification mechanisms. Its architecture is tailored to ensure data integrity and user authentication, making it an ideal foundation for developing web applications that prioritize security and reliability.

Middleware Function

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

