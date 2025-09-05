# School Management System

A comprehensive school management system built with Next.js 13, TypeScript, PostgreSQL (Neon), and Cloudinary for image management.

## Features

- ✅ **Complete CRUD Operations**: Add, view, and manage schools
- ✅ **Image Upload & Management**: Cloudinary integration with image optimization
- ✅ **Form Validation**: Comprehensive validation using react-hook-form and Zod
- ✅ **Responsive Design**: Mobile-first approach with modern UI/UX
- ✅ **Modal Interface**: Clean modal-based form interactions
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Loading States**: Proper loading indicators throughout the app
- ✅ **TypeScript**: Full type safety across the application

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Image Storage**: Cloudinary
- **Form Handling**: react-hook-form with Zod validation
- **UI Components**: shadcn/ui
- **Notifications**: react-hot-toast

## Database Schema

```sql
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT NOT NULL,
  email_id VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd school-management-system
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Neon database URL
   - Add your Cloudinary credentials

3. **Database Setup**
   - Create a Neon database
   - The application will automatically create the required table on first run

4. **Cloudinary Setup**
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret
   - Add them to your environment variables

5. **Run the Application**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/schools/add` - Add a new school with image upload
- `GET /api/schools/get` - Fetch all schools

## Form Validation

The application includes comprehensive form validation:
- **Email**: Valid email format required
- **Contact**: 10-digit numeric format
- **Image**: File type validation (jpg, png, webp), size limit (5MB)
- **Required Fields**: All fields are mandatory with appropriate error messages

## Image Management

- **Upload**: Drag-and-drop or click to upload
- **Preview**: Real-time image preview before submission
- **Optimization**: Automatic image optimization via Cloudinary
- **Storage**: Secure cloud storage with CDN delivery

## Responsive Design

- **Mobile**: Single column layout with touch-friendly interactions
- **Tablet**: Two-column grid layout
- **Desktop**: Three or more column grid with hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details