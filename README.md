# User-Role Assignment API

This API allows you to manage user-role assignments, allowing roles to be assigned to users, listed, and removed. It is built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## Features

- **Assign a role to a user**
- **List all user-role assignments** (can filter by user or role)
- **Remove a role assignment from a user**

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **MongoDB**: Ensure MongoDB is installed or use a MongoDB cloud instance.
- **TypeScript**: Install TypeScript globally if you haven't:
  ```bash
  npm install -g typescript
  ```

# Initialize Node.js project:

npm init -y

# Install dependencies:

npm install express mongoose
npm install typescript @types/node @types/express --save-dev

# Initialize TypeScript:

tsc --init

# Run an API

tsc -b
node dist/routes.js
