# Stage 1: API Design

## Core Actions

So basically, the system should support these main things:

* Get all notifications for a user
* Mark a notification as read
* Delete a notification
* Send real-time notifications (so users don’t have to refresh)

---

## Endpoints

### GET /notifications

This is used to fetch all notifications for a logged-in user.

Response:

```json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "Company hiring",
      "isRead": false,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### PATCH /notifications/:id/read

Marks a notification as read.

```json
{
  "message": "Marked as read"
}
```

---

### DELETE /notifications/:id

Deletes a notification.

```json
{
  "message": "Deleted"
}
```

---

## Real-Time Mechanism

Instead of refreshing the page again and again, we can use **WebSockets** so that whenever a new notification comes, it is pushed instantly to the user.

---

# Stage 2: Database Design

## Choice

I would go with **PostgreSQL**.

## Why?

* Data is structured (notifications have fixed fields)
* Supports indexing (important for performance)
* ACID compliance ensures data safety

---

## Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  studentID INT,
  notificationType VARCHAR(20),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP
);
```

---

## Problems at Scale

As data grows:

* Queries become slow
* Full table scans happen more often

---

## Solutions

* Add indexes
* Partition large tables
* Use caching (like Redis)

---

## Queries

```sql
-- Fetch notifications
SELECT * FROM notifications WHERE studentID = ?;

-- Mark as read
UPDATE notifications SET isRead = true WHERE id = ?;
```

---

# Stage 3: Query Optimization

## Problem Query

```sql
SELECT * FROM notifications 
WHERE studentID = 1042 AND isRead = false 
ORDER BY createdAt DESC;
```

## Why is it slow?

* No proper index → DB scans everything
* Sorting adds extra cost

---

## Fix

```sql
CREATE INDEX idx_student_read_time 
ON notifications(studentID, isRead, createdAt DESC);
```

## Cost

Before: O(n)
After: roughly O(log n)

---

## Indexing all columns?

Not a good idea.

* Slows down inserts
* Uses unnecessary memory

---

## Placement Query

```sql
SELECT DISTINCT studentID 
FROM notifications 
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4: Performance Improvement

## Problem

Right now, every page load hits the DB → too many requests → slow system.

---

## Solutions

### 1. Caching (Redis)

* Store recent notifications in cache
* Reduces DB load

---

### 2. Pagination

* Don’t fetch everything at once
* Only fetch limited data

---

### 3. Lazy Loading

* Load data only when needed

---

## Tradeoffs

* Cache can become outdated
* Extra memory usage

---

# Stage 5: Reliable Notification System

## Problems in given approach

* Everything runs one by one → slow
* If one fails, rest might not execute
* No retry system

---

## Better Approach

Use a **queue system** like Kafka or RabbitMQ.

---

## Improved Pseudocode

```
function notify_all(student_ids, message):

  for student_id in student_ids:
      push_to_queue(student_id, message)

worker():
  while true:
      task = consume_queue()
      save_to_db(task)
      send_email(task)
      push_to_app(task)
```

---

## Why this is better?

* Works asynchronously
* Can retry failed tasks
* Much faster and scalable

---

# Stage 6: Priority Inbox

## Idea

We want to show top notifications based on:

* Importance (Placement > Result > Event)
* Recency (latest first)

---

## Weights

* Placement = 3
* Result = 2
* Event = 1

---

## Code (JavaScript)

```javascript
const axios = require('axios');

const TOKEN = "PASTE_TOKEN";

const API = "http://20.207.122.201/evaluation-service/notifications";

function getWeight(type) {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1;
}

function score(notification) {
    const time = new Date(notification.Timestamp).getTime();
    return getWeight(notification.Type) * 1000000000 + time;
}

async function run() {
    const res = await axios.get(API, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    const notifications = res.data.notifications;

    notifications.sort((a, b) => score(b) - score(a));

    const top10 = notifications.slice(0, 10);

    console.log("Top 10 Notifications:");
    console.log(top10);
}

run();
```

---

## Optimization

Instead of sorting everything:

Use a **Min Heap of size 10**
→ Time complexity: O(n log k)

---

## Conclusion

So overall, the system:

* Handles real-time notifications
* Scales well with users
* Uses efficient querying and prioritization

---
