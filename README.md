# Briskly 🚀
**Your Last Minute Learning App**

Welcome to **Briskly**, an AI-driven learning platform designed to help you master topics quickly and efficiently. Whether you're cramming for an exam or diving into a new subject, Briskly adapts to your needs, providing personalized tools to accelerate your learning journey.

---

## 📚 About Briskly
Briskly is your ultimate companion for last-minute learning. Powered by AI, it offers a dynamic and intuitive platform to upload, learn, and practice any topic in record time. From generating quizzes to suggesting relevant YouTube videos and organizing your notes, Briskly ensures you stay focused and productive.

### Why Briskly?
- **Adaptive Learning**: AI tailors content to your learning style and pace.
- **Multi-Format Support**: Upload text or PDF files to extract key information.
- **Engaging Tools**: Create quizzes, take notes, and discover curated video resources.
- **Sleek Design**: A modern, user-friendly interface powered by cutting-edge technologies.
- **Secure Access**: Seamless user authentication ensures your data is safe.

---

## 🌟 Features

- **📄 File Upload**: Upload `.txt` or `.pdf` files to extract and summarize key content for quick learning.
- **🎥 YouTube Suggestions**: Get curated YouTube video recommendations based on your uploaded topics.
- **🧠 Quiz Generator**: Create custom quizzes to test your knowledge and reinforce learning.
- **📝 Notes Section**: Organize and save notes for each topic in a dedicated, easy-to-use interface.
- **🔒 User Authentication**: Secure login and signup with Clerk for a personalized experience.

---

## 🛠️ Technologies Used

| Technology | Description | Icon |
|------------|-------------|------|
| **React + Vite** | Fast and modern frontend framework with a lightning-fast dev server | ![React](https://img.icons8.com/color/48/000000/react-native.png) |
| **Express** | Robust Node.js backend framework for API development | ![Express](https://img.icons8.com/ios/50/000000/express-js.png) |
| **Clerk** | Secure user authentication and management | ![Clerk](https://clerk.com/favicon.ico) |
| **TailwindCSS** | Utility-first CSS framework for sleek, responsive designs | ![TailwindCSS](https://img.icons8.com/color/48/000000/tailwind_css.png) |
| **GSAP** | High-performance animations for a polished UI | ![GSAP](https://greensock.com/favicon.ico) |
| **Multer** | Middleware for handling file uploads | ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) |
| **pdf-parse** | Parse PDF files to extract content | ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) |
| **react-icons** | Icon library for modern UI components | ![React](https://img.icons8.com/color/48/000000/react-native.png) |
| **google/generative_ai** | AI-powered content generation and summarization | ![Google](https://img.icons8.com/color/48/000000/google-logo.png) |
| **react-split** | Split-pane layouts for flexible UI design | ![React](https://img.icons8.com/color/48/000000/react-native.png) |

---

## 📸 Screenshots

![App Screenshot](C:\BRISKLY\briskly\src\component\assets\landingPage.png)

![App Screenshot](C:\BRISKLY\briskly\src\component\assets\content.png)

![App Screenshot](C:\BRISKLY\briskly\src\component\assets\signUp.png)

---

## 🚀 Getting Started

Follow these steps to set up Briskly locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Meruem09/Briskly.git
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd briskly
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   GOOGLE_API_KEY=your_google_api_key
   NODE_ENV=development
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   - The frontend will run on `http://localhost:5173` (or the port specified by Vite).
   - The backend (Express) will need to be started separately if not integrated with Vite.

6. **Build for Production**
   ```bash
   npm run build
   ```

7. **Preview the Production Build**
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
briskly/             # React + Vite frontend
| ────────── src/
│      ├── components/     # Reusable React components
│      ├── pages/          # Page components (e.g., Home, Quiz, Notes)
│      ├── assets/         # Static assets (images, icons, etc.)        
│      └── App.jsx         # Main App component
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware (e.g., Multer)
│   └── index.js            # Backend entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # You're here!
```

---

## 🤝 Contributing

We welcome contributions to make Briskly even better! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows our coding standards and includes relevant tests.


---

## 📞 Contact

Have questions or suggestions? Reach out to us at:
- Email: rv579787@gmail.com
- GitHub Issues: [Briskly Issues](https://github.com/Meruem09/Briskly/issues)

---

