# Interview Tracker

A modern web application that helps job seekers track their interview progress, visualize their application status, and prepare for interviews with AI assistance.

## Features

### Current Features
- 🔐 **Authentication System**
  - Secure user authentication using Supabase
  - Protected routes for authenticated users
  - Seamless login/logout experience

- 📊 **Visual Progress Tracking**
  - Interactive Sankey diagram showing application flow
  - Real-time visualization of interview stages
  - Clear overview of application status

- 📝 **Application Management**
  - Track multiple job applications
  - Record interview stages and outcomes
  - Add notes and details for each application

- 🎨 **Modern UI/UX**
  - Clean, responsive design
  - Dark mode support
  - Intuitive navigation

### Upcoming Features
- 🤖 **AI Integration**
  - AI-powered interview preparation
  - Smart application status analysis
  - Personalized interview tips
  - Automated follow-up suggestions

- 📈 **Advanced Analytics**
  - Detailed success rate tracking
  - Industry-specific insights
  - Performance metrics

- 🔔 **Smart Notifications**
  - Interview reminders
  - Follow-up suggestions
  - Status update alerts

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Charts**: Nivo
- **UI Components**: Shadcn/ui

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/interview-tracker.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your Supabase credentials to `.env.local`

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
interview-tracker/
├── app/                    # Next.js app directory
│   ├── protected/         # Protected routes
│   ├── new-application/   # New application form
│   └── home/             # Home page components
├── components/            # Reusable components
├── utils/                # Utility functions
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts from [Nivo](https://nivo.rocks/)
