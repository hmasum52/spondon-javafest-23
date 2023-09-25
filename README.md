# Spondon

> Medical document store, verify and sharing platform with end-to-end encryption

[Youtube Presentaion](https://youtu.be/amAdNqmjz_s) 

## Project Overview

- Encourages user to __store and share__ their medical records with __end-to-end encryption__

- __Verify__ a documents’ __authenticity and identify__ prescription/medical record __tempering__

- Identify **patient negligence / doctor mistreatment** with share history

- **Doctor-Patient Confidentiality**, Patient has **full control** over his data

- **Faster** Medical document (eg. fitness certificate) **verification process**

- **Emergency** medical information

- **Organize** medical documents in **collection**, easily **share a group of documents**

- **Public health analysis** for Directorate General of Health Services (DGHS)

## Tech Stack

### Frontend

- ReactJS

- React Bootsrap

- Axios

- React Router

- Google Map SDK

- SCSS

### Backend

- Spring Boot

- Spring Web

- Spring Security

- JPA Hibernate

- JWT Token

- Lombok

- Stanford Core NLP

- Deep Learing for Java (dl4j)

- Word2Vec Pretrained Model

### Persitance

- ProsgreSQL Database

- Firebase Cloud Storage

## Deployment and Automation

### Frontend

**Deplyment:** [Netlify](https://sp0nd0n.netlify.app/) 

**CI/CD:** Trigger on `deply-frontend` branch

![](images\2023-09-25-23-30-17-image.png)

![](images\2023-09-25-23-28-44-image.png)

### Backend

> Backend was deplyed without NLP because the `deeplearning4j` and `Stanford Core NLP` take too much resources. Tokenization in the deployed version is done using regular expression and `Word2Vec` function similarity is rewritten by us in java.
> 
> This version of code is in `without-ai` branch

**Deplyment:** [Azure](https://spondon-backend-7.azuremicroservices.io)

**Docker Image**: [URL]([Docker](https://hub.docker.com/repository/docker/mjksabit/spondon-backend) `docker push mjksabit/spondon-backend:without-nlp` 

**CI/CD**: Trigger on `without-ai` branch

![](images\2023-09-25-23-36-40-image.png)

![](images\2023-09-25-23-37-44-image.png)

### Database

**Deployment**: Render

## Architecture & Data Flow

Three Tier Archirecture: Presentation Tier, Logic Tier, Data Tier

![](images\2023-09-25-23-41-00-image.png)

## External API

- **ImageBB**: To upload image

- **Endless Medical**: AI integrated symptom analyzer

- **ChatPDF**: Analyze pdf files and ask questions

## Entity Relationship Diagram

![](images\2023-09-25-23-43-32-image.png)

## End-to-end Encryption

- User have **RSA public-private key pair**, public key is  stored in the database

- When a document is uploaded, a **random password** is generated, which is used for **AES encryption** of the document

- The **generated key encrypted with user public key** stored in the database for accessing the document later

- All these are done at frontend

## AI tools used

- **Endless Medical**: AI integrated symptom analyzer [[link](https://endlessmedical.com/)]

- **ChatPDF**: Analyze pdf files and ask questions [[link](https://www.chatpdf.com/)]

- **Analysis**: **Stanford CoreNLP** with **deeplearing4j** for *tokenizing*, sentence splitting, sentiment etc analysis of anonymous data using **word2vec** pretrained model

## Project Structure

### Backend

```
Dockerfile

./java/com/github/mjksabit
└── spondon
    ├── SpondonBackendApplication.java
    ├── consts
    ├── controller
    │   └── All the controllers are here
    ├── model
    │   └── All the entities are here
    ├── repository
    │   └── All the repositories are here
    ├── security
    │   └── Security configuration and JWT Filter
    ├── service
    │   └── All the services
    └── util
resources
└── application.properties
```

### Frontend

```
public
└── PUBLIC folder required by React

src/app
├── App.js (Entry Point)
├── App.scss (SASS Root)
├── AppRoutes.js (React Router Entrypoint, Lazy loaded Components)
├── admin
│   └── Admin Related Components
├── api
│   └── All API calls
├── common
│   └── Common Components and security functions
├── doctor
│   └── Doctor Related Components
├── firebase-config.js
├── logo.svg
├── shared
├── user
│   └── Doctor Related Components
└── user-pages
    └── Auth Related Components
```

## Running the App

### Frontend

- Installing Dependency
  
  ```
  npm i
  ```

- Running frondend
  
  ```
  npm start
  ```

- Building frontend
  
  ```
  npm build
  ```

### Backend

- Running backend
  
  ```
  ./mvnw spring-boot:run
  ```

- Building backend
  
  ```
  ./mvnw clean package
  java -jar target/spondon-0.0.1-SNAPSHOT.jar
  ```

- Building & Running docker image
  
  ```
  docker build -t spondon-backend .
  docker run --env-file ./.env --expose=8080 -p 8080:8080 spondon-backend
  ```

- Environment Variable
  
  ```
  DB_PASSWORD=
  DB_URL=
  DB_USER=
  DEBUG_MODE=false
  GMAIL=
  GMAIL_SMTP_PASSWORD=
  JWT_SECRET=
  FRONTEND_URL=https://sp0nd0n.netlify.app
  ```