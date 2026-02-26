# Real Estate Lead Management System (MERN)

A backend-driven Lead Management CRM built using the MERN stack.  
This system enables real estate teams to manage leads, run bulk email campaigns, track delivery status, and design scalable WhatsApp automation architecture.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **SendGrid (Bulk Email + Webhook Tracking)**
- **Meta WhatsApp Cloud API (Architecture Design)**

---

## Features

###  Authentication & Roles
- JWT-based authentication
- Role-based access control
- Roles:
  - **ADMIN**
  - **STAFF**

---

### Lead Management
- Create Lead
- Update Lead
- Delete Lead (Admin only)
- Filter leads by:
  - Status
  - Budget range
  - Assigned staff
- Lead lifecycle:
  ```
  NEW → CONTACTED → SITE_VISIT → CLOSED / LOST
  ```

---

### Bulk Email Marketing (SendGrid)

- Send bulk emails to multiple leads
- Supports 50+ recipients per campaign
- Dynamic personalization (`{{name}}`)
- Email status tracking via SendGrid Event Webhooks

#### Email Status Tracking
Tracked statuses:
- SENT
- DELIVERED
- OPENED
- BOUNCED

Status updates happen asynchronously through webhook integration.

---

### WhatsApp Integration (Architecture)

Designed using a service-layer abstraction with:

**Meta WhatsApp Cloud API**

Architecture:

```
Lead Created / Campaign Trigger
            ↓
Backend API (Node/Express)
            ↓
WhatsApp Service Layer
            ↓
Meta WhatsApp Cloud API
            ↓
Message delivered to Lead
```

The service layer allows easy switching between providers such as:
- Meta WhatsApp Cloud API
- Twilio WhatsApp API

---

## Project Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
```

---

## Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=api_key
SENDGRID_FROM_EMAIL=verified_sender_email
```

---

##  Running the Project

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## API Endpoints Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Leads
- `POST /api/leads`
- `GET /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

### Email
- `POST /api/email/send-bulk`
- `GET /api/email/logs`
- `POST /api/email/webhook`

---

## Design Decisions

- Password hashing handled at schema level using bcrypt.
- Business logic separated into service layer.
- Email status tracking implemented using webhook-based event system.
- Role-based authorization implemented via middleware.
- WhatsApp integration designed using abstraction pattern for scalability.

---

##  Future Improvements

- Queue-based bulk email processing (BullMQ)
- Pagination & search
- Dashboard analytics
- WhatsApp real-time implementation
- Rate limiting & API security enhancements

---

##  Demo

The demo demonstrates:

- Admin login
- Lead creation & filtering
- Bulk email campaign
- Email status tracking
- WhatsApp architecture explanation

---

## Author

Shashank Mishra  
MERN Stack Developer

---