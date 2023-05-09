# CF Pages Basic Auth

This works by the `functions/_middleware.ts` which runs on every request. That is the only file you need to copy from this repo for it to work. You need to add an environement variable to your pages project called `USERS`, it should be a stringified `User[]`.

You can test out the [demo here](cf-pages-basic-auth.pages.dev), with username `ghost` and password `test`.
 