# MedConnect Frontend

MedConnect is a healthcare platform that connects patients with pharmacies for efficient medication management and delivery.

## Features

- User authentication (Patient/Pharmacy)
- Real-time medication broadcasts
- Pharmacy inventory management
- Patient medication tracking
- Secure messaging system
- Location-based pharmacy search

## Tech Stack

- React
- Vite
- Tailwind CSS
- Zustand (State Management)
- Axios (API Client)
- React Router

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd medconnect-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── contexts/       # State management
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── services/       # API services
├── routes/         # Routing configuration
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
