# Library Management System

A comprehensive Next.js-based library management system that allows librarians to manage books, members, and book borrowing/returning operations. Built with modern web technologies and a MySQL database backend.

## Features

- **Book Management**: Add, view, and manage library books with available copies tracking
- **Member Management**: Register and manage library members with personal information
- **Borrowing System**: Issue books to members with due dates and return functionality
- **User Authentication**: Secure login/logout system for librarians
- **Responsive UI**: Modern, responsive interface built with Tailwind CSS
- **Dashboard**: Overview of library operations and user information

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS, Geist font
- **Database**: MySQL with mysql2 driver
- **ORM**: Prisma (for database management)
- **Authentication**: bcryptjs for password hashing, JOSE for token handling
- **UI Components**: lucide-react icons
- **Animations**: Framer Motion
- **Language**: TypeScript

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate librarian users
- `POST /api/logout` - Log out current user

### Books
- `GET /api/books` - Retrieve all books in the library

### Members
- `GET /api/members` - Retrieve all library members
- `POST /api/members` - Register a new member

### Book Issues (Borrowing)
- `POST /api/issues` - Issue a book to a member
- `PATCH /api/issues/[id]/return` - Return a borrowed book

### Member History
- `GET /api/members/[id]/history` - Get borrowing history for a specific member

## Database Schema

The system uses a MySQL database with the following main tables:
- `books` - Stores book information (title, author, copies, etc.)
- `members` - Stores member information (name, email, phone, etc.)
- `issues` - Tracks book borrowing records (member, book, due date, return date)
- `librarians` - Stores librarian account information

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_HOST=localhost
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=library_db
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database server
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up your MySQL database and update the environment variables in `.env`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/                    # Next.js app router pages
├── api/               # API routes for backend functionality
│   ├── books/         # Book management endpoints
│   ├── issues/        # Borrowing/returning endpoints
│   ├── login/         # Authentication endpoints
│   ├── logout/        # Logout endpoint
│   └── members/       # Member management endpoints
├── books/             # Books page
├── dashboard/         # Dashboard page
├── login/             # Login page
├── members/           # Members page
├── components/        # Navbar component
├── layout.tsx         # Main layout with navigation
└── page.tsx           # Home page
lib/                   # Utility functions
├── db.ts              # Database connection
components/            # UI components
├── ui/                # UI component library
```

## Usage

1. **Login**: Access the system using librarian credentials
2. **Manage Books**: Add new books or view existing inventory
3. **Manage Members**: Register new members or view existing ones
4. **Issue Books**: Borrow books to members with due dates
5. **Return Books**: Process book returns and update availability

## Deployment

This application is designed to be deployed on platforms like Vercel. Make sure to configure your environment variables in the deployment platform.

### Vercel Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions about the library management system, please open an issue in the repository.