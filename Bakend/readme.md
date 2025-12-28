# Users — Register Endpoint ✅

## Endpoint

**POST** `/users/register`

## Description

Create a new user account and return an authentication token (JWT).

---

## Headers

- `Content-Type: application/json`

## Request Body (JSON)

- `fullname` (object)
  - `firstname` (string, required, min 3 chars)
  - `lastname` (string, optional, min 3 chars)
- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

Example:

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

## Validation Rules & Responses

- **201 Created** ✅ — Successful registration

  - Response body: `{ "user": { ...publicUserFields }, "token": "<jwt>" }`
  - Note: Password is not returned in the response (stored hashed).

- **400 Bad Request** ⚠️ — Validation failed

  - Response body: `{ "errors": [ { "msg": "...", "param": "...", "location": "body" }, ... ] }`
  - Examples of validation errors: invalid email, `fullname.firstname` too short, password too short.

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

## Notes

- The route is registered as `/register` in `user.route.js` and typically mounted as `/users`, resulting in `/users/register`.
- A JWT is generated using `process.env.JWT_SECRET_KEY` — ensure this environment variable is set in your environment.
- Validation is handled with `express-validator` in `user.route.js` — see that file for exact checks.

---

## Example cURL

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{ "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "password": "securePassword123" }'
```

---

## Example Success Response

```json
HTTP/1.1 201 Created
{
  "user": {
    "_id": "64a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "socketId": null
  },
  "token": "<jwt-token>"
}
```

## Example Validation Error Response

```json
HTTP/1.1 400 Bad Request
{
  "errors": [
    { "msg": "Invalid email address", "param": "email", "location": "body" },
    { "msg": "Firstname must be at least 3 characters long", "param": "fullname.firstname", "location": "body" }
  ]
}
```

---

## Login — Endpoint ✅

### Endpoint

**POST** `/users/login`

### Description

Authenticate an existing user and return an authentication token (JWT).

---

### Headers

- `Content-Type: application/json`

### Request Body (JSON)

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

Example:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

### Validation Rules & Responses

- **200 OK** ✅ — Successful authentication

  - Response body: `{ "user": { ...publicUserFields }, "token": "<jwt>" }`
  - Note: Password should NOT be returned in the response. Make sure the controller excludes the password field before sending the user object.

- **400 Bad Request** ⚠️ — Validation failed

  - Response body: `{ "errors": [ { "msg": "...", "param": "...", "location": "body" }, ... ] }`

- **401 Unauthorized** ⚠️ — Invalid credentials

  - Response body: `{ "message": "Invalid email or password" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

## Example cURL (Login)

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com", "password": "securePassword123" }'
```

---

## Example Success Response (Login)

```json
HTTP/1.1 200 OK
{
  "user": {
    "_id": "64a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "socketId": null
  },
  "token": "<jwt-token>"
}
```

## Example Invalid Credentials Response

```json
HTTP/1.1 401 Unauthorized
{
  "message": "Invalid email or password"
}
```

---

## Profile — Endpoint ✅

### Endpoint

**GET** `/users/profile`

### Description

Retrieve the authenticated user's profile information.

---

### Headers

- `Authorization: Bearer <jwt>`

### Validation Rules & Responses

- **200 OK** ✅ — Successful retrieval

  - Response body: `{ "user": { ...publicUserFields } }`

- **401 Unauthorized** ⚠️ — Missing or invalid token

  - Response body: `{ "message": "Unauthorized" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

## Example cURL (Profile)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt>"
```

---

## Example Success Response (Profile)

```json
HTTP/1.1 200 OK
{
  "user": {
    "_id": "64a...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "socketId": null
  }
}
```

---

## Logout — Endpoint ✅

### Endpoint

**GET** `/users/logout`

### Description

Log out the authenticated user by blacklisting their JWT token.

---

### Headers

- `Authorization: Bearer <jwt>`

### Validation Rules & Responses

- **200 OK** ✅ — Successful logout

  - Response body: `{ "message": "Logout successful" }`

- **401 Unauthorized** ⚠️ — Missing or invalid token

  - Response body: `{ "message": "Unauthorized" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

## Example cURL (Logout)

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt>"
```

---

## Example Success Response (Logout)

```json
HTTP/1.1 200 OK
{
  "message": "Logout successful"
}
```

---

If you'd like, I can also add automated integration tests for these endpoints (using supertest/mocha or jest). 🔧

---

# Captains — Register Endpoint ✅

## Endpoint

**POST** `/captains/register`

> Note: The route is registered as `/register` in `captain.routes.js` and is typically mounted under a `captains` route group (e.g., `app.use('/captains', captainRoutes)`), resulting in `/captains/register`. Verify your route mounting in `server.js` or `app.js`.

---

## Description

Create a new captain account and return an authentication token (JWT).

---

## Headers

- `Content-Type: application/json`

---

## Request Body (JSON)

- `fullname` (object)
  - `firstname` (string, **required**, min 3 chars)
  - `lastname` (string, optional, min 3 chars)
- `email` (string, **required**, valid email)
- `password` (string, **required**, min 6 chars)
- `vehicle` (object)
  - `color` (string, **required**, min 3 chars)
  - `plate` (string, **required**, min 3 chars)
  - `capacity` (number, **required**, integer >= 1)
  - `vehicleType` (string, **required**, one of `"motorcycle"`, `"car"`, `"auto"`)

Example:

```json
{
  "fullname": { "firstname": "Jane", "lastname": "Doe" },
  "email": "jane@example.com",
  "password": "StrongPass123",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

## Validation Rules & Responses

- **201 Created** ✅ — Successful registration

  - Response body: `{ "captain": { ...publicCaptainFields }, "token": "<jwt>" }`
  - Note: Password should **not** be returned in the response. The model sets `password` with `select: false` but confirm in controllers that the password is not exposed.

- **400 Bad Request** ⚠️ — Validation failed or captain already exists

  - Validation failure response: `{ "errors": [ { "msg": "...", "param": "...", "location": "body" }, ... ] }`
  - Duplicate captain (email) response: `{ "message": "Captain already exists" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

## Notes

- A JWT is generated using `process.env.JWT_SECRET_KEY` — ensure this environment variable is set in your environment.
- Validation is handled via `express-validator` in `captain.routes.js`.
- The controller uses `captainModel.hashPassword` to hash the password before storing, and `captain.generateAuthToken()` to create a token.

---

## Example cURL

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{ "fullname": { "firstname": "Jane", "lastname": "Doe" }, "email": "jane@example.com", "password": "StrongPass123", "vehicle": { "color": "Blue", "plate": "ABC-123", "capacity": 4, "vehicleType": "car" } }'
```

---

## Example Success Response

```json
HTTP/1.1 201 Created
{
  "captain": {
    "_id": "64a...",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": { "color": "Blue", "plate": "ABC-123", "capacity": 4, "vehicleType": "car" },
    "location": { "lat": null, "lng": null }
  },
  "token": "<jwt-token>"
}
```

## Example Validation Error Response

```json
HTTP/1.1 400 Bad Request
{
  "errors": [
    { "msg": "Invalid email address", "param": "email", "location": "body" },
    { "msg": "Firstname must be at least 3 characters long", "param": "fullname.firstname", "location": "body" }
  ]
}
```

---

If you'd like, I can also add documentation for additional captain endpoints (login, profile, location updates, status toggles) once those controllers/routes are implemented, or I can add automated integration tests for the register endpoint (using supertest/jest). 🔧
