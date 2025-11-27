# Credentia: Blockchain Credential Verification System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React-61DAFB.svg)
![Solidity](https://img.shields.io/badge/Blockchain-Solidity-363636.svg)
![Ethereum](https://img.shields.io/badge/Network-Sepolia-gray.svg)

## 📌 Project Overview

**Credentia** is a Decentralized Application (DApp) designed to solve the problem of credential fraud and fake degrees. By leveraging the **Ethereum Blockchain**, this system allows universities to issue digital academic credentials that are **immutable, tamper-proof, and instantly verifiable**.

Unlike traditional databases where records can be altered or deleted, Credentia secures student data using cryptographic hashing on a decentralized ledger.

![Main Dashboard](image_a64696.png)

---

## 🚀 Key Features

### 🔐 Core Security
* **Immutable Record Keeping:** Once a credential is mined, it cannot be deleted or altered by anyone (including the issuer).
* **Cryptographic Hashing:** Uses the SHA-256 (Keccak) algorithm to generate a unique digital fingerprint for every degree.
* **Duplicate Prevention:** Smart logic ensures that a Student ID cannot be registered twice, preventing fraud.

### 💻 User Interface & Experience
* **Role-Based Access:** Distinct interfaces for Universities (Issuers) and Employers (Verifiers).
* **Live Blockchain Visualizer:** A real-time animated dashboard that shows blocks being added to the chain and synced.
* **Instant Verification:** Employers can verify credentials in milliseconds using the Transaction Hash.
* **System Architecture View:** A dedicated educational tab explaining how the Frontend connects to the Smart Contract.

### ⚙️ Utilities
* **Smart Contract Transparency:** Built-in code viewer allowing users to inspect the Solidity logic directly in the app.
* **Email Integration Simulation:** Simulates the delivery of the digital certificate and hash key to the student's inbox.
* **Clipboard Management:** One-click copying of complex cryptographic hashes.

---

## 📸 Application Demo & Workflow

### 1. Live Blockchain Network
The application features a live visualization of the blockchain network, showing blocks as they are mined and verified in real-time.

![Blockchain Visualizer](image_b0243e.png)

### 2. Issuing a Credential (University Role)
The Admin enters the Student Name, Unique ID, Course, and Email. The system generates a unique cryptographic hash using `keccak256`.

![Issuing Interface](image_a64696.png)

**Success State:** Once the block is mined, the system confirms the issuance and sends a simulated email to the student.

![Success Message](image_a646b3.png)

### 3. Verifying a Credential (Employer Role)
The Employer receives a Hash ID from the candidate and pastes it into the portal. The system queries the blockchain to validate the record instantly.

![Verification Interface](image_a646d5.jpg)

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Icons:** Lucide-React
* **Smart Contract:** Solidity (v0.8.0)
* **Development Environment:** Remix IDE / Node.js

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js installed on your computer.

### Step 1: Clone the Repository
git clone [https://github.com/Codex2Harsh/Credentia.git](https://github.com/Codex2Harsh/Credentia.git)
cd Credentia
### Step 2: Install Dependencies
npm install
### Step 3: Run the Application
npm run dev
Open your browser and navigate to: http://localhost:5173 (or the port shown in your terminal).
---

## ⛓️ Smart Contract Deployment

To see the backend logic in action on the real blockchain VM:

1. Open the file `contracts/CredentialVerifier.sol` in this repository.  
2. Copy the code.  
3. Go to **Remix IDE**.  
4. Create a new file, paste the code, and compile it.  
5. Deploy it to the **Sepolia Testnet** or **Remix VM**.

---

## ⚠️ Simulation Note

For smooth classroom demonstration and to avoid requiring Judges/Users to install browser wallets (like MetaMask), the React Frontend currently runs in **Simulation Mode**.

- The Frontend mimics network latency and block mining visualization.  
- The Logic (Hashing and Storage) is **mathematically identical** to the Solidity contract in `/contracts/CredentialVerifier.sol`.

---
