# Uddog Fundraising Platform

A modern, full-stack fundraising platform built with Next.js, enabling users to create campaigns, accept donations, and manage their fundraising efforts.

## Features
- Campaign creation and management
- Secure donations via Stripe
- Real-time updates with Supabase
- Admin dashboard for platform management
- Role-based authentication

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Integrations**: Stripe, Supabase, Cloudinary

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uddog-fundraising-platform.git
   cd uddog-fundraising-platform
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required variables in `.env.local`.
4. Set up the database:
   ```bash
   pnpx prisma generate
   pnpx prisma db push
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Additional Commands
- Clean up the project:
  ```powershell
  Remove-Item -Recurse -Force .next
  Remove-Item -Recurse -Force node_modules
  ```
- Reinstall dependencies:
  ```bash
  pnpm install
  ```
- Start the application:
  ```bash
  pnpm start
  ```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
