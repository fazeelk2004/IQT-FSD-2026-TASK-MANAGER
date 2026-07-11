# IQT Smart Task Manager — Manual API Tests

Manual test cases for the backend REST API. Use these with **Postman** or
**curl**.

## Setup

- **Base URL:** `http://localhost:5000`
- Start MongoDB and set `MONGODB_URI` in `server/.env`, then run the server:
  ```bash
  npm run dev        # inside the server/ folder
  ```
- For every request with a body, set header: `Content-Type: application/json`.
- Standard success shape: `{ "success": true, "data": ... }`
- Standard error shape: `{ "success": false, "message": "..." }`

> Replace `<id>` in the examples with a real task `_id` returned by the
> "Create a valid task" test.

---

## 1. Health endpoint

- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Body:** _none_
- **Expected status:** `200 OK`
- **Expected result:**
  ```json
  { "success": true, "message": "IQT Smart Task Manager API Is Running" }
  ```

**curl**
```bash
curl -i http://localhost:5000/api/health
```

---

## 2. Get all tasks

- **Method:** `GET`
- **Endpoint:** `/api/tasks`
- **Body:** _none_
- **Expected status:** `200 OK`
- **Expected result:** `success: true` and `data` is an array of tasks sorted
  **newest first** (descending `createdAt`). Empty array if no tasks exist.
  ```json
  { "success": true, "data": [ { "_id": "…", "title": "…", "completed": false, "priority": "medium", "createdAt": "…", "updatedAt": "…" } ] }
  ```

**curl**
```bash
curl -i http://localhost:5000/api/tasks
```

---

## 3. Create a valid task

- **Method:** `POST`
- **Endpoint:** `/api/tasks`
- **Body:**
  ```json
  { "title": "Write project report", "description": "First draft", "priority": "high" }
  ```
- **Expected status:** `201 Created`
- **Expected result:** the created task, with `completed` defaulting to
  `false`, `priority` as sent (or `medium` if omitted), and `createdAt` /
  `updatedAt` timestamps. Leading/trailing whitespace in text fields is trimmed.
  ```json
  { "success": true, "data": { "_id": "…", "title": "Write project report", "description": "First draft", "completed": false, "priority": "high", "createdAt": "…", "updatedAt": "…" } }
  ```

**curl**
```bash
curl -i -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write project report","description":"First draft","priority":"high"}'
```

---

## 4. Reject an empty title

- **Method:** `POST`
- **Endpoint:** `/api/tasks`
- **Body:**
  ```json
  { "title": "   ", "priority": "low" }
  ```
- **Expected status:** `400 Bad Request`
- **Expected result:** validation error, no task created.
  ```json
  { "success": false, "message": "Title Is Required" }
  ```

**curl**
```bash
curl -i -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   ","priority":"low"}'
```

---

## 5. Get one task

- **Method:** `GET`
- **Endpoint:** `/api/tasks/<id>`
- **Body:** _none_
- **Expected status:** `200 OK`
- **Expected result:** the single task matching `<id>`.
  ```json
  { "success": true, "data": { "_id": "<id>", "title": "…", "completed": false, "priority": "high", "createdAt": "…", "updatedAt": "…" } }
  ```

**curl**
```bash
curl -i http://localhost:5000/api/tasks/<id>
```

---

## 6. Update a task

- **Method:** `PATCH`
- **Endpoint:** `/api/tasks/<id>`
- **Body:**
  ```json
  { "title": "Write final report", "priority": "medium" }
  ```
- **Expected status:** `200 OK`
- **Expected result:** the updated task is returned with the new values and a
  refreshed `updatedAt`. Only approved fields (`title`, `description`,
  `completed`, `priority`) are accepted; unknown fields are rejected with `400`.
  ```json
  { "success": true, "data": { "_id": "<id>", "title": "Write final report", "priority": "medium", "updatedAt": "…(newer)…" } }
  ```

**curl**
```bash
curl -i -X PATCH http://localhost:5000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Write final report","priority":"medium"}'
```

---

## 7. Mark a task as completed

- **Method:** `PATCH`
- **Endpoint:** `/api/tasks/<id>`
- **Body:**
  ```json
  { "completed": true }
  ```
- **Expected status:** `200 OK`
- **Expected result:** the task returns with `completed: true`.
  ```json
  { "success": true, "data": { "_id": "<id>", "completed": true, "updatedAt": "…(newer)…" } }
  ```

**curl**
```bash
curl -i -X PATCH http://localhost:5000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

---

## 8. Reject an invalid ObjectId

- **Method:** `GET` (same behavior for `PATCH` and `DELETE`)
- **Endpoint:** `/api/tasks/not-a-valid-id`
- **Body:** _none_
- **Expected status:** `400 Bad Request`
- **Expected result:** the id is rejected before touching the database.
  ```json
  { "success": false, "message": "Invalid Task ID" }
  ```

**curl**
```bash
curl -i http://localhost:5000/api/tasks/not-a-valid-id
```

---

## 9. Delete a task

- **Method:** `DELETE`
- **Endpoint:** `/api/tasks/<id>`
- **Body:** _none_
- **Expected status:** `200 OK`
- **Expected result:** the deleted task is returned; a subsequent
  `GET /api/tasks/<id>` returns `404`.
  ```json
  { "success": true, "data": { "_id": "<id>", "title": "…", "completed": true } }
  ```

**curl**
```bash
curl -i -X DELETE http://localhost:5000/api/tasks/<id>
```

---

## 10. Return 404 for a missing task

- **Method:** `GET` (same behavior for `PATCH` and `DELETE`)
- **Endpoint:** `/api/tasks/64b8f0000000000000000000`
  _(a well-formed ObjectId that does not exist)_
- **Body:** _none_
- **Expected status:** `404 Not Found`
- **Expected result:**
  ```json
  { "success": false, "message": "Task Not Found" }
  ```

**curl**
```bash
curl -i http://localhost:5000/api/tasks/64b8f0000000000000000000
```

---

## Suggested test order

1 → 2 → 3 (save the returned `_id`) → 4 → 5 → 6 → 7 → 8 → 9 → 10.
This exercises validation, retrieval, updates, completion, id validation, and
both the delete and missing-task paths in one pass.
