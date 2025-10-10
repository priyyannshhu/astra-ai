# 🪐 Astra AI

> **"Transform ideas into production-ready apps — instantly."**

Astra AI is an intelligent **AI-powered application builder** that converts natural language descriptions into fully functional, interactive web applications. Built with **Next.js 15**, **React 19**, and powered by **Google Gemini AI**, Astra AI eliminates the complexity of traditional development workflows.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-1.27-orange?style=flat)](https://www.convex.dev/)

---

## ✨ What Makes Astra AI Different?

Unlike traditional no-code builders, Astra AI understands **intent**, not just templates. It generates complete, working applications with:

- **Real-time code generation** using Sandpack
- **Interactive AI chat** for iterative refinement
- **Full-stack architecture** with file management
- **Instant deployment** capabilities
- **Token-based usage** system

Simply describe what you want to build, and Astra AI handles the rest — from component architecture to styling, interactions, and state management.

---

## 🎯 Core Features

### 🧠 **Intelligent Code Generation**
- **Context-aware AI** that generates React components, HTML/CSS, and JavaScript
- **File structure management** with automatic imports and dependencies
- **Iterative refinement** through conversational prompts
- **Multi-file projects** with proper organization

### ⚡ **Real-Time Development Environment**
- **Live code preview** using Sandpack integration
- **Hot reload** for instant visual feedback
- **File explorer** with multi-file support
- **Code editor** with syntax highlighting

### 💬 **AI-Powered Chat Interface**
- **Contextual conversations** that remember project history
- **Natural language editing** — just ask for changes
- **Markdown rendering** for rich AI responses
- **Error handling** with helpful suggestions

### 🔐 **User Management & Authentication**
- **Google OAuth integration** for secure sign-in
- **Token-based system** for usage tracking
- **Persistent workspaces** tied to user accounts
- **Profile management** with dropdown menu

### 📦 **Workspace Management**
- **Automatic workspace creation** for each project
- **Real-time file synchronization** via Convex
- **Export functionality** to download projects
- **Deploy capabilities** for production deployment

### 🎨 **Modern User Interface**
- **Dark theme** with gradient animations
- **Responsive design** across all devices
- **Intuitive navigation** between code and preview
- **Professional styling** with Tailwind CSS 4.0

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15.5** - App Router with Server Components
- **React 19.1** - Latest with improved hooks and concurrent features
- **TypeScript** - Type-safe development (inferred from code structure)

### **Styling & UI**
- **Tailwind CSS 4.0** - Latest utility-first CSS framework
- **shadcn/ui** - Radix UI primitives with custom styling
- **Framer Motion** - Advanced animations and interactions
- **Lucide React** - Modern icon library

### **Code Editor & Sandbox**
- **@codesandbox/sandpack-react** - Interactive code playground
- **React Markdown** - Markdown rendering for AI chat

### **Backend & Database**
- **Convex 1.27** - Real-time backend with automatic sync
- **API Routes** - Next.js serverless functions for AI integration

### **AI & Generation**
- **Google Gemini API** - Advanced language model for code generation
- **Axios** - HTTP client for API communication
- **Custom prompts** - Specialized prompt engineering for code generation

### **Authentication & Payments**
- **@react-oauth/google** - Google OAuth 2.0 integration
- **PayPal SDK** - Payment processing integration

### **Utilities**
- **UUID** - Unique identifier generation
- **JSZip** - Project export functionality
- **File Saver** - Client-side file downloads
- **Sonner** - Toast notifications

---

## 📦 Installation & Setup

### Prerequisites
```bash
Node.js 20.x or higher
npm/yarn/pnpm package manager
Google Cloud Console project (for OAuth)
Google AI Studio account (for Gemini API)
Convex account
```

### 1. Clone the Repository
```bash
git clone https://github.com/priyyannshhu/astra-ai.git
cd astra-ai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Convex Backend
CONVEX_DEPLOYMENT=your_convex_deployment_id
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# PayPal (Optional - for payments)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4. Initialize Convex Backend

```bash
# Login to Convex
npx convex login

# Initialize project
npx convex dev
```

This will:
- Create necessary database tables
- Set up real-time subscriptions
- Deploy backend functions

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see Astra AI in action.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## 🚀 Usage Guide

### Getting Started

1. **🏠 Landing Page**
   - View the hero section with animated gradients
   - Explore suggested prompts for inspiration
   - Enter your app idea in the textarea

2. **🔐 Authentication**
   - Click "Get Started" or "Sign In"
   - Authenticate using Google OAuth
   - Your profile appears in the header

3. **⚡ Workspace Creation**
   - Submit your prompt (e.g., "Build a todo app with dark mode")
   - Astra AI creates a dedicated workspace
   - Automatically redirected to `/workspace/[id]`

4. **💻 Development Environment**
   - **Code Tab**: View and edit generated files
   - **Preview Tab**: See live application
   - **File Explorer**: Navigate between files
   - **Chat Panel**: Refine with conversational prompts

5. **🎨 Iterative Refinement**
   ```
   User: "Add a delete button to each todo item"
   AI: [Updates code with delete functionality]
   
   User: "Change the theme to purple"
   AI: [Modifies color scheme to purple gradient]
   
   User: "Add local storage persistence"
   AI: [Implements state persistence]
   ```

6. **📤 Export & Deploy**
   - Click "Export" to download project as ZIP
   - Click "Deploy" to push to production (feature in development)

---

## 💡 Example Prompts

### Simple Applications
```
✨ "Create a calculator with basic operations"
✨ "Build a countdown timer with start/stop functionality"
✨ "Make a color picker with hex code display"
```

### Interactive Dashboards
```
✨ "Design an analytics dashboard with charts"
✨ "Build a project management kanban board"
✨ "Create a weather app with city search"
```

### E-commerce Components
```
✨ "Generate a product card grid with filters"
✨ "Build a shopping cart with quantity controls"
✨ "Create a checkout form with validation"
```

### Content Platforms
```
✨ "Design a blog layout with categories"
✨ "Build a portfolio with project showcase"
✨ "Create a landing page with hero and CTA sections"
```

---

## 🏗️ Architecture Overview

### File Structure
```
astra-ai/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── ai-chat/              # Chat AI endpoint
│   │   └── gen-ai-code/          # Code generation endpoint
│   ├── workspace/[id]/           # Dynamic workspace routes
│   └── page.jsx                  # Homepage
├── components/
│   ├── custom/                   # Custom components
│   │   ├── ChatView.jsx          # AI chat interface
│   │   ├── CodeView.jsx          # Code editor & preview
│   │   ├── Header.jsx            # Navigation header
│   │   └── Hero.jsx              # Landing page hero
│   └── ui/                       # shadcn/ui components
├── context/                      # React Context providers
│   ├── ActionContext.jsx         # Export/deploy actions
│   ├── MessagesContext.jsx       # Chat message state
│   └── UserDetailContext.jsx     # User authentication state
├── convex/                       # Convex backend
│   ├── schema.ts                 # Database schema
│   ├── workspace.ts              # Workspace mutations
│   └── users.ts                  # User management
├── data/                         # Static configuration
│   ├── Colors.js                 # Theme colors
│   ├── Lookup.js                 # Constants and suggestions
│   └── Prompt.js                 # AI prompt templates
└── public/                       # Static assets
```

### Data Flow

```mermaid
graph TB
    A[User Input] --> B[Hero Component]
    B --> C{Authenticated?}
    C -->|No| D[Sign In Dialog]
    C -->|Yes| E[Create Workspace]
    E --> F[Convex Backend]
    F --> G[Workspace ID Generated]
    G --> H[Navigate to /workspace/ID]
    H --> I[CodeView Component]
    I --> J[Generate AI Code]
    J --> K[Gemini API]
    K --> L[Return Files]
    L --> M[Update Convex]
    M --> N[Render in Sandpack]
    N --> O[User Refines via Chat]
    O --> J
```

### Key Components

**Hero.jsx** - Landing page entry point
- Handles initial prompt submission
- Creates workspace via Convex mutation
- Manages authentication state

**CodeView.jsx** - Main development environment
- Integrates Sandpack for code editing
- Manages file state and updates
- Handles token consumption tracking
- Switches between Code/Preview tabs

**ChatView.jsx** - AI conversation interface
- Displays message history
- Sends prompts to AI chat endpoint
- Renders markdown responses
- Handles error states

**Header.jsx** - Navigation and user management
- Google OAuth integration
- Export/Deploy action triggers
- User profile dropdown

---

## 🔧 Configuration

### Convex Schema
```typescript
// convex/schema.ts
export default defineSchema({
  workspaces: defineTable({
    userId: v.id("users"),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
    fileData: v.optional(v.any()),
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    token: v.number(),
  }),
});
```

### Sandpack Dependencies
```javascript
// From Lookup.js
DEPENDANCY: {
  "axios": "latest",
  "lucide-react": "latest",
  "react-router-dom": "latest",
  // Add more as needed
}
```

### AI Prompts
```javascript
// From Prompt.js
CODE_GEN_PROMPT: "Generate React components with hooks..."
CHAT_PROMPT: "Provide helpful development guidance..."
```

---

## 🎨 Customization

### Adding New Dependencies
```javascript
// data/Lookup.js
export default {
  DEPENDANCY: {
    "your-library": "version",
  }
}
```

### Modifying AI Behavior
```javascript
// data/Prompt.js
export default {
  CODE_GEN_PROMPT: "Your custom system prompt...",
  CHAT_PROMPT: "Your custom chat instructions...",
}
```

### Styling Changes
```jsx
// Modify Tailwind classes or update theme
// components use inline styles with Colors.js constants
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test across different prompts
- Update documentation as needed

---

## 🐛 Known Issues & Limitations

- Token system requires manual refresh
- Export feature downloads code only (no dependencies)
- Deploy functionality in development
- Large projects may hit token limits
- Sandpack has limited library support

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core code generation
- ✅ Real-time workspace
- ✅ AI chat refinement
- ✅ User authentication

### Phase 2 (In Progress)
- 🔄 Token purchase system
- 🔄 Project templates
- 🔄 Code export improvements
- 🔄 Deploy to production

### Phase 3 (Planned)
- 📋 Collaborative editing
- 📋 Version control
- 📋 Custom AI models
- 📋 Advanced analytics

---

## 📄 License

This project is private and proprietary. All rights reserved.

For licensing inquiries, contact the author.

---

## 👨‍💻 Author

**Priyanshu Vishwakarma**  
Full Stack Developer | AI Enthusiast

- 🔗 [GitHub](https://github.com/priyyannshhu)
- 💼 [Portfolio](https://priyanshu-v.vercel.app/)
- 📧 Contact via GitHub

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community:

- **[Next.js Team](https://nextjs.org/)** - For the incredible React framework
- **[Convex](https://www.convex.dev/)** - For real-time backend magic
- **[Google AI](https://ai.google.dev/)** - For Gemini API access
- **[CodeSandbox](https://codesandbox.io/)** - For Sandpack playground
- **[shadcn](https://ui.shadcn.com/)** - For beautiful UI components
- **[Tailwind Labs](https://tailwindcss.com/)** - For utility-first CSS

---

## 📞 Support

If you encounter issues or have questions:

1. Check existing [GitHub Issues](https://github.com/priyyannshhu/astra-ai/issues)
2. Open a new issue with detailed information
3. Provide reproduction steps and screenshots

---

<div align="center">

### ⭐ Star this repository if Astra AI helps you build faster!

**Built with 💜 by developers, for developers**

*Formerly known as MERN AI*

---

**[Live Demo](https://astra-aii.vercel.app)** • **[Documentation](#)** • **[Changelog](#)**

</div>