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

If you'd like, I can also add automated integration tests for this endpoint (using supertest/mocha or jest). 🔧
