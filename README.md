# 📚 Maa Gayatri Library — Full Stack Web Application

> A peaceful place for focused study and success.

A complete, production-ready study library management system with a beautiful public website and a powerful admin dashboard.

---

## 🎨 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React.js + Tailwind CSS + Framer Motion |
| Backend     | Node.js + Express.js                |
| Database    | MongoDB (Mongoose ODM)              |
| Auth        | JWT (JSON Web Tokens)               |
| File Upload | Cloudinary                          |
| Charts      | Chart.js + react-chartjs-2          |
| Export      | jsPDF + jspdf-autotable + SheetJS   |

---

## 📁 Project Structure

```
maa-gayatri-library/
├── client/                   # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── admin/        # AdminLayout, ProtectedRoute
│       │   └── public/       # Navbar, Hero, About, Facilities,
│       │                     # Timings, Fees, Gallery, Contact, Footer
│       ├── context/          # AuthContext, ThemeContext
│       ├── pages/
│       │   ├── admin/        # Dashboard, Students, Memberships,
│       │   │                 # Payments, Timings, Gallery,
│       │   │                 # Notifications, Reports, Settings
│       │   └── public/       # HomePage
│       └── utils/            # API axios instance
│
└── server/                   # Express backend
    ├── config/               # Cloudinary setup
    ├── middleware/           # JWT auth middleware
    ├── models/               # Admin, Student, Settings (Mongoose)
    ├── routes/               # auth, students, settings, dashboard, reports
    └── index.js              # Entry point + cron job
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free at cloudinary.com)

### 1. Clone / Extract & Install

```bash
# From project root
npm run install-all
```

### 2. Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maa-gayatri-library
JWT_SECRET=your_super_secret_key_here

# Get from cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
```

### 3. Start Development

```bash
# From project root (runs both server + client)
npm run dev
```

Or run separately:
```bash
# Terminal 1 — Server (port 5000)
npm run server

# Terminal 2 — Client (port 3000)
npm run client
```

---

## 🔐 Default Admin Login

```
URL:      http://localhost:3000/admin/login
Email:    xyz@email.com
Password: ***********
```

> ⚠️ **Change the password immediately** after first login via Admin → Settings → Change Password.

---

## 🌐 Pages & Routes

### Public Website
| Route | Page |
|-------|------|
| `/` | Full public website (single page with all sections) |

### Admin Panel
| Route | Page |
|-------|------|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard with stats & charts |
| `/admin/students` | Student management (CRUD) |
| `/admin/memberships` | Fee plans management |
| `/admin/payments` | Payment history & income |
| `/admin/timings` | Library timings (live update) |
| `/admin/gallery` | Gallery image management |
| `/admin/notifications` | Expiry & admission alerts |
| `/admin/reports` | Reports with PDF & Excel export |
| `/admin/settings` | Contact info & password |

---

## 🎯 Key Features

### Public Website
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark/Light mode toggle
- ✅ Smooth Framer Motion animations
- ✅ Hero with student study imagery
- ✅ Live library timing (fetched from DB)
- ✅ Dynamic fee plans (fetched from DB)
- ✅ Gallery with lightbox
- ✅ WhatsApp direct chat button
- ✅ Google Maps embed

### Admin Dashboard
- ✅ JWT authentication with 7-day token
- ✅ Student CRUD with photo + ID proof upload (Cloudinary)
- ✅ Auto-expiry date calculation from admission date + duration
- ✅ Auto status: Active / Expiring Soon / Expired (daily cron job)
- ✅ Search & filter students
- ✅ Membership plan management (add/edit/delete/popular)
- ✅ Timing management — changes are **instantly live** on website
- ✅ Gallery management — upload/delete via Cloudinary
- ✅ Payment tracking with monthly filters
- ✅ Notifications: expiring in 7 days / recently expired / new admissions
- ✅ Reports: Student / Income / Expired reports
- ✅ Export to **PDF** and **Excel**
- ✅ Income charts (line + bar)
- ✅ Monthly admission charts

---

## ☁️ Cloudinary Setup (for image uploads)

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Go to Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Paste into `server/.env`
4. Cloudinary auto-creates folders: `maa-gayatri/students`, `maa-gayatri/id-proofs`, `maa-gayatri/gallery`

> If you don't set up Cloudinary, the app still works — image uploads will simply fail gracefully.

---

## 🚀 Production Deployment

### Build Frontend
```bash
cd client && npm run build
```

### Serve Static Files (add to server/index.js)
```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
```

### Recommended Platforms
- **Backend**: Railway, Render, Heroku, VPS
- **Database**: MongoDB Atlas (free M0 cluster)
- **Frontend**: Vercel, Netlify, or serve via Express

---

## 🎨 Theme Colors

| Name | Hex | Usage |
|------|-----|-------|
| Navy Dark | `#1E3A8A` | Primary brand, sidebar, hero |
| Gold | `#F59E0B` | Accents, CTAs, highlights |
| White | `#FFFFFF` | Backgrounds, cards |
| Light Gray | `#F9FAFB` | Section alternates |

---

## 📞 Library Contact (defaults)

```
Name:    Maa Gayatri Library
Address: Shanti Nagar, Balti Factory, Ludhiana, Punjab
Phone:   +91 98765 43210
Timings: 6:00 AM – 10:00 PM (Mon–Sun)
```

Update via Admin → Settings → Contact Information

---

Made with ❤️ for Maa Gayatri Library
# maa-gayatri-library
