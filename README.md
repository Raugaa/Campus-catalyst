# Campus Catalyst - Internship Portal

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/raugaas-projects/v0-campus-internship-portal)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Campus Catalyst is a comprehensive internship portal designed to bridge the gap between students, faculty, and companies in educational institutions. This platform streamlines the internship process by providing dedicated dashboards for all stakeholders.

## 🎯 Overview

Campus Catalyst revolutionizes the internship management process by offering a centralized platform where students can discover opportunities, companies can post internships and manage applications, faculty can mentor and track progress, and administrators can oversee the entire ecosystem.

### Key Features
- **Multi-role Access**: Dedicated dashboards for students, companies, faculty, and administrators
- **Real-time Tracking**: Monitor application progress, interview schedules, and placement statistics
- **Interactive Calendars**: Filterable calendars for events, interviews, and deadlines
- **Profile Management**: Comprehensive profile systems for all user types
- **Notification System**: Real-time updates and alerts
- **Analytics Dashboard**: Data-driven insights for administrators

## 🖼️ Screenshots

### Student Dashboard
![Student Dashboard](public/screenshots/student-dashboard.png)
*The student dashboard provides an overview of applications, upcoming events, and personalized recommendations.*

### Company Dashboard
![Company Dashboard](public/screenshots/company-dashboard.png)
*Companies can manage job postings, review applications, and schedule interviews through the intuitive company dashboard.*

### Faculty Dashboard
![Faculty Dashboard](public/screenshots/faculty-dashboard.png)
*Faculty members can track mentee progress, approve applications, and provide guidance through the faculty dashboard.*

### Admin Dashboard
![Admin Dashboard](public/screenshots/admin-dashboard.png)
*Administrators have a comprehensive view of the entire system with analytics and management tools.*

### Global Admin Dashboard
![Global Admin Dashboard](public/screenshots/global-admin-dashboard.png)
*Global administrators can manage institutions and verify company registrations.*

## 🎥 Demo Video

[![Campus Catalyst Demo](public/screenshots/video-thumbnail.png)](public/videos/campus-connect-demo.mp4)
*Click to watch the full demonstration of Campus Catalyst in action*

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm, yarn, or pnpm package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/campus-connect.git
   cd campus-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database configuration
   DATABASE_URL=your_database_url
   
   # Authentication
   NEXT_PUBLIC_WORKOS_CLIENT_ID=your_workos_client_id
   WORKOS_API_KEY=your_workos_api_key
   WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
   
   # Convex (for backend functions)
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   
   # Application settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the application**
   Visit `http://localhost:3000` in your browser

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
```

## 📁 Project Structure

```
campus-connect/
├── app/                    # Next.js App Router pages
│   ├── student/           # Student dashboard and pages
│   ├── company/           # Company dashboard and pages
│   ├── faculty/           # Faculty dashboard and pages
│   ├── admin/             # Admin dashboard and pages
│   ├── global_admin/      # Global admin dashboard and pages
│   └── ...                # Other pages and layouts
├── components/            # Reusable UI components
├── lib/                   # Utility functions and libraries
├── public/                # Static assets
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── ...
```

## 👥 User Roles

### Student
Students can:
- Browse and apply for internship opportunities
- Track application progress
- Schedule and manage interviews
- Access training resources
- Receive personalized recommendations
- Manage their profile and portfolio

### Company
Companies can:
- Post internship opportunities
- Review and manage applications
- Schedule interviews
- Communicate with students
- Manage college partnerships
- Access analytics on their postings

### Faculty
Faculty members can:
- Mentor and track student progress
- Approve internship applications
- Provide guidance and feedback
- Monitor placement statistics
- Generate reports

### Admin
Administrators can:
- Oversee the entire platform
- Manage user accounts
- Monitor system analytics
- Handle disputes and issues
- Configure platform settings

### Global Admin
Global administrators can:
- Verify company registrations
- Manage educational institutions
- Oversee platform-wide settings
- Monitor compliance

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Reusable component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend
- **Convex** - Backend-as-a-service for real-time applications
- **WorkOS** - Authentication and user management
- **Prisma** - Database toolkit (dev dependency)

### Development Tools
- **Vercel** - Deployment and hosting
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **V0** - AI-powered UI generation

## 🎨 UI/UX Features

### Responsive Design
The application is fully responsive and works on all device sizes:
- Mobile-first approach
- Adaptive layouts for tablets and desktops
- Touch-friendly interfaces

### Interactive Components
- Filterable calendars with user, month, and year selection
- Real-time notifications
- Progress tracking visualizations
- Interactive charts and graphs
- Modal dialogs and forms

### Accessibility
- WCAG 2.1 compliant
- Keyboard navigation support
- Screen reader compatibility
- Proper contrast ratios
- Semantic HTML structure

## 📊 Analytics and Reporting

### For Students
- Application success rates
- Skill matching percentages
- Interview preparation progress

### For Companies
- Application funnel analytics
- Time-to-hire metrics
- Candidate quality scores

### For Faculty
- Mentee placement rates
- Department performance
- Program effectiveness

### For Administrators
- Platform usage statistics
- User engagement metrics
- System performance dashboards

## 🔧 Customization

### Theming
The application supports light and dark themes through:
- Next-themes for theme management
- Tailwind CSS dark mode variants
- Custom CSS variables for consistent styling

### Branding
Easily customize:
- Logo and favicon
- Color schemes
- Typography
- Layout components

## 🤝 Contributing

We welcome contributions to Campus Catalyst! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Development Team
- **Garv** - Head of Project , Frontend and UI/UX Developer 
- **Qusai** - Backend Developer
- **Viral Thakkar** - UI/UX Developer
- **Arunil** - Backend Tester
- **Richa Suryvanshi** - Frontend Tester
- **Karan** - UI/UX Tester

### Special Thanks
- To all contributors and beta testers
- To the open-source community for the amazing tools we use
- To our mentors and advisors for guidance

## 📞 Support

For support, please open an issue on our GitHub repository or contact our team at support@campuscatalyst.edu.

## 🔄 Updates

This repository is automatically synced with deployments from [v0.app](https://v0.app). Any changes made to the deployed app will be automatically pushed to this repository.

## 🚀 Deployment

Your project is live at:
**[https://vercel.com/raugaas-projects/v0-campus-internship-portal](https://vercel.com/raugaas-projects/v0-campus-internship-portal)**

Continue building your app on:
**[https://v0.app/chat/projects/52QCQ0p1e5D](https://v0.app/chat/projects/52QCQ0p1e5D)**
