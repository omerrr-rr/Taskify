# Pomodoro Timer App

A beautiful, fully-featured Pomodoro timer application built with Expo and React Native. This app helps you stay focused and productive with customizable work and break sessions, task management, and detailed statistics.

## Features

- **Timer**: Customizable Pomodoro timer with work and break sessions
- **Task Management**: Create, organize, and track tasks with priorities and categories
- **Statistics**: Detailed productivity analytics and progress tracking
- **Goals**: Set and monitor long-term goals with progress visualization
- **Calendar**: View and manage your schedule (coming soon)
- **Settings**: Customize timer durations, notifications, and app preferences

## Screenshots

The app features a modern, intuitive design with:
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Clean, professional UI components

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pomodoro-timer-app.git
cd pomodoro-timer-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - Press `w` to open in web browser
   - Use Expo Go app on your phone to scan the QR code
   - Use an iOS/Android simulator

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Timer screen
│   │   ├── tasks.tsx      # Task management
│   │   ├── stats.tsx      # Statistics
│   │   ├── goals.tsx      # Goals tracking
│   │   └── settings.tsx   # App settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── hooks/                # Custom hooks
└── assets/               # Images and other assets
```

## Technologies Used

- **Expo**: React Native framework
- **Expo Router**: File-based routing
- **TypeScript**: Type safety
- **React Native SVG**: Vector graphics
- **Expo Linear Gradient**: Beautiful gradients
- **Lucide React Native**: Icon library

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request