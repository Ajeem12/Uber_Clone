# Backend API Reference 🚀

This document covers the `users` and `captains` authentication endpoints used by the backend server. It includes example requests and responses, validation rules, and quick cURL snippets.

## Table of Contents

- **Users**
  - Register — `POST /users/register`
  - Login — `POST /users/login`
  - Profile — `GET /users/profile`
  - Logout — `GET /users/logout`
- **Captains**
  - Register — `POST /captains/register`
  - Login — `POST /captains/login`
  - Profile — `GET /captains/profile`
  - Logout — `GET /captains/logout`

---

## Users

### Register — `POST /users/register`

Create a new user and return a JWT token.

Required headers:

- `Content-Type: application/json`

Request body (JSON):

- `fullname`: object with `firstname` (required, min 3) and optional `lastname` (min 3)
- `email`: valid email
- `password`: string (min 6)

Example request body:

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Success (201):

```json
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

---

### Login — `POST /users/login`

Authenticate and return JWT.

Request body:

```json
{ "email": "john@example.com", "password": "securePassword123" }
```

Success (200): `{ "user": {...}, "token": "<jwt>" }`

---

### Profile — `GET /users/profile`

Requires `Authorization: Bearer <jwt>` header.

Success (200):

```json
{
  "user": {
    "_id": "64a...",
    "fullname": { "firstname": "John" },
    "email": "john@example.com",
    "socketId": null
  }
}
```

---

### Logout — `GET /users/logout`

Blacklists token and returns:

```json
{ "message": "Logout successful" }
```

---

## Captains

Captain endpoints behave similarly to users but include vehicle metadata.

### Register — `POST /captains/register`

Request body (JSON):

- `fullname`: object (`firstname` required, min 3)
- `email`: string (required)
- `password`: string (required, min 6)
- `vehicle`: object with `color` (min 3), `plate` (min 3), `capacity` (int >=1), `vehicleType` (one of `"motorcycle"`, `"car"`, `"auto"`)

Example success (201):

```json
{
  "captain": {
    "_id": "64a...",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane@example.com",
    "socketId": null,
    "status": "inactive",
    "vehicle": {
      "color": "Blue",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": { "lat": null, "lng": null }
  },
  "token": "<jwt-token>"
}
```

---

### Login — `POST /captains/login`

Request body:

```json
{ "email": "jane@example.com", "password": "StrongPass123" }
```

On success the endpoint:

- returns `{ "captain": {...}, "token": "<jwt>" }` in the response body
- sets an HTTP cookie `token` with the JWT

---

### Profile — `GET /captains/profile`

Requires authentication via either the `token` cookie or `Authorization: Bearer <jwt>` header.

Example success response (200):

```json
{
  "captain": {
    "_id": "64a...",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane@example.com",
    "socketId": null,
    "status": "active",
    "vehicle": {
      "color": "Blue",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": { "lat": 37.7749, "lng": -122.4194 }
  }
}
```

> Note: Real `location` values depend on captain updates; the above is an example.

---

### Logout — `GET /captains/logout`

Accepts token via `Authorization: Bearer <jwt>` or the `token` cookie. The endpoint blacklists the token and clears the cookie.

Example success response (200):

```json
{ "message": "Logout successful" }
```

---

If you'd like, I can:

- add a small badge header and repo links
- add automated tests for these endpoints (supertest + jest)
- generate Postman collection or curl script snippets

Tell me which of the above you'd like next and I'll continue.

### Endpoint

**POST** `/captains/login`

### Description

Authenticate an existing captain and return an authentication token (JWT). On success the token is returned in the response body and also set as an HTTP cookie named `token`.

---

### Headers

- `Content-Type: application/json`

### Request Body (JSON)

- `email` (string, required, valid email)
- `password` (string, required, min 6 chars)

Example:

```json
{
  "email": "jane@example.com",
  "password": "StrongPass123"
}
```

---

### Validation Rules & Responses

- **200 OK** ✅ — Successful authentication

  - Response body: `{ "captain": { ...publicCaptainFields }, "token": "<jwt>" }`
  - Note: The controller sets a `token` cookie in addition to returning the token in the response body. Password should **not** be returned in the response.

- **400 Bad Request** ⚠️ — Validation failed

  - Response body: `{ "errors": [ { "msg": "...", "param": "...", "location": "body" }, ... ] }`

- **401 Unauthorized** ⚠️ — Invalid credentials

  - Response body: `{ "message": "Invalid email or password" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

### Example cURL (Login)

```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "jane@example.com", "password": "StrongPass123" }'
```

---

## Profile — Endpoint ✅

### Endpoint

**GET** `/captains/profile`

### Description

Retrieve the authenticated captain's profile information.

---

### Headers

- `Authorization: Bearer <jwt>` **or** send cookie `token` returned by login

### Validation Rules & Responses

- **200 OK** ✅ — Successful retrieval

  - Response body: `{ "captain": { ...publicCaptainFields } }`

- **401 Unauthorized** ⚠️ — Missing, invalid or blacklisted token

  - Response body: `{ "message": "Unauthorized" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

### Example cURL (Profile)

```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer <jwt>"
```

---

## Logout — Endpoint ✅

### Endpoint

**GET** `/captains/logout`

### Description

Log out the authenticated captain by blacklisting their JWT token and clearing the `token` cookie. The endpoint accepts the token via an `Authorization: Bearer <jwt>` header or the `token` cookie.

---

### Headers

- `Authorization: Bearer <jwt>` **or** send cookie `token`

### Validation Rules & Responses

- **200 OK** ✅ — Successful logout

  - Response body: `{ "message": "Logout successful" }`

- **401 Unauthorized** ⚠️ — Missing, invalid or blacklisted token

  - Response body: `{ "message": "Unauthorized" }`

- **500 Internal Server Error** ❌ — Server/database error
  - Response body: `{ "error": "Internal server error" }` (or similar)

---

### Example cURL (Logout)

```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer <jwt>"
```

---
