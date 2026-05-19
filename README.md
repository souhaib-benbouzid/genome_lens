<p align="center">
    <img src="./frontend/src/assets/banner.png" alt="GenomeLens Logo" width="345" />
</p>

<p align="center">
Browse, Filter, Search and Visualize genomes and more.
</p>

<p align="center">
<a href="https://github.com/souhaib-benbouzid/genome_lens"><img src="https://img.shields.io/github/stars/souhaib-benbouzid/genome_lens?style=social" alt="GitHub Stars"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/issues"><img src="https://img.shields.io/github/issues/souhaib-benbouzid/genome_lens" alt="GitHub Issues"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/commits/master"><img src="https://img.shields.io/github/last-commit/souhaib-benbouzid/genome_lens" alt="Last Commit"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/pulls"><img src="https://img.shields.io/github/issues-pr/souhaib-benbouzid/genome_lens" alt="Pull Requests"></a>
<a href="https://github.com/souhaib-benbouzid/genome_lens/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

## Architecture

The architecture of GenomeLens is designed to be modular and scalable. The backend and frontend are decoupled, allowing for independent development and deployment. The backend serves as an API layer that the frontend consumes to display data and provide interactive features to the users.

[Read more about the architecture](./ARCHITECTURE.md)

## Backend

The backend is built using Python and FastAPI. It provides APIs to fetch genome data, filter it based on various criteria, and perform search operations.

[Read more about the backend implementation](./backend/README.md)

## Frontend

The frontend is built using React. It provides a user interface to interact with the backend APIs, allowing users to browse, filter, search, and visualize genome data.

[Read more about the frontend implementation](./frontend/README.md)

## Running the Application

To run the application, you can use Docker Compose. Make sure you have Docker installed on your machine.

1. Clone the repository:

   ```bash
   git clone
   ```

2. Navigate to the project directory:
   ```bash
   cd genome_lens
   ```
3. Create a `.env.prod` file in both the frontend and backend directories by copying the provided `.env.example` and adjusting the values as needed:

   ```bash
   cp frontend/.env.example frontend/.env.prod
   cp backend/.env.example backend/.env.prod
   ```

4. Start the application using Docker Compose:
   ```bash
    docker-compose -f docker-compose.prod.yml up --build
   ```
   This will build the Docker images for both the backend and frontend, and start the containers. The frontend will be accessible at `http://localhost:80`.
   THE BACKEND API WILL IS NOT EXPOSED TO THE HOST IN PRODUCTION MODE FOR SECURITY REASONS. IT IS ONLY ACCESSIBLE TO THE FRONTEND CONTAINER.

## Running in Development Mode

To run the application in development mode, you can use the provided `docker-compose.dev.yml` file. This setup allows for hot-reloading of both the backend and frontend code.

1. Create a `.env` file in both the frontend and backend directories by copying the provided `.env.example` and adjusting the values as needed:

   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

2. Start the application in development mode:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```
   This will build the Docker images for both the backend and frontend, and start the containers with hot-reloading enabled. The frontend will be accessible at `http://localhost:8080` and the backend API will be accessible at `http://localhost:8000`.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, please feel free to open an issue or submit a pull request.
