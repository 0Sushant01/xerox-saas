# Xerox Shop SaaS MVP

A production-ready MVP connecting customers with local Xerox/print shops. This platform allows users to find print shops, upload documents, configure print options, and place orders directly. Shop owners can manage their profiles, view orders, and update statuses.

## Features

### 👤 Customers
- **Shop Discovery**: Browse and search for local print shops.
- **Document Management**: Upload PDF documents securely.
- **Print Configuration**: Customize print settings (color, sides, paper type, etc.).
- **Order Placement**: Place orders with specific shops.
- **Order Tracking**: Monitor order status in real-time.

### 🏪 Shop Owners
- **Profile Management**: customizable shop profiles with services and pricing.
- **Order Dashboard**: View and manage incoming print orders.
- **Status Updates**: Update order stages (Pending, Processing, Completed, etc.).
- **Pricing Configuration**: Set rates for different print types and services.

### 🛡️ Admin
- **Dashboard**: Full backend management via Django Admin.
- **User Management**: Manage customer and shop owner accounts.

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: Vanilla CSS (Responsive & Modern)
- **Auth Handling**: JWT Decoding

### Backend
- **Framework**: Django 4.2+
- **API**: Django REST Framework (DRF)
- **Authentication**: JWT (SimpleJWT)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Image Processing**: Pillow for file handling
- **CORS**: django-cors-headers

## Prerequisites

- **Python**: 3.8+
- **Node.js**: 16+
- **npm**: 7+

## Setup Instructions

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    - **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    - **Mac/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Create a superuser (optional, for admin access):**
    ```bash
    python manage.py createsuperuser
    ```

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173/` (or the port shown in your terminal).

## Key Components

- **Users**: Custom User model supporting different roles (Customer, ShopOwner).
- **Shops**: Manages shop details, location, and services.
- **Documents**: Handles secure file uploads and storage.
- **Orders**: Manages the lifecycle of a print job.
- **Pricing**: Configurable pricing logic for shops.
- **Payments**: (Placeholder/Future) For handling transactions.

## Verification

For detailed step-by-step testing and verification of the platform features, please refer to the [walkthrough.md](C:\Users\0sush\.gemini\antigravity\brain\46cc2434-48bd-4a72-aecf-e48eb6a9f1a1\walkthrough.md).

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
