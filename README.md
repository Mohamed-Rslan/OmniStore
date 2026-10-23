# 🛒 OmniStore — Full-Stack E-Commerce Platform

A modern full-stack e-commerce web platform built with a **React 18 & Material UI** frontend and a **Django REST Framework** API backend. Demonstrates end-to-end multi-category catalog filtering, persistent cart synchronization, transactional checkout workflows, and resilient fallback handling.

---

## 📌 Architecture Highlights

- **Catalog & Multi-Criteria Filtering**: Dynamic category querying, live keyword search across titles and descriptions using Django `Q` objects, and discount filtering.
- **Transactional Order Placement**: Order and line-item creation is executed within atomic database transactions (`@transaction.atomic`) with row-level locking (`select_for_update`) to guarantee data consistency and rollback on out-of-stock items.
- **Client Fallback Layer**: An automated availability check in React that defaults to bundled mock data and local storage when the backend API is unreachable, ensuring continuous UI demonstration.
- **Automated Test Coverage**: Full suite of Django REST Framework API unit and integration tests covering catalog filtering, single-item lookups, and transactional order validation.

---

## 📸 Key Features

- **⚡ Instant Search & Filtering**: Filter by category (*Outerwear, Knitwear, Dresses, Accessories, Pants, Shoes*), discounts/sales, and live keyword searches.
- **🖼️ Product Showcase**: Image previews, size selections, real-time stock availability, customer ratings, and discount badges.
- **🛍️ Cart State Management**: Real-time quantity adjustments, subtotal recalculations, and persistent state across page reloads.
- **💳 Multi-Step Checkout**: Order summary, shipping address capture, payment method selection, and order confirmation.
- **🔐 User Profiles**: Customer profile view linked to previous order history via registered email.
- **🛡️ Django Administration**: Full admin dashboard for managing categories, products, inventory, and orders.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Material UI (MUI v5), Emotion, Styled-Components, Axios, React-Toastify |
| **Backend** | Python, Django 5.0, Django REST Framework, django-cors-headers, python-dotenv |
| **Database** | SQLite (Development) / PostgreSQL compatible |
| **Testing** | Django Test Framework / DRF APITestCase |

---

## 📂 Project Structure

```text
OmniStore/
├── backend/
│   ├── api/
│   │   ├── management/commands/ # Custom CLI command: load_mock_data
│   │   ├── migrations/          # Database migrations
│   │   ├── models.py            # Category, Product, Order, OrderItem
│   │   ├── serializers.py       # DRF serializers with atomic validation
│   │   ├── views.py             # ViewSets & API endpoints
│   │   ├── urls.py              # API endpoint routing
│   │   └── tests.py             # Automated unit & integration tests
│   ├── ecommerce/               # Django settings & root URLs
│   ├── manage.py                # Django CLI utility
│   ├── requirements.txt         # Backend Python dependencies
│   └── .env.example             # Template for environment variables
│
├── frontend/
│   ├── public/                  # Static assets & index.html template
│   ├── src/
│   │   ├── components/          # Reusable UI components (Header, Footer, ProductCard)
│   │   ├── context/             # React state contexts (AuthContext, CartContext)
│   │   ├── pages/               # Views (Home, Products, ProductDetails, Cart, Checkout, Auth)
│   │   ├── services/            # API integration & mock fallback layer
│   │   ├── App.js               # Route orchestration & theme configuration
│   │   └── index.js             # Client root entry point
│   └── package.json             # Frontend dependencies & scripts
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+) & **npm**
- **Python** (v3.10+) & **pip**
- **Git**

---

### 1. Backend Setup (Django)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate
# macOS/Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
copy .env.example .env

# Apply database migrations
python manage.py migrate

# Seed sample products and categories
python manage.py load_mock_data

# Run the test suite
python manage.py test

# Start the Django development server
python manage.py runserver
```

The Django API server will run at `http://127.0.0.1:8000/`.
- **API Root**: `http://127.0.0.1:8000/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend Setup (React)

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be accessible at `http://localhost:3000/`.

---

## 📡 Core API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/check-server/` | Health check endpoint for client server-detection |
| `GET` | `/api/products/` | Fetch products (supports `?category=`, `?search=`, `?sale=true`) |
| `GET` | `/api/products/<id>/` | Fetch single product specifications |
| `GET` | `/api/featured-products/` | Retrieve highest-rated featured items |
| `GET` | `/api/categories/` | Fetch all product categories |
| `POST` | `/api/create-order/` | Submit new checkout orders with transactional item validation |
| `GET` | `/api/user-orders/?email=<email>` | Retrieve order history for a customer |

---

## 🧪 Testing

To run the full backend API test suite:

```bash
cd backend
python manage.py test
```
All 12 unit and integration tests validate category listing, query filtering, single-product views, and transactional rollback behavior under simulated failure conditions.
