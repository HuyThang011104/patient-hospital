# Hospital Patient Management System

A comprehensive hospital patient management system built with React, TypeScript, and Supabase. This application provides a modern interface for managing patient appointments, medical records, prescriptions, payments, and other healthcare-related operations.

## 🏥 Overview

This is a hospital management project developed by Group 1 for the ERP course. Although the system is still incomplete in some parts, it already includes the essential functions of a management system with full user roles. Due to the urgent two-week deadline, our goal was to complete a working version. After that, we plan to continuously improve and restructure the code.

This project is created for the community — a place where we contribute our humble knowledge, and above all, our dedication and passion.

Most importantly, we had the opportunity to work together — staying up late, discussing ideas, and coding side by side. As time passes and we each take different paths, we’ll always look back fondly on this beautiful period — when we had one another and shared the burning passion and aspirations of our youth.

## 🚀 Features

### Core Functionality

- **Patient Management**: Complete patient registration and profile management
- **Appointment Booking**: Schedule and manage doctor appointments
- **Medical Records**: Maintain comprehensive patient medical history
- **Prescription Management**: Create and manage patient prescriptions
- **Payment Processing**: Handle medical payments and billing
- **Dashboard**: Real-time analytics and overview
- **Authentication**: Secure user authentication and authorization

### Technical Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first design approach
- **Real-time Data**: Supabase real-time database integration
- **Form Validation**: React Hook Form with Zod validation
- **Charts & Analytics**: Data visualization with Recharts

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with latest concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library

### Backend & Database

- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Real-time Database** - Live data synchronization

### State Management & Forms

- **React Context** - Global state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### UI Components & Utilities

- **Lucide React** - Icon library
- **Class Variance Authority** - Component variant management
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **Date Fns** - Date manipulation utilities

## 📁 Project Structure

```
hospital-patient/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── layout/       # Layout components
│   ├── interfaces/       # TypeScript interfaces
│   ├── types/           # Type definitions
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── utils/           # Utility functions
│   │   ├── backend/     # Supabase client and config
│   │   └── mock/        # Mock data for development
│   ├── lib/             # Library configurations
│   └── assets/          # Static assets
├── public/              # Public assets
└── docs/               # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or above)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HuyThang011104/patient-hospital
   cd hospital-patient
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🏥 Data Models

The system includes comprehensive interfaces for healthcare data:

### Core Entities

- **Patient**: Patient information and demographics
- **Doctor**: Healthcare provider details and schedules
- **Appointment**: Appointment scheduling and management
- **Medical Record**: Patient medical history and examinations
- **Prescription**: Medication prescriptions and management
- **Payment**: Billing and payment processing
- **Department**: Hospital departments and organization
- **Insurance**: Insurance information and coverage

### Supporting Entities

- **Medical Specialty**: Medical specialties and expertise
- **Equipment**: Medical equipment tracking
- **Lab Test**: Laboratory test management
- **Room/Hospital Bed**: Facility management
- **Certificate**: Medical certificates and documents

## 🎨 UI Components

The application uses a comprehensive set of UI components:

- **Forms**: Input, validation, and submission
- **Navigation**: Sidebar, header, and routing
- **Data Display**: Tables, cards, and charts
- **Feedback**: Alerts, dialogs, and notifications
- **Layout**: Responsive grid and flexbox layouts

## 🔧 Configuration

### TypeScript Configuration

- Path aliases configured (`@/*` maps to `./src/*`)
- Strict type checking enabled
- modern ES features supported

### Vite Configuration

- React 19 with experimental compiler
- Tailwind CSS integration
- Path resolution aliases
- Optimized build process

## 🔒 Authentication

Authentication is handled through Supabase Auth:

- JWT token-based authentication
- Session management with React Context
- Protected routes and components
- User role-based access control

## 📊 Features in Detail

### Dashboard

- Overview statistics and metrics
- Recent activities and appointments
- Patient and doctor information summaries
- Interactive charts and visualizations

### Appointment Management

- Schedule appointments with doctors
- Calendar view for better planning
- Appointment status tracking
- Automated reminders and notifications

### Medical Records

- Comprehensive patient history
- Examination and test results
- Doctor notes and diagnoses
- Attachment management for documents

### Payment Processing

- Secure payment handling
- Invoice generation
- Payment history tracking
- Insurance claim processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: lehuythangvnsao@gmail.com
- Create an issue in the GitHub repository
- Refer to the documentation
- Contact the development team
- Sponsorship: 259441487-VPB

## 🔄 Version History

- **0.1.0** - Initial release with core functionality
- Features: Authentication, patient management, appointments, medical records

---

Built with ❤️ for modern healthcare management
