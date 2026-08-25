# Enchang Ordering System

## 📋 Student Information
| Field | Details |
|---|---|
| Name | Angelica D. Tanglao |
| Course & Section | BSCS 3A |
| Subject | Software Engineering 1 |
| Module | Module 7 — Design and Implementation |

---

## 🎯 Project Overview
**Enchang Ordering System** is a responsive Vue.js frontend prototype for managing customer orders in a fast food restaurant environment — Enchang Fast Food.

The system allows **Admin Login & Logout**, user registration, order creation from the menu, automatic bill calculation and change computation, marking orders as served, managing menu items, posting safety articles, and tracking total earnings. All data is saved automatically in the browser using `localStorage` — no backend server or database required for this prototype.

---

## 🔗 Connection Between Module 6 and Module 7
- **Module 6** → Provided the architectural design and system blueprint
- **Selected Entities** → Customer, Menu Item, Order
- **Presentation Layer** → Vue.js and Tailwind CSS
- **Application Logic** → JavaScript and Vue.js CRUD functions
- **Data Layer** → Browser localStorage
- **Future Components** → Backend API, cloud database, user authentication

---

## ✨ Features

### 🔐 Authentication
- ✅ **Admin Login** — Secure access with username and password
- ✅ **Admin Logout** — End session and return to login screen

### 👤 Customer & Order Management
- ✅ **Register Customer** — Save customer details, order, payment, and service type
- ✅ **Order from Menu** — Select items with quantity, auto-calculate total bill
- ✅ **Bill & Change Calculation** — Auto-compute total, accept payment, show change
- ✅ **Dine-in / Takeout** — Table number for dine-in; driver & delivery info for takeout
- ✅ **Edit Customer Record** — Update registered details anytime
- ✅ **Mark Order as Done** — Move order to served list with timestamp
- ✅ **Search Served Orders** — Find served customers by name instantly

### 📋 Menu Management
- ✅ **Add Menu Item** — Create new menu items with category, price, description
- ✅ **Edit Menu Item** — Update existing menu records
- ✅ **Delete Menu Item** — Remove items with confirmation
- ✅ **View & Filter Menu** — Browse by category or search by name
- ✅ **Category Counts** — Dashboard shows menu count per category

### 📊 Dashboard & Statistics
- ✅ **Total Earnings** — Sums all registered + served orders
- ✅ **Pending Customers** — Count of active orders waiting to be served
- ✅ **Menu Overview** — Items grouped and counted by category

### 📝 Data & Experience
- ✅ **localStorage Persistence** — All data saved automatically
- ✅ **Success & Error Feedback** — Clear green/red alert messages
- ✅ **Dark / Light Mode** — Toggleable theme preference
- ✅ **Responsive Design** — Works on mobile, tablet, and desktop
- ✅ **Input Validation** — Required fields checked before submission
- ✅ **Notifications** — Activity history log for all actions
- ✅ **Homepage Editor** — Customize shop name and welcome text
- ✅ **Safety Articles** — Post and manage food safety information

---

## 📑 Required Fields

### Customer Registration
- Name or Nickname
- Age
- Contact Number
- Order Details (auto-generated from menu selection)
- Payment Method
- Service Type (Dine-in or Takeout)
- Table Number (Dine-in only)
- Driver Name, Contact & Address (Takeout only)
- Customer Money Given → Auto-calculated Total & Change

### Menu Item
- Item Name
- Category
- Price
- Description (optional)

---

## ✅ Validation
- ⛔ Required fields cannot be empty
- ⛔ Price must be greater than zero
- ⛔ Table number required for Dine-in
- ⛔ Driver & delivery info required for Takeout
- ✅ Clear error messages guide the user

---

## 💾 Data Persistence
All data is saved automatically to browser `localStorage`:
- `menu-items` — Menu list
- `customers` — Registered customers & orders
- `order-status` — Order records
- `served-orders` — Completed/served orders
- `safety-articles` — Food safety articles
- `home-content` — Homepage text & settings
- `theme` — Dark/Light mode preference
- `loggedIn` — Admin session status

✅ Data persists after closing and reopening the browser

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Vue.js | Frontend framework & reactive UI |
| Vite | Development server & build tool |
| Tailwind CSS | Responsive styling & design |
| JavaScript | Application logic & CRUD operations |
| localStorage | Browser-based data persistence |
| Git & GitHub | Version control & code hosting |

---

## 🚀 Installation

### Clone the Repository:
git clone https://github.com/59942024-spec/Tanglao-module6-architecture.git
plaintext

### Navigate to the project:
cd tanglao-module6-architecture
plaintext

### Install dependencies:
npm install
plaintext

### Start the development server:
npm run dev
plaintext

### Build the project for production:
npm run build
plaintext

---

## 📸 Application Screenshots
Screenshots demonstrating the required Module 7 functions and deployment evidence are included in the project submission.

The required evidence includes:
1. Running application
2. Admin Login screen
3. Add/Create customer record
4. Customer record list
5. Edit/Update customer record
6. Mark order as done / Delete confirmation
7. Search function
8. localStorage persistence
9. Responsive / mobile view
10. GitHub repository
11. GitHub commit history
12. Successful GitHub Actions build

---

## 🌐 Deployment
The application is deployed using GitHub Pages.

---

## ⚠️ Known Limitations
- The current prototype does not use a backend server
- The current prototype does not use a cloud database
- Order and customer data is stored only in the browser's localStorage
- Data is limited to the browser and device where the application is used
- User authentication is single-admin only
- The system is a frontend prototype and is not intended to replace a full production ordering system

---

## 🔮 Future Improvements
Future versions of the system may include:
- Backend API integration
- Cloud database storage
- Multi-user authentication & roles
- Sales history and reporting
- Receipt generation & printing
- Improved reporting and analytics
- Production-level security and data protection

---

## 📊 Project Status
✅ **Completed Module 7 frontend prototype**

The application implements the required CRUD operations, authentication, search, validation, localStorage persistence, responsive interface, reusable Vue components, GitHub version control, GitHub Actions build verification, and GitHub Pages deployment.

---

## ✍️ Author
Angelica D. Tanglao — BSCS 3A — Software Engineering 1 — Module 7
