# ToDoList dApp on Aptos

Welcome to the ToDoList dApp built on the Aptos blockchain using the Move language! This dApp allows users to create lists of tasks and sub-tasks, providing a decentralized way to manage your to-dos.

## Features

- **Task Management**: Create, update, and delete tasks.
- **Sub-Task Support**: Add sub-tasks under each main task.
- **Decentralized**: Built on the Aptos blockchain, ensuring data integrity and security.
- **Modern UI**: Frontend built with React and Ant Design for a sleek and responsive user experience.

## Tech Stack

- **Backend**: Aptos blockchain with smart contracts written in Move language.
- **Frontend**: React, TypeScript, and Ant Design (antd) component library.
- **Styling**: Ant Design for consistent and customizable UI components.

## Installation

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Aptos CLI](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli)

### Clone the Repository

```bash
git clone https://github.com/ShivankK26/ToDoList-dApp-Aptos.git
cd todo-list-dapp
```

### Backend Setup

1. Install the Aptos CLI and set up your local development environment.
2. Compile and deploy the Move smart contracts to the Aptos blockchain.

```bash
cd contracts
aptos move compile
aptos move publish
```

### Frontend Setup

1. Install the dependencies:

```bash
cd client
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## Usage

1. Open the application in your browser.
2. Connect your Aptos wallet.
3. Create a new task list and add tasks and sub-tasks as needed.
4. Manage your to-dos directly from the decentralized application.



