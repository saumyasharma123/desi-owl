# Desi Owl - Luxury Indian Ethnic Fashion Catalog

A production-grade luxury boutique clothing catalog web application for Desi Owl, an Indian ethnic fashion seller. This platform serves as a catalog + inventory + admin management system with WhatsApp ordering integration.

## 🌟 Features

### Customer Features
- Browse luxury ethnic wear catalog
- Filter products by category, size, price, and availability
- Search functionality
- Product detail pages with image galleries
- WhatsApp ordering integration
- Responsive mobile-first design
- Featured collections and new arrivals

### Admin Features
- Secure admin authentication
- Product management (CRUD operations)
- Image upload and management
- Inventory tracking
- Category management
- Dashboard with analytics
- Stock status management

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd desi-owl
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Storage

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{categoryId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Create Admin User

After setting up Firebase Authentication, create an admin user:

1. Create a user in Firebase Authentication
2. Add a document in Firestore `users` collection:

```javascript
{
  email: "admin@desiowl.com",
  role: "admin",
  createdAt: new Date()
}
```

## 📁 Project Structure

```
desi-owl/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── product/           # Product detail pages
│   │   ├── shop/              # Shop catalog page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── home/             # Home page components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   ├── product/          # Product components
│   │   ├── shop/             # Shop page components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utilities and services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # Firebase services
│   │   ├── firebase.ts       # Firebase configuration
│   │   └── utils.ts          # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── .env.local                # Environment variables (create this)
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts            # Next.js configuration
└── package.json              # Dependencies
```

## 🎨 Design System

### Colors
- **Ivory**: `#FAF8F4` - Primary background
- **Beige**: `#E8DFD3` - Secondary background
- **Taupe**: `#C5B6A5` - Tertiary elements
- **Brown**: `#3A2E26` - Primary text
- **Gold**: `#B89464` - Accent color

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)

## 📱 WhatsApp Integration

Products include a "Order on WhatsApp" button that generates a pre-filled message:

```
Hello Desi Owl,

I would like to order:

Product: [Product Name]
Size: [Selected Size]
Price: ₹[Price]

Product Link: [URL]
```

Update the WhatsApp number in:
- `src/components/product/ProductDetailContent.tsx`
- `src/components/layout/Footer.tsx`

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## 📝 Admin Usage

### Login
Navigate to `/admin/login` and sign in with admin credentials.

### Add Products
1. Go to Admin Dashboard
2. Click "Products" → "Add Product"
3. Fill in product details
4. Upload images
5. Set inventory and visibility options
6. Click "Create Product"

### Manage Inventory
- Update stock quantities
- Change stock status (In Stock, Low Stock, Sold Out)
- Mark products as Featured or New Arrivals

## 🔒 Security

- Admin routes are protected with authentication
- Firestore security rules enforce role-based access
- Environment variables for sensitive data
- Image uploads validated and sanitized

## 📊 Performance

- Optimized images with Next.js Image component
- Lazy loading for product grids
- Server-side rendering for SEO
- Efficient Firestore queries with indexes

## 🤝 Contributing

This is a production project for Desi Owl. For contributions or modifications, please contact the development team.

## 📄 License

Proprietary - All rights reserved by Desi Owl

## 📞 Support

For support, email hello@desiowl.com or contact via WhatsApp.

---

Built with ❤️ for Desi Owl - Where Elegance Meets Tradition
