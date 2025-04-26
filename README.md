# POST MAN ENDPOINTS FOR COURSE CREATION AND REVIEW

POST: {{bloopBaseUrl}}/courses

POST: {{bloopBaseUrl}}/courses/01967432-f1d0-7b29-b4a0-526f60856e56/update-modules

GET: /courses

GET: /courses/${id}

GET: /users

GET: /user

## THIS ONES MUST BE ENABLED AFTER ALAN UPDATES COURSE INFO

POST: {{bloopBaseUrl}}/users ======== > creates basic user

POST: {{bloopBaseUrl}}/courses/enroll ======> enroll user and course



# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
