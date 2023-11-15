# ShopBetter. AI

Visit our website at [https://shopbetter.leow.io](https://shopbetter.leow.io)

[The GitHub repo](https://github.com/ImPrankster/shop-better-ai)

## Introduction

- The website will display different product images and product description text/tagline with different selected preferences. The products are just placeholders.
- You are able to select different preferences in account settings page
- The to-B console is able to upload product information on the console, uploaded texts will be run through GPT4 recursively with all preference tags to generate different taglines and descriptions. Uploaded text will go through different kinds of image generator models. (not done automatically right now) In the future we can also implement parsing of other files like pdfs with frameworks like LangChain.

## Website architecture

### Technology used

- Next.js
- TailwindCSS
- TRPC
- Prisma
- shadcn/ui

### Service providers

- Auth service hosted on Clerk.
- DB service hosted on PlanetScale.
- Media storage hosted on Cloudinary.
