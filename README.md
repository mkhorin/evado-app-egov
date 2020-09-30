# Evado E-government

An application build on [Evado Declarative Framework](https://github.com/mkhorin/evado) 
provides services through electronic request forms. 

- Unique electronic form for each service.
- Limit permissions for clients, managers, and administrators.
- Support for third-party web interfaces through AJAX API.    

## Docker installation

Clone application to /app
```sh
cd /app
docker-compose up -d mongo
docker-compose up --build installer
docker-compose up -d server
```

## Typical installation

#### Install environment
- [Node.js](https://nodejs.org) (version 12)
- [MongoDB](https://www.mongodb.com/download-center/community) (version 4)

#### Linux
Clone application to /app
```sh
cd /app
npm install
NODE_ENV=development node console/install
NODE_ENV=development node console/start
```

#### Windows
Clone application to c:/app
```sh
cd c:/app
npm install
set NODE_ENV=development
node console/install
node console/start
```

## Usage

Web interface: [http://localhost:3000](http://localhost:3000)

Sign in as administrator:
```sh
Email: a@a.a
Password: 123456
```

## Tutorial
- [Build an App Without Coding](http://nervebit.com)