# 🍽️ **Restaurant POS System**  

A full-featured **Restaurant POS System** built using the **MERN Stack** to streamline restaurant operations, enhance customer experience, and manage orders, payments, and inventory with ease.

## ✨ **Features**

- 🍽️ **Order Management**  
  Efficiently manage customer orders with real-time updates and status tracking.

- 🪑 **Table Reservations**  
  Simplify table bookings and manage reservations directly from the POS.

- 🔐 **Authentication**  
  Secure login and role-based access control for admins, staff, and users.

- 💸 **Payment Integration**  
  Integrated with **Razorpay** (or other gateways) for seamless online payments.

- 🧾 **Billing & Invoicing**  
  Automatically generate detailed bills and invoices for every order.

- 📊 **Analytics Dashboard**  
  View real-time metrics, sales reports, and performance analytics.

- 🍴 **Comprehensive Menu**  
  11 categories with 100+ dishes including Indian, Chinese, and Continental cuisine.

- 👥 **Multi-Role Support**  
  Different interfaces for Admin, Manager, Waiter, Chef, and Cashier.


## 🏗️ **Tech Stack**

| **Category**             | **Technology**                |
|--------------------------|-------------------------------|
| 🖥️ **Frontend**          | React.js, Redux, Tailwind CSS  |
| 🔙 **Backend**           | Node.js, Express.js           |
| 🗄️ **Database**          | MongoDB                       |
| 🔐 **Authentication**    | JWT, bcrypt                   |
| 💳 **Payment Integration**| Razorpay    |
| 📊 **State Management**   | Redux Toolkit                 |
| ⚡ **Data Fetching & Caching** | React Query            |
| 🔗 **APIs**              | RESTful APIs                   |

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Restaurant_POS_System.git
   cd Restaurant_POS_System-master
   ```

2. **Backend Setup**
   ```bash
   cd pos-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../pos-frontend
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000`

### Default Login Credentials
- **Admin:** admin@restaurant.com / admin123
- **Manager:** manager@restaurant.com / manager123
- **Waiter:** waiter@restaurant.com / waiter123
- **Chef:** chef@restaurant.com / chef123
- **Cashier:** cashier@restaurant.com / cashier123

📖 **For detailed setup instructions, see [SETUP.md](SETUP.md)**

---

## 📚 **Documentation**

| Document | Description |
|----------|-------------|
| [📖 SETUP.md](SETUP.md) | Complete setup and installation guide |
| [🔐 loginsetup.md](loginsetup.md) | Login credentials and authentication guide |
| [🍽️ MENU.md](MENU.md) | Complete menu with all dishes and categories |
| [📡 API.md](API.md) | API documentation and endpoints reference |
| [💻 Backend README](pos-backend/README.md) | Backend-specific documentation |
| [🎨 Frontend README](pos-frontend/README.md) | Frontend-specific documentation |

---

## 🍴 **Menu Categories**

The system includes a comprehensive menu with **11 categories** and **100+ items**:

1. 🍲 **Starters** (12 items) - Veg & Non-Veg appetizers
2. 🍛 **Main Course** (15 items) - Indian curries and biryanis
3. 🍚 **Breads & Rice** (12 items) - Naans, rotis, and rice varieties
4. 🥡 **Chinese** (12 items) - Indo-Chinese favorites
5. 🍳 **Breakfast** (12 items) - South & North Indian breakfast
6. 🍹 **Beverages** (15 items) - Hot and cold drinks
7. 🍜 **Soups** (10 items) - Veg and non-veg soups
8. 🍰 **Desserts** (12 items) - Indian and Western sweets
9. 🍕 **Pizzas** (10 items) - Variety of pizza options
10. 🍺 **Alcoholic Drinks** (12 items) - Beer, spirits, wine, cocktails
11. 🥗 **Salads** (8 items) - Fresh salad options

**See [MENU.md](MENU.md) for complete menu with prices**

---

## 👥 **User Roles & Permissions**

### 👨‍💼 Admin
- Full system access
- User management
- View all analytics
- System configuration

### 👔 Manager
- Daily operations management
- Staff oversight
- Reports and analytics
- Order and table management

### 🤵 Waiter
- Take orders
- Manage tables
- Generate bills
- View menu

### 👨‍🍳 Chef
- View incoming orders
- Update order status
- Kitchen operations

### 💰 Cashier
- Process payments
- Generate invoices
- Handle transactions

---

## 🔌 **API Endpoints**

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get current user
- `POST /api/user/logout` - User logout

### Orders
- `GET /api/order` - Get all orders
- `POST /api/order` - Create order
- `GET /api/order/:id` - Get order by ID
- `PUT /api/order/:id` - Update order
- `DELETE /api/order/:id` - Delete order

### Tables
- `GET /api/table` - Get all tables
- `POST /api/table` - Create table
- `PUT /api/table/:id` - Update table
- `DELETE /api/table/:id` - Delete table

### Payments
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment` - Get payment history

**Full API documentation: [API.md](API.md)**

---

## 📦 **Project Structure**

```
Restaurant_POS_System-master/
├── pos-backend/              # Node.js backend
│   ├── config/               # Configuration
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── scripts/              # Database scripts
│   └── app.js                # Main app file
│
├── pos-frontend/             # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── redux/            # State management
│   │   ├── constants/        # Menu & static data
│   │   └── hooks/            # Custom hooks
│   └── package.json
│
├── loginsetup.md             # Login guide
├── MENU.md                   # Menu documentation
├── SETUP.md                  # Setup guide
├── API.md                    # API documentation
└── README.md                 # This file
```

---

## 🛠️ **Available Scripts**

### Backend
```bash
npm run dev          # Start dev server
npm start            # Start production server
npm run seed         # Seed database
npm run clear        # Clear database
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Run linter
```

---
<br>

## 📺 **YouTube Playlist**

🎬 Follow the complete tutorial series on building this Restaurant POS System on YouTube:  
👉 [Watch the Playlist](https://www.youtube.com/playlist?list=PL9OdiypqS7Nk0DHnSNFIi8RgEFJCIWB6X)  

## 📁 **Assets**

- 📦 **Project Assets:** [Google Drive](https://drive.google.com/drive/folders/193N-F1jpzyfPCRCLc9wCyaxjYu2K6PC_)

---

## 📋 **Flow Chart for Project Structure**

- 🗺️ **Visualize the Project Structure:** [View Flow Chart](https://app.eraser.io/workspace/IcU1b6EHu9ZyS9JKi0aY?origin=share)

---

## 🎨 **Design Inspiration**

- 💡 **UI/UX Design Reference:** [Behance Design](https://www.behance.net/gallery/210280099/Restaurant-POS-System-Point-of-Sale-UIUX-Design)

---

## 🖼️ **Project Screenshots**

<table>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/ibjxvy5o1ikbsdebrjky.png" alt="Screenshot 1" width="300"/></td>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502773/ietao6dnw6yjsh4f71zn.png" alt="Screenshot 2" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/vesokdfpa1jb7ytm9abi.png" alt="Screenshot 3" width="300"/></td>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/setoqzhzbwbp9udpri1f.png" alt="Screenshot 4" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1740502772/fc4tiwzdoisqwac1j01y.png" alt="Screenshot 5" width="300"/></td>
  </tr>
</table>

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

📖 Check **CONTRIBUTING.md** for contribution guidelines.

---

## 🐛 **Troubleshooting**

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Kill process on port 8000
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -ti:8000 | xargs kill -9
```

**See [SETUP.md](SETUP.md) for more troubleshooting**

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 **Support**

For support and questions:
- 📧 Email: support@restaurant-pos.com
- 💬 GitHub Issues: [Create an issue](https://github.com/yourusername/Restaurant_POS_System/issues)
- 📖 Documentation: Check the docs folder

---

## 🌟 **Acknowledgments**

- Design inspiration from Behance
- Tutorial series on YouTube
- MERN Stack community
- All contributors

---

## 📈 **Project Statistics**

- **Menu Items:** 100+
- **Categories:** 11
- **User Roles:** 5
- **API Endpoints:** 20+
- **Database Models:** 4
- **Frontend Components:** 30+

---

✨ Feel free to explore, contribute, and enhance the project! 🚀

💡 To contribute, please check out the **CONTRIBUTING.md** for guidelines.

⭐ If you find this project helpful, don't forget to **star** the repository! 🌟

---

**Made with ❤️ by the Restaurant POS Team**

**Last Updated:** February 18, 2026
