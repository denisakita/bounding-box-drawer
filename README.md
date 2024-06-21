# Bounding Box Drawer Frontend

## Overview

The Bounding Box Drawer Frontend is a TypeScript React-based web application that allows users to draw, save, and manage
bounding
boxes on images. It integrates with the backend to handle image storage and bounding box data management. The
application consists of two main components: a landing page and a bounding box editor.

## Features

- **Landing Page**: Browse and upload images.
- **Bounding Box Editor**: Draw and manage bounding boxes on images.
- **Integration with Backend**: Communicate with the backend for image and bounding box management.
- **Responsive Design**: User-friendly interface suitable for various devices.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Application](#running-the-application)
4. [Project Structure](#project-structure)
5. [Services](#services)
6. [Components](#components)
7. [License](#license)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.12.2)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bounding-box-drawer-frontend.git
    cd bounding-box-drawer-frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

The base URL for the backend API is set in the service files. Ensure that the backend is running and the `BASE_URL` is
correctly configured:

```javascript
const BASE_URL = 'http://localhost:5000/api';
```

## Running the Application

1. **Start the development server:**

    ```bash
    npm start
    # or
    yarn start
    ```

2. **Access the application:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

Here's a brief overview of the project structure:

```
bounding-box-drawer-frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── BoundingBoxEditor.tsx
│   │   └── ...
│   ├── services/
│   │   ├── imageService.ts
│   │   ├── boundingBoxService.ts
│   │   └── ...
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── .gitignore
├── README.md
└── package.json
```

## Services

The frontend communicates with the backend using the following services:

- **Image Service (`imageService.ts`):**

- **Bounding Box Service (`boundingBoxService.ts`):**

## Components

The frontend has two main components:

- **Landing Page (`LandingPage.tsx`)**: This component provides an overview of uploaded images and allows users to
  upload new images.

- **Bounding Box Editor (`BoundingBoxEditor.tsx`)**: This component enables users to draw and manage bounding boxes on
  images.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
