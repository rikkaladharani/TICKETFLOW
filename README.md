# TICKETFLOW — 100% Complete Event Ticket Booking and Management System

A full-stack enterprise web application for dynamic event ticket booking, venue seating, food stall ordering, digital QR gate check-in, cancellations & refunds, attendee reviews, and real-time notifications.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Bootstrap, Axios, React Router v6, CSS3
- **Backend**: Spring Boot 3.5.6, Java 17, Spring Data JPA, Spring Security (Stateless JWT), Google ZXing (QR Code Engine)
- **Database**: MySQL 8.x
- **API Testing**: Postman Collection (v2.1) & Environment included

---

## 👥 4 User Portals & Features

### 1. 🎟️ Customer Portal
- **Browse & Search Events**: Filter by category (Concerts, Sports, Theatre, Food, Conferences) and location.
- **Interactive Seating**: Select available seats in real-time with visual price tiers.
- **Food Stall Add-ons**: Add food, snacks, and drinks directly to booking before checkout.
- **Coupon Discounts**: Apply promo codes (e.g., `WELCOME10`).
- **Digital QR Tickets**: Instant QR code generation with ticket card and print/download capability.
- **Cancellations & Refunds**: Cancel confirmed tickets with reason; immediately releases seats back to the venue pool and creates a refund claim.
- **Rate & Review Events**: Submit 1 to 5-star ratings and written reviews for events.
- **Wishlist & Profile**: Save favorite events and manage personal details.
- **Notifications**: Real-time alerts for booking confirmation, tickets issued, cancellations, and gate entry.

### 2. 🎤 Organizer Portal
- **Organizer Dashboard**: Live analytics on hosted events, tickets sold, attendance rate, and gross revenue.
- **Event Creation**: Create events with custom date, time, venue, description, and poster image.
- **QR Gate Check-In Scanner**: Live web camera & barcode scanner to verify tickets at entrance:
  - 🟢 **VALID**: Green check, attendee name, seat numbers, entry granted.
  - 🟡 **ALREADY USED**: Yellow warning showing exact prior check-in time.
  - 🔴 **CANCELLED/INVALID**: Red alert preventing entry.
- **Stall Applications**: Review and approve food stall vendors for their events.
- **Attendee Tracking**: Real-time attendee check-in count and attendee lists.

### 3. 🏪 Stall Owner Portal
- **Stall Dashboard**: Overview of stall listings, approval statuses, and event participation.
- **Stall & Menu Management**: Register stalls and manage food items with price, description, and available stock.
- **Event Applications**: Apply approved stalls to participate in upcoming events.
- **Orders Tracking**: View food items ordered by customers across events.

### 4. 🛡️ Admin Portal
- **Admin Dashboard**: Platform-wide KPIs (total users, active events, bookings, gross revenue, venues).
- **User Management**: Search, filter by role (Customer, Organizer, Stall Owner, Admin), promote/change roles, and delete accounts.
- **Event & Stall Approvals**: Review pending event and stall submissions.
- **Venue & Layout Management**: Configure venues, sections, and seating capacities.
- **Cancellations & Refund Management**: Review customer refund requests and approve/process payouts.
- **Platform Audit Trail**: Real-time audit logs of all platform actions (check-ins, approvals, cancellations).

---

## 🚀 How to Run the Project

### Demo data and login accounts
On backend startup, TicketFlow creates five sample Hyderabad venues and six starter events when those tables are empty. It also adds pottery, painting, terrarium, candle-making and coffee workshops if they are missing. The initializer repairs older local databases by creating a sample seating section and seats where missing, then links available seats to events that have no event-seat records. Existing venues, events and bookings are preserved. Sample images load from Unsplash and require an internet connection.

- **Admin:** `admin@ticketflow.com` / `admin123`
- **Organizer:** `organizer@ticketflow.com` / `organizer123`
- **Customer:** `customer@ticketflow.com` / `customer123`
- **Stall owner:** `stallowner@ticketflow.com` / `stallowner123`

To book a ticket, log in as Customer, open an event, click **Book Tickets**, and select one or more green seats from the seat map. Selected seats turn blue; check the total on the right and click **Continue to Checkout**. To add more venues, log in as Admin and open **Dashboard → Venue Management**. After updating this version, restart the backend so the missing demo seating is created.

### 1. Database Setup
1. Ensure MySQL is running on port `3306`.
2. Create the database:
   ```sql
   CREATE DATABASE ticketflow;
   ```
3. Open `backend/src/main/resources/application.properties` and verify your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root123
   ```

### 2. Run Backend (Spring Boot)
1. Open terminal in `backend/`:
   ```bash
   mvn spring-boot:run
   ```
   *(or `./mvnw spring-boot:run`)*
2. Backend will start at: `http://localhost:8080`
3. Health check: `http://localhost:8080/api/health`

### 3. Run Frontend (React + Vite)
1. Open terminal in `frontend/`:
   ```bash
   npm install
   npm run dev
   ```
2. Frontend will run at: `http://localhost:5173`

---

## 📮 Testing with Postman

A comprehensive Postman collection and environment are provided in the [`postman/`](./postman) folder:

1. Import `postman/TICKETFLOW.postman_collection.json` into Postman.
2. Import `postman/TICKETFLOW.postman_environment.json` into Postman.
3. Select the **TICKETFLOW Local Environment**.
4. Run the **Login** request — it automatically captures your JWT token into the environment so all subsequent requests authenticate automatically!
5. Test all 30+ endpoints covering Auth, Venues, Events, Stalls, Bookings, QR Check-In, Reviews, Refunds, and Audit Logs.

## New unique feature: Vibe Match

Open `http://localhost:3000/discover` (or select **Vibe Match** in the navbar) to use the personalized event discovery page. Choose an interest and the mood you want, then explore ranked event suggestions with venue/date details and a direct seat-booking action. Recommendations are generated from the events returned by the existing backend; no third-party AI key is required.

Other included demo additions: Hyderabad sample venues, upcoming demo events, hands-on pottery/painting/terrarium/candle/coffee workshops, and startup-time seat-map initialization for venues/events that need it.
