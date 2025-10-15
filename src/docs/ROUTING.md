# 🛣️ **Routing System Documentation**

## **Overview**

The application now uses React Router to separate the main game from the admin interface, providing clean URL-based navigation and better separation of concerns.

## **Route Structure**

### **Main Game Routes**
- **`/`** - Main game interface (Landing, GameScene, Levels)
  - Accessible to all users
  - Contains the full game experience
  - Includes admin navigation button for authorized users

### **Admin Routes**
- **`/admin/level-creator`** - Level Creator interface
  - Admin-only access (email must contain 'admin' or 'creator')
  - Full-screen level creation interface
  - Redirects to home if user is not admin

## **Navigation Components**

### **AdminNav Component**
Located at `src/components/admin/AdminNav.tsx`

**Features:**
- Floating navigation button in top-right corner
- Context-aware (shows different buttons based on current page)
- Admin-only visibility
- Clean, unobtrusive design

**Usage:**
```tsx
<AdminNav currentPage="game" />        // Shows "Level Creator" button
<AdminNav currentPage="level-creator" /> // Shows "Back to Game" button
```

## **Access Control**

### **Admin Authentication**
- **Email-based**: Users with 'admin' or 'creator' in their email
- **Route Protection**: Admin routes automatically redirect non-admin users
- **Visual Indicators**: AdminNav only appears for authorized users

### **Route Protection Flow**
1. User navigates to `/admin/level-creator`
2. `AdminRoute` component checks user email
3. If admin: Show Level Creator interface
4. If not admin: Redirect to home page (`/`)

## **URL Structure**

```
Main Game:
/                    → Landing page + Game interface

Admin Interface:
/admin/level-creator → Level Creator (admin only)
```

## **Navigation Examples**

### **From Game to Level Creator**
```tsx
// In any component
const navigate = useNavigate();
navigate('/admin/level-creator');
```

### **From Level Creator to Game**
```tsx
// In Level Creator
const navigate = useNavigate();
navigate('/');
```

## **File Structure**

```
src/
├── router/
│   └── AppRouter.tsx          # Main router configuration
├── components/
│   └── admin/
│       └── AdminNav.tsx       # Admin navigation component
├── pages/
│   ├── LevelCreator.tsx       # Admin level creation interface
│   ├── Levels.tsx            # Game levels page
│   └── ...
└── App.tsx                    # Router integration
```

## **Benefits of New Routing System**

### **1. Clean Separation**
- Admin interface completely separate from game
- No z-index conflicts or overlapping UI
- Better code organization

### **2. URL-Based Navigation**
- Direct links to admin interface
- Browser back/forward buttons work
- Bookmarkable admin pages

### **3. Better Security**
- Route-level access control
- Automatic redirects for unauthorized users
- Clear separation of admin and user functionality

### **4. Improved UX**
- No more modal overlays
- Full-screen admin interface
- Consistent navigation patterns

## **Usage Instructions**

### **For Players**
1. Navigate to `http://localhost:5175/`
2. Play the game normally
3. Admin features are hidden unless you have admin privileges

### **For Admins**
1. Login with admin email (contains 'admin' or 'creator')
2. Look for the "Level Creator" button in top-right corner
3. Click to access `/admin/level-creator`
4. Create and manage levels
5. Use "Back to Game" button to return to main game

### **Direct Admin Access**
- Navigate directly to `http://localhost:5175/admin/level-creator`
- System will check admin status and redirect if needed
- Bookmark this URL for quick access

## **Technical Implementation**

### **Router Setup**
```tsx
<BrowserRouter>
  <AuthProvider>
    <GameProvider>
      <AnalyticsProvider>
        <Routes>
          <Route path="/admin/level-creator" element={<AdminRoute><LevelCreator /></AdminRoute>} />
          <Route path="/" element={<GameWrapper><MainGame /></GameWrapper>} />
        </Routes>
      </AnalyticsProvider>
    </GameProvider>
  </AuthProvider>
</BrowserRouter>
```

### **Admin Route Protection**
```tsx
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthProvider);
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('creator');
  
  return isAdmin ? children : <Navigate to="/" replace />;
};
```

The routing system is now fully implemented and provides a clean, secure way to access the Level Creator while keeping the main game interface separate and uncluttered.
