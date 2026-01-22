# Deploy the monorepo to Vercel

Follow instructions in [`1`].

When importing the monorepo and choosing the subdirectory for a project, don't fogret to select the framework - Express for `./api` and Next.js for `./app` - for some reason, it doesn't automatically detect the framework (at least, for the Express part). Alternatively, you can select the framework after importing, in the project's Settings - after that, you have to redeploy.

First, import `./api`. Then, get it's deployment url, e.g., `https://vercel-monorepo-plum.vercel.app`.

Then, when importing `./app`, add this url as the `API_URL` environment variable.

Now, Next.js in `./app` can talk to `./api` (it uses `API_URL` as the base url for requests to the API).

After importing the projects, in the root directory (i.e., where this readme is located), run:

`vercel link --repo`

This will create `.vercel` directory here.

Then, in this directory, you can run `vercel --prod`. It will prompt you to choose the project you want to deploy - the project for `./app` or for `./api`.

# Refs

1. https://vercel.com/docs/monorepos
