
## Demo

LIVE DEMO: https://sc-opti-graph-ui.vercel.app/

![Screenshot 2024-12-05 at 6 05 19 PM](https://github.com/user-attachments/assets/bd2de7e0-de28-4613-aa72-497116deff4d)

![Screenshot 2024-12-05 at 6 05 35 PM](https://github.com/user-attachments/assets/ac7cd8d8-5d4b-47e5-920d-789fdbf2dfb2)


Video Demo:
https://episerver99-my.sharepoint.com/:v:/g/personal/sajedul_karim_optimizely_com/EckQWAgqNntEhwcYLSWToUQBumvfyppKSIGjEXtP2MOwCg?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=LOHRUm

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
nvm use <target_version>
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
   VITE_CG_SC_AUTH=<YOUR_SC_AUTH_TOKEN>
   VITE_CG_DAM_AUTH=<YOUR_DAM_AUTH_TOKEN>
   ```

   Replace `your_auth_token_here` with your actual authentication token.
   If you visit https://cmp.optimizely.com/cloud/settings/organization and click the "Misc." tab, then scroll down there is a Optimizely Graph Settings section at the bottom. The "Structured Content" section has an app & secret key and a GraphiQL URL. From GraphiQL URL you will get the auth. You can also get the dam auth token from the same page.

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

### Request sequence

1. Get product list
2. load product image from DAM
3. For product details, load product and rendition images from DAM

### Sample request for product list:
```bash
query MyQuery {
  ECProducts_V1(orderBy: { id: DESC }) {
    total
    items {
      ContentGuid
      id
      price
      productDescription
      productTitle
      publishDate
      cover {
        assetGuid
        assetType
      }
    }
  }
}
```

### sample response:
```bash
{
  "data": {
    "ECProducts_V1": {
      "total": 5,
      "items": [
        {
          "ContentGuid": "68791e87c1394dbfa10c2608c9c34536",
          "id": 2,
          "price": 899,
          "productDescription": "<p class=\"p1\">The OnePlus 12 redefines speed with the Snapdragon 8 Gen 3 processor, a stunning 6.7-inch AMOLED display with a 120Hz refresh rate, and a powerful triple-camera setup. Experience ultra-fast charging and all-day battery life in a sleek design.</p>",
          "productTitle": "OnePlus 12",
          "publishDate": "2024-12-05T10:09:54Z",
          "cover": {
            "assetGuid": "9215e94cb2bf11ef8d4d66ce9fd9312f",
            "assetType": "image"
          }
        },
        {
          "ContentGuid": "bc7b70289be4464bb9c910b977d19dda",
          "id": 1,
          "price": 1199,
          "productDescription": "<p class=\"p1\">The iPhone 15 Pro features a titanium frame, A17 Pro chip, and a stunning Super Retina XDR display. With an advanced camera system, USB-C compatibility, and powerful performance, it’s designed for professionals and enthusiasts alike.</p>",
          "productTitle": "iPhone 15 Pro",
          "publishDate": "2024-12-05T10:09:54Z",
          "cover": {
            "assetGuid": "015e9740b2c011ef8bf8923762cb3fa1",
            "assetType": "image"
          }
        }
      ]
    }
  },
  "extensions": {
    "correlationId": "8ed39490b8c2a47b",
    "cost": 28,
    "costSummary": [
      "ECProducts_V1(28) = limit(20) + fields(8)"
    ]
  }
}
```

### Sample request for image from DAM:
```bash
query MyQuery {
  PublicImageAsset(where: { Id: { eq: "52e0b570b2f811ef94c85eec0cc5c1b0" } }) {
    items {
      Id
      Title
      Url
      Renditions {
        Name
        Url
        Height
        Width
      }
    }
  }
}
```

### Sample response:
```bash
{
  "data": {
    "PublicImageAsset": {
      "items": [
        {
          "Id": "52e0b570b2f811ef94c85eec0cc5c1b0",
          "Title": "Image",
          "Url": "https://files.marketing.cmp.optimizely.com/images/assets/Image/Zz01MmUwYjU3MGIyZjgxMWVmOTRjODVlZWMwY2M1YzFiMA==",
          "Renditions": [
            {
              "Name": "WEBP - Best",
              "Url": "https://images.cmp.optimizely.com/563fe1aab2f811efa8f21a6c2af46147",
              "Height": 1024,
              "Width": 1024
            },
            {
              "Name": "JPG",
              "Url": "https://images.cmp.optimizely.com/564145ccb2f811ef9fb616f3bb100606",
              "Height": 1024,
              "Width": 1024
            },
            {
              "Name": "PNG",
              "Url": "https://images.cmp.optimizely.com/5648a448b2f811efa8f21a6c2af46147",
              "Height": 1024,
              "Width": 1024
            },
            {
              "Name": "Low Quality",
              "Url": "https://images.cmp.optimizely.com/a46be9dab2fa11ef9fb616f3bb100606",
              "Height": 512,
              "Width": 512
            }
          ]
        }
      ]
    }
  },
  "extensions": {
    "correlationId": "8ed3cfd1ed93a475",
    "cost": 29,
    "costSummary": [
      "PublicImageAsset(29) = limit(20) + fields(7) + basicFilter(1)*2"
    ]
  }
}
```
