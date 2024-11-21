# Parity Deals Mock

This project is a mock of the website [paritydeals.com](https://paritydeals.com) built using Next.js & Clerk, PostgreSQL, Drizzle ORM, Neon, Shadcn UI for unstyled components, Tailwind CSS, and Stripe integration. Created using guidance from WebDevSimplified.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Database](#database)
- [Stripe Integration](#stripe-integration)
- [License](#license)

## Features

- Serverless PostgreSQL with Neon
- Modern developer features such as serverless, branching, bottomless storage
- Stripe integration for handling subscriptions
- Tailwind CSS for styling
- Shadcn UI for unstyled components
- Drizzle ORM for database interactions
- Clerk for authentication and user handling

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- **Database Hosting**: [Neon](https://neon.tech/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Authentication**: [Clerk](https://clerk.dev/)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/parity-deals-mock.git
   cd parity-deals-mock
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=your_neon_database_url
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_SERVER_URL=your_public_server_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=your_clerk_sign_in_url
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=your_clerk_sign_up_url
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=your_clerk_sign_in_force_redirect_url
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=your_clerk_sign_up_force_redirect_url
   ```

4. Run the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables are used in this project:

- `DATABASE_URL`: The connection string for your Neon SQLPostgre.
- `STRIPE_SECRET_KEY`: Your Stripe secret key for API access.
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret for verifying webhook events.
- `NEXT_PUBLIC_SERVER_URL`: The public URL of your server.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: The URL for Clerk sign-in.
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: The URL for Clerk sign-up.
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`: The URL for Clerk sign-in force redirect.
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL`: The URL for Clerk sign-up force redirect.

## Scripts

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for linting errors.
- `npm run db:generate`: Generates the Drizzle ORM schema.
- `npm run db:migrate`: Runs database migrations.
- `npm run db:studio`: Opens Drizzle ORM studio.
- `npm run db:updateCountryGroups`: Updates country groups in the database.
- `npm run stripe:webhooks`: Listens for Stripe webhooks.

## Database

This project uses Neon for PostgreSQL database hosting. Neon is a fully managed serverless PostgreSQL with a generous free tier. It separates storage and compute, and offers modern developer features such as serverless, branching, bottomless storage, and more. Neon is open source and written in Rust.

### Schema

The database schema includes several tables to manage products, subscriptions, and country-specific discounts. Here are some key tables and their relationships:

- **products**: Stores product information.
- **user_subscriptions**: Stores user subscription details, linked to products and users.
- **country_groups**: Stores country group information for discounts.
- **country_group_discounts**: Stores discount information for country groups and products.
- **countries**: Stores country information, linked to country groups.
- **product_views**: Stores product view information, linked to products and countries.

### Complexities

- **Foreign Keys**: The schema uses foreign keys to maintain relationships between tables. For example, `country_group_discounts` has foreign keys linking to `country_groups` and `products`.
- **Indexes**: Indexes are used to optimize queries, such as `user_subscriptions.clerk_user_id_index` for quick lookups by user ID.
- **Composite Primary Keys**: Some tables, like `country_group_discounts`, use composite primary keys to ensure unique combinations of columns.
- **Data Retrieval**: Pulling data involves joining multiple tables. For example, retrieving product views by country requires joining `product_views`, `products`, and `countries`.

### Migrations

To run database migrations, use the following command:

```sh
npm run db:migrate
```
