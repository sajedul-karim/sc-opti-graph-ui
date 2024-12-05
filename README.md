# Vite React TypeScript Starter

This project is a starter template for building applications using React, TypeScript, and Vite. It includes a minimal setup with hot module replacement (HMR) and some ESLint rules to ensure code quality.

## Features

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A fast build tool and development server.
- **Apollo Client**: A comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Getting Started

### Prerequisites

Ensure you have Node.js and Yarn installed on your machine. It's recommended to use `nvm` (Node Version Manager) to manage your Node.js versions. You can select the appropriate Node.js version with:

```bash
nvm use target_version
```

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd sc-opti-graph-ui
   ```

3. Install the dependencies:

   ```bash
   yarn install
   ```

4. Set up the environment variables:

   Create a `.env` file in the root of your project and add the following variable:

   ```plaintext
   VITE_CONTENT_GRAPH_AUTH=your_auth_token_here
   ```

   Replace `your_auth_token_here` with your actual authentication token.
   If you visit https://cmp.optimizely.com/cloud/settings/organization and click the "Misc." tab, then scroll down there is a Optimizely Graph Settings section at the bottom. The "Structured Content" section has an app & secret key and a GraphiQL URL. From GraphiQL URL you will get the auth.

### Running the Development Server

To start the development server, run:

```bash
yarn dev
```

This will start Vite's development server and open the application at [http://localhost:5173/](http://localhost:5173/).

### Building for Production

To build the application for production, run:

```bash
yarn build
```

This will create an optimized build of your application in the `dist` directory.

### Linting

To lint your code, run:

```bash
yarn lint
```

This will check your code for any linting errors based on the ESLint configuration.

## Project Structure

- **src/**: Contains the source code for the application.
  - **components/**: Contains React components.
  - **App.tsx**: The main application component.
  - **main.tsx**: The entry point of the application.
- **public/**: Contains static assets.
- **index.html**: The main HTML file.
- **package.json**: Contains project metadata and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **.eslintrc.cjs**: ESLint configuration file.
- **tailwind.config.js**: Tailwind CSS configuration file.
- 

### Sample request:
```bash
query {
  CGLibrary_V1(locale: en_US) {
    total
    items {
      ContentGuid
      title
      cover {
        assetGuid
        assetType
      }
      authors {
        ContentGuid
        ... on Author_V1 {
          name
          dob
        }
      }
      genres {
        ... on Genre_V1 {
          name
        }
      }
    }
  }
}
```

### sample response:
```bash
{
  "data": {
    "CGLibrary_V1": {
      "total": 3,
      "items": [
        {
          "ContentGuid": "52a748d7803c44dea3f736a585c09c8f",
          "title": "Odyssey",
          "cover": {
            "assetGuid": "2bfa24c6b09311efaa56f2fadab6374e",
            "assetType": "image"
          },
          "authors": [
            {
              "ContentGuid": "ac9e14af114f4da495978102d448e5a6",
              "name": "Homar",
              "dob": null
            }
          ],
          "genres": [
            {
              "name": "Epic Poetry"
            }
          ]
        },
        {
          "ContentGuid": "9f15fb98e7814401bccf581e33c56241",
          "title": "Iliad",
          "cover": {
            "assetGuid": "2c45c9eeb09311efa65f76e3456da660",
            "assetType": "image"
          },
          "authors": [
            {
              "ContentGuid": "7db28dfe44934f65a0705a29d493f0e8",
              "name": "Homer",
              "dob": null
            }
          ],
          "genres": [
            {
              "name": "Epic Poetry"
            }
          ]
        },
        {
          "ContentGuid": "326b610fcd3e48b796999f55a91b6064",
          "title": "Paradise Lost",
          "cover": {
            "assetGuid": "2c410adab09311ef8cd0d6e06e13d2b8",
            "assetType": "image"
          },
          "authors": [
            {
              "ContentGuid": "ff44f4dda70f4e4cb644b5ec699f6b25",
              "name": "John Milton",
              "dob": "2024-12-02T09:56:00Z"
            }
          ],
          "genres": [
            {
              "name": "Epic Poetry"
            }
          ]
        }
      ]
    }
  },
  "extensions": {
    "correlationId": "8ebab11be9eba48e",
    "cost": 28,
    "costSummary": [
      "CGLibrary_V1(28) = limit(20) + fields(8)"
    ]
  }
}
```
