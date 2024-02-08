# HealthBot

HealthBot is a chatbot application that has information about UCSD health services and can help students find the right health service for their needs.

## Installation

To install the project, you will need to have Node.js and yarn installed on your machine. You can download Node.js from the [official website](https://nodejs.org/en/). You can install yarn using npm by running the following command:

```bash
npm install --global yarn
```

After installing Node.js and yarn, you can install the project dependencies by running the following command in the project root directory:

```bash
yarn install
```

## Usage

To start the project, you can run the following command in the project root directory:

```bash
yarn expo start
```

This will start the Expo development server and open the project in your default web browser. You can then use the project by scanning the QR code with the Expo Go app on your mobile device or by running the project in an iOS or Android simulator.

## GitHub Actions

This project uses GitHub Actions to automatically run tests and deploy the code on every push to the main branch. The workflow files are located in the `.github/workflows` directory. The tests are run using Jest and the code is deployed to Expo using the `eas-cli` package. The deployment is only triggered when the tests pass. Whenever a pull request is opened or updated, the tests are run and an Expo preview is created.
