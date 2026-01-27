This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the root of the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

For production deployments, update `NEXT_PUBLIC_API_BASE_URL` to point to your backend API.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project to Vercel:
   ```bash
   vercel link
   ```

3. Set environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`: URL of your deployed backend API (e.g., `https://your-backend-app.herokuapp.com`)

4. Deploy:
   ```bash
   vercel --prod
   ```

### Manual Deployment

For manual deployment to other platforms:

1. Build the application:
   ```bash
   npm run build
   ```

2. The built application will be in the `out/` directory (for static export) or you can run it with:
   ```bash
   npm start
   ```

### Environment Configuration for Deployment

When deploying, ensure the following environment variable is set:
- `NEXT_PUBLIC_API_BASE_URL`: The URL where your backend API is hosted (include protocol, e.g., `https://your-api.com`)

For zero-downtime deployment, most platforms support this automatically when using the provided `vercel.json` configuration.