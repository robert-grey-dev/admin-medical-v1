# Medical Admin Portal 🏥

A comprehensive medical administration portal built with React, TypeScript, and Supabase. This application provides a secure platform for managing doctors, users, and patient reviews with role-based access control.

![Medical Admin Portal](https://i.postimg.cc/QCWC0jk0/home.png)

## ✨ Features

### 🔐 Authentication & Security
- **Multi-role authentication** (Owner, Admin, Moderator, User)
- **Row Level Security** (RLS) policies for data protection
- **Protected routes** with role-based access control
- **Password security** with strength indicator (leak protection available on Pro plan)
- **Rate limiting** for authentication attempts

### 👨‍⚕️ Doctor Management
- Complete CRUD operations for doctor profiles
- **Specialty filtering** and search functionality
- **Experience tracking** and professional details
- **Image upload** support for doctor profiles
- **Rating system** with automated calculations

### 📝 Review System
- **Patient review management** with approval workflow
- **Star rating system** (1-5 stars)
- **Review moderation** with status tracking (pending, approved, rejected)
- **Bulk operations** for efficient review management
- **Privacy protection** - emails hidden from public view

### 👥 User Management
- **User role assignment** and management
- **Profile management** with status tracking
- **Hierarchical permissions** system
- **User activity monitoring**

### 📊 Analytics Dashboard
- **User statistics** and growth metrics
- **Review analytics** and approval rates
- **Doctor performance** tracking
- **Interactive charts** with Recharts
- **CSV data export** for analytics and reports

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/robert-grey-dev/admin-medical-v1.git
   cd admin-medical-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Database Setup**
   Run the migrations in your Supabase SQL editor:
   ```sql
   -- See supabase/migrations/ folder for all migration files
   ```

5. **Load Demo Data** (Optional)
   ```sql
   -- Run the seed data script in Supabase SQL editor
   -- See supabase/seed-data.sql for sample data
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎯 Demo Login

For testing purposes, you can use these demo accounts after loading the seed data:

| Role | Email | Password | Access Level |
|------|--------|----------|--------------|
| **Owner** | owner@medical.com | `SecurePass123!` | Full system access |
| **Admin** | admin@medical.com | `SecurePass123!` | User & content management |
| **Moderator** | moderator@medical.com | `SecurePass123!` | Review moderation only |

> **Note**: These are demo credentials for testing. In production, use secure passwords and enable 2FA.

## 📋 Database Schema

### Core Tables

#### `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `doctors`
```sql
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  experience_years INTEGER,
  image_url TEXT,
  average_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `reviews`
```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  status review_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Enums
- `user_role`: 'owner', 'admin', 'moderator', 'user'
- `review_status`: 'pending', 'approved', 'rejected'

## 🔒 Security Features

### Row Level Security (RLS)
All tables implement comprehensive RLS policies:

- **Doctors**: Public read, admin/owner write
- **Reviews**: Public read (approved only), admin moderation
- **Profiles**: User own data, admin/owner management

### Privacy Protection
- Email addresses in reviews are hidden from public API
- Sensitive user data requires authentication
- Role-based data access restrictions

## 🎨 UI/UX Features

### Design System
- **Semantic color tokens** for consistent theming
- **Dark/Light mode** support with system preference detection
- **Responsive design** optimized for all screen sizes
- **Accessible components** following WCAG guidelines

### User Experience
- **Loading states** and skeleton screens
- **Error boundaries** with graceful error handling
- **Toast notifications** for user feedback
- **Optimistic updates** for smooth interactions

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration files in order
3. Configure authentication providers
4. Set up Row Level Security policies
5. Enable real-time subscriptions (optional)

### Authentication Settings
- **Site URL**: Set to your domain
- **Redirect URLs**: Add your deployment URLs
- **Password Policies**: Configure minimum requirements
- **Email Templates**: Customize for your brand

## 🚀 Deployment

### Recommended Deployment
```bash
# Build and deploy using your preferred platform (Vercel, Netlify, Render, etc.)
```

### Vercel Deployment

1. Import the repository to Vercel or connect your Git repo
2. Framework Preset: Vite (detected automatically)
3. Build command: `npm run build` · Output directory: `dist`
4. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Routing: `vercel.json` already included to prevent 404 on deep links
6. Deploy

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred platform
# (Vercel, Netlify, etc.)
```

## 📈 Performance

- **Lazy Loading**: Components and routes loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Splitting**: Optimized chunks for faster loading
- **Caching**: Efficient API response caching with React Query

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use semantic commit messages
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is provided "AS IS" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software. Use at your own risk.

## 🆘 Support

- **Documentation**: Check the inline code comments
- **Issues**: Open a GitHub issue for bugs
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [React Query](https://tanstack.com/query) for data fetching

---

**Built with ❤️ for modern healthcare administration**
