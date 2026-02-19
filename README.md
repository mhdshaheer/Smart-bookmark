# Smart Bookmark App

A production-ready bookmark manager built with **Next.js 15 (App Router)**, **Supabase**, and **Tailwind CSS**. This application features secure Google OAuth authentication, Row Level Security (RLS) for data protection, and real-time updates across multiple browser tabs.

## 🚀 Key Features

- **Google OAuth Login**: Secure authentication powered by Supabase Auth.
- **Protected Dashboard**: Server-side route protection ensuring only authenticated users can access their bookmarks.
- **CRUD Operations**: Add, view, and delete bookmarks with instant feedback.
- **Real-time Sync**: Uses Supabase Realtime to sync changes across all open tabs instantly.
- **Security First**: Row Level Security (RLS) ensures users can only access their own data.
- **Responsive Design**: A clean, premium UI built with Tailwind CSS that works on all devices.

## 🏗 Architecture Explanation

This project follows a modern **Serverless/BaaS** architecture:

- **Frontend**: Next.js App Router for server-rendered pages and client components where interactivity is needed.
- **Backend-as-a-Service (BaaS)**: Supabase handles everything from Authentication to Database and Real-time subscriptions.
- **Session Management**: Middleware-based session refreshing using `@supabase/ssr` to ensure the authentication state is always in sync between the client and server.
- **Data Flow**: 
  - Server components fetch the initial user state.
  - Client components handle user interactions and subscribe to database changes via WebSockets (Supabase Realtime).

## 🗄 Database Schema

The application uses a single table in the `public` schema of PostgreSQL:

### `bookmarks` Table

| Column | Type | Description |
| --- | --- | --- |
| `id` | `uuid` | Primary key, defaults to `gen_random_uuid()` |
| `user_id` | `uuid` | Foreign key referencing `auth.users.id` |
| `title` | `text` | The display name of the bookmark |
| `url` | `text` | The validated URL |
| `created_at` | `timestamptz` | Defaults to `now()` |

## 🛡 Row Level Security (RLS)

RLS is enabled to ensure data privacy. The following policies are implemented:

1.  **SELECT**: `auth.uid() = user_id`
    - Users can only read bookmarks where their user ID matches the record's `user_id`.
2.  **INSERT**: `auth.uid() = user_id`
    - Users can only insert new bookmarks where the `user_id` matches their own ID.
3.  **DELETE**: `auth.uid() = user_id`
    - Users can only delete their own bookmarks.

### SQL Setup
```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

alter table bookmarks enable row level security;

create policy "Users can view their own bookmarks" on bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert their own bookmarks" on bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own bookmarks" on bookmarks for delete using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

## ⚡ Real-time Implementation

Real-time functionality is implemented using Supabase Channels in the `BookmarkList.tsx` component:

- Upon mounting, the component subscribes to a channel named `bookmarks-realtime`.
- It listens for `INSERT` and `DELETE` events on the `bookmarks` table.
- When an event occurs, the local state is updated immediately without a full page refresh:
  - `INSERT`: Prepend the new record to the list.
  - `DELETE`: Filter out the deleted record by ID.

## 🚀 Deployment Steps

1.  **Supabase Setup**:
    - Create a new project in [Supabase](https://supabase.com).
    - Run the provided SQL in the SQL Editor.
    - Go to `Authentication > Providers` and enable **Google**.
    - Configure Google Cloud Console credentials and paste them into Supabase.
2.  **Deploy to Vercel**:
    - Import the repository.
    - Set Environment Variables:
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Complete the deployment.
3.  **Configure Redirects**:
    - In Supabase `Auth > URL Configuration`, add your Vercel URL (e.g., `https://your-app.vercel.app/auth/callback`) to the redirect list.

## 💻 How to Run Locally

1.  **Clone the repo**:
    ```bash
    git clone <your-repo-url>
    cd smart-bookmark
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup `.env.local`**:
    - Copy `.env.example` to `.env.local`.
    - Fill in your Supabase credentials.
4.  **Run development server**:
    ```bash
    npm run dev
    ```
5.  **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 🛠 Troubleshooting & Challenges

### 1. Real-time Synchronization Issues
- **Problem**: New bookmarks were not appearing in real-time across tabs despite having the `.subscribe()` logic in place.
- **Solution**: Discovered that Supabase requires the table to be explicitly added to the `supabase_realtime` publication. Additionally, adjusted the subscription logic to wait for the Auth session to initialize to prevent race conditions during the initial connection.

### 2. External API 404 Performance (Favicons)
- **Problem**: Google's Favicon service (`t1.gstatic.com`) returns a 404 error when requested for `localhost` or internal IP addresses, cluttering the developer console and increasing useless network requests.
- **Solution**: Implemented a filtering utility `getFaviconUrl` that detects local/internal hostnames and provides an immediate inline SVG fallback, preventing the unnecessary network calls.

### 3. Google OAuth Redirect Loop
- **Problem**: After authentication on production, users were being redirected to `http://localhost:3000` or the root `/` instead of the dashboard.
- **Solution**: Identified that Supabase strictly validates `redirectTo` URLs for security. Added the production callback URL (`/auth/callback`) to the Supabase "Redirect URLs" whitelist and updated the client-side logic to dynamically pass the current origin to the `signInWithOAuth` function.
