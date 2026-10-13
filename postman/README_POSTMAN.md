# TICKETFLOW Postman Testing Guide

This directory contains the ready-to-import Postman Collection and Environment files for testing all endpoints of the **TICKETFLOW Event Ticket Booking and Management System**.

---

## Files Included

1. `TICKETFLOW.postman_collection.json` — Complete collection of 30+ requests across 9 modules covering all 4 user roles.
2. `TICKETFLOW.postman_environment.json` — Environment variables with `base_url`, tokens, and dynamic IDs.

---

## How to Import into Postman

1. Open **Postman** (if you have the installer in your Downloads folder, install and launch Postman).
2. Click **Import** (top left button in Postman).
3. Drag and drop both files:
   - `TICKETFLOW.postman_collection.json`
   - `TICKETFLOW.postman_environment.json`
4. In the top right corner of Postman, select the active environment: **TICKETFLOW Local Environment**.

---

## Key Modules & Endpoints Covered

### 1. Authentication & Users
- `POST /api/auth/register` — Register Customer, Organizer, Stall Owner, Admin
- `POST /api/auth/login` — Login (automatically captures `token` into `{{jwt_token}}` variable!)
- `PUT /api/auth/profile/:id` — Update profile
- `GET /api/auth/users` — Get all platform users (Admin)
- `PUT /api/auth/users/:id/role` — Promote or change user role (Admin)

### 2. Venues & Layouts
- `POST /api/venues` — Create venue
- `GET /api/venues` — List all venues
- `POST /api/venue-sections` — Add section with seating capacity & pricing
- `POST /api/seats/generate` — Generate seat matrix

### 3. Events
- `POST /api/events` — Create new event (Organizer)
- `GET /api/events` — Browse all events (Public)
- `GET /api/events/:id` — Get event details
- `GET /api/event-seats/event/:id/available` — View real-time available seats
- `PUT /api/events/:id/approve` — Approve pending event (Admin)

### 4. Food Stalls & Menu Items
- `POST /api/stalls` — Register stall (Stall Owner)
- `PUT /api/stalls/:id/approve` — Approve stall (Admin)
- `POST /api/stall-items` — Add food / refreshment item
- `GET /api/stall-items/stall/:id` — Get stall menu
- `POST /api/event-stalls` — Apply stall for event participation

### 5. Bookings, Payments & Tickets
- `POST /api/bookings` — Create seat & food booking
- `POST /api/payments` — Process payment (Simulated UPI/Card)
- `POST /api/tickets/booking/:id` — Generate digital QR ticket
- `GET /api/tickets/customer/:id` — View all customer tickets
- `POST /api/bookings/:id/cancel` — **Cancel booking & request refund** (Releases seats back to pool!)

### 6. QR Gate Check-In Scanner
- `POST /api/tickets/check-in` — Validate ticket code or QR payload at entrance:
  - Returns `VALID` (Entry Granted), `ALREADY_CHECKED_IN`, or `CANCELLED/INVALID`

### 7. Reviews & Ratings
- `POST /api/reviews` — Rate event (1-5 stars) with feedback comment
- `GET /api/reviews/event/:id` — List event reviews
- `GET /api/reviews/event/:id/rating` — Average rating summary

### 8. Notifications
- `GET /api/notifications` — Fetch user notifications
- `GET /api/notifications/unread-count` — Count unread alerts
- `PUT /api/notifications/:id/read` — Mark notification as read
- `PUT /api/notifications/read-all` — Mark all as read

### 9. Admin Portal & Audit Logs
- `GET /api/bookings/admin/statistics` — Platform KPI statistics
- `GET /api/bookings/admin/refunds` — View all customer refund claims
- `PUT /api/bookings/admin/refunds/:id/process` — Process and disburse refund
- `GET /api/activity-logs` — Real-time system audit logs

---

## Authentication Tip
When you execute the **"Login"** request in Postman, a built-in Postman test script automatically stores the returned JWT token into `{{jwt_token}}`. All subsequent secured requests will automatically use this Bearer token!
