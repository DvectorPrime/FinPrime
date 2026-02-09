# 🚀 FinPrime (Frontend)

FinPrime is a modern, full-stack personal finance tracker designed to help users manage expenses, visualize income, and track budgets. This is the **Frontend** repository, built with Next.js and Tailwind CSS.

## 🌟 Features

- **Authentication:** Secure Login/Signup with Email & Google OAuth.
- **Dashboard:** Real-time financial overview with interactive charts.
- **Transactions:** Add, edit, and categorize income/expenses seamlessly.
- **Budgeting:** Set monthly limits and get visual alerts.
- **PWA Support:** Installable on mobile devices (iOS & Android).
- **Dark Mode:** Fully supported system-wide theme.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** TypeScript
- **State Management:** React Context API
- **Charts:** ChartJS
- **Icons:** React Icons, Lucide React
- **Package Manager:** pnpm

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) (Install via `npm install -g pnpm`)

### 2. Clone the Repository

```bash
git clone https://github.com/DvectorPrime/FinPrime.git
cd FinPrime
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory. You will need to configure the following variables:

```bash
# API URL (Point to your local backend or live server)
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Google OAuth (Optional for local dev, needed for login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id_here"
```

**Note:** Never commit your `.env.local` file to GitHub!

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We welcome contributions! Please follow these steps to work on a feature or fix a bug:

1. Fork the repository.
2. Create a new Branch (`git checkout -b feature/AmazingFeature`).
3. Make your changes and Commit them (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request against the `main` branch.

## 🐛 Known Issues

- **Safari/iOS Login:** If you experience login issues on localhost, try using Chrome or Firefox. (Production uses a proxy fix via Next.js rewrites to handle Safari ITP).

## 📄 License

This project is distributed under a **custom license** for educational and contribution purposes only. Commercial and personal use is **strictly prohibited**.

See `LICENSE` for more information.

---

Built with ❤️ by Victor