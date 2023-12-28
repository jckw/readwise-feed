# Readwise Feed

Readwise Feed is an experimental passive social media platform that showcases a number
of users' reading activity and interests in a single feed via syncing their activity
from Readwise.

It is built with Next.js, Prisma, and Vercel Postgres.

## Demo

https://readwise-feed.vercel.app/

## How it works

There are two kinds of activity on Readwise: highlights and bookmarking (via the Reader
app).

The app fetches the latest highlights and bookmarks from Readwise's API and stores them
in a Postgres database. It then fetches the latest highlights and bookmarks from the
database and displays them in a feed.

Every 30 minutes, the app syncs the latest highlights and bookmarks from Readwise's
API.

The feed works for books, articles, Tweets, podcasts, etc. – anything that can be added
to Readwise.
