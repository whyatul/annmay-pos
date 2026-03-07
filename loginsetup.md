# 🔐 Login Setup Guide - Restaurant POS System

## Overview
This guide provides detailed information about user authentication, default login credentials, and how to login as different users in the Restaurant POS System.

---

## 🚀 Initial Setup

### 1. Database Seeding
Before you can login, you need to seed the database with default users:

```bash
cd pos-backend
npm run seed
```

This will create default user accounts with different roles.

### 2. Start the Servers

**Backend Server:**
```bash
cd pos-backend
npm run dev
```
The backend will run on `http://localhost:8000`

**Frontend Server:**
```bash
cd pos-frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

---

## 👥 Default User Accounts

After running the seed script, the following user accounts will be available:

### 1. 👨‍💼 Admin User
- **Email:** `admin@restaurant.com`
- **Password:** `admin123`
- **Role:** Admin
- **Permissions:**
  - Full system access
  - User management
  - Menu management
  - View all analytics and reports
  - Payment management
  - System configuration

**Use Case:** Complete control over the restaurant POS system, managing staff, viewing reports, and configuring settings.

---

### 2. 👔 Manager User
- **Email:** `manager@restaurant.com`
- **Password:** `manager123`
- **Role:** Manager
- **Permissions:**
  - Manage daily operations
  - Oversee staff
  - View analytics and reports
  - Handle customer complaints
  - Manage orders and tables
  - Access to payment information

**Use Case:** Day-to-day restaurant management, monitoring operations, and handling staff-related tasks.

---

### 3. 🤵 Waiter User
- **Email:** `waiter@restaurant.com`
- **Password:** `waiter123`
- **Role:** Waiter
- **Permissions:**
  - Take customer orders
  - Manage assigned tables
  - View menu items
  - Update order status
  - Generate bills
  - Limited access to analytics

**Use Case:** Front-of-house operations, taking orders, serving customers, and managing tables.

---

### 4. 👨‍🍳 Chef User
- **Email:** `chef@restaurant.com`
- **Password:** `chef123`
- **Role:** Chef
- **Permissions:**
  - View incoming orders
  - Update order preparation status
  - View menu items
  - Mark orders as "Ready"
  - Kitchen-focused interface

**Use Case:** Kitchen operations, preparing orders, and updating order status from "In Progress" to "Ready".

---

### 5. 💰 Cashier User
- **Email:** `cashier@restaurant.com`
- **Password:** `cashier123`
- **Role:** Cashier
- **Permissions:**
  - Process payments
  - Generate invoices
  - View order details
  - Handle refunds
  - Print receipts
  - Access to payment reports

**Use Case:** Payment processing, billing, and financial transactions.

---

## 🔑 How to Login

### Step 1: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

### Step 2: Login Page
You'll see the login page with fields for:
- Email
- Password

### Step 3: Enter Credentials
Choose one of the user accounts listed above and enter the corresponding email and password.

### Step 4: Access Dashboard
After successful login, you'll be redirected to the dashboard based on your role.

---

## 🎭 Role-Based Access

Different roles have different UI experiences:

### Admin Dashboard
- Complete overview of restaurant operations
- User management panel
- Financial reports and analytics
- System settings

### Manager Dashboard
- Operational metrics
- Staff performance
- Sales reports
- Table and order management

### Waiter Interface
- Table status view
- Order taking interface
- Menu browsing
- Bill generation

### Chef Interface
- Order queue
- Kitchen display system
- Order status updates
- Recipe information

### Cashier Interface
- Payment processing
- Invoice generation
- Transaction history
- Payment methods

---

## 🔒 Security Features

### Password Hashing
- All passwords are hashed using bcrypt
- Strong encryption before storing in database
- Never stored in plain text

### JWT Authentication
- JSON Web Tokens for secure authentication
- Tokens expire after 24 hours
- Secure cookie storage
- HTTP-only cookies to prevent XSS attacks

### Session Management
- Automatic logout on token expiration
- Secure session handling
- Protected routes based on roles

---

## 📝 Creating New Users

### Via Admin Panel
1. Login as Admin
2. Navigate to "User Management"
3. Click "Add New User"
4. Fill in user details:
   - Name
   - Email
   - Phone (10-digit number)
   - Password
   - Role (Admin/Manager/Waiter/Chef/Cashier)
5. Click "Create User"

### Via API (for developers)
```bash
POST http://localhost:8000/api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@restaurant.com",
  "phone": 9876543215,
  "password": "password123",
  "role": "waiter"
}
```

---

## 🔄 Changing Passwords

### For All Users
1. Login to your account
2. Go to Profile Settings
3. Click "Change Password"
4. Enter current password
5. Enter new password
6. Confirm new password
7. Click "Update Password"

### For Admins (Resetting Other Users)
1. Login as Admin
2. Go to User Management
3. Select the user
4. Click "Reset Password"
5. System generates new password
6. Share with the user securely

---

## 🚪 Logout

To logout from the system:
1. Click on the user profile icon
2. Select "Logout" from dropdown
3. You'll be redirected to login page
4. Session and tokens will be cleared

---

## ⚠️ Important Notes

### Production Deployment
When deploying to production:

1. **Change Default Passwords**
   - All default passwords must be changed
   - Use strong, unique passwords
   - Never use `password123` or similar

2. **Update Environment Variables**
   ```env
   JWT_SECRET=use_a_strong_random_secret_here
   ```

3. **Enable HTTPS**
   - Always use HTTPS in production
   - Secure cookie transmission
   - SSL/TLS certificates

4. **Database Security**
   - Use MongoDB Atlas or secure MongoDB installation
   - Enable authentication
   - Whitelist IP addresses
   - Regular backups

5. **CORS Configuration**
   - Restrict allowed origins
   - Update CORS settings in backend

---

## 🐛 Troubleshooting

### Cannot Login - "Invalid Credentials"
- Check if database is seeded: `npm run seed`
- Verify email and password are correct
- Check backend server is running
- Check MongoDB is running

### Session Expired
- Tokens expire after 24 hours
- Login again to get new token
- Check system time is correct

### CORS Errors
- Ensure backend allows frontend origin
- Check CORS configuration in `app.js`
- Verify frontend URL matches CORS settings

### Database Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI in `.env`
- Ensure database user has proper permissions

---

## 📞 Support

For additional support or questions:
- Check the main README.md
- Review API documentation
- Check backend logs for errors
- Verify all environment variables are set

---

## 📚 Additional Resources

- [Main Project README](../README.md)
- [Backend Documentation](../pos-backend/README.md)
- [Frontend Documentation](../pos-frontend/README.md)
- [API Documentation](#) (Coming soon)

---

**Last Updated:** February 18, 2026

**Version:** 1.0.0

---

## 🎉 Quick Start Summary

```bash
# 1. Seed database
cd pos-backend && npm run seed

# 2. Start backend (in one terminal)
cd pos-backend && npm run dev

# 3. Start frontend (in another terminal)
cd pos-frontend && npm run dev

# 4. Open browser
# http://localhost:5173

# 5. Login with any of these:
# admin@restaurant.com / admin123
# manager@restaurant.com / manager123
# waiter@restaurant.com / waiter123
# chef@restaurant.com / chef123
# cashier@restaurant.com / cashier123
```

---

**Happy Ordering! 🍽️**
