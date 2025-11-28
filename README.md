# Credentia: Blockchain-Based Credential Verification System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636.svg)

## 📄 Project Overview

**Credentia** is a decentralized application (DApp) designed to securely issue and verify academic credentials using Ethereum blockchain technology. It replaces vulnerable, centralized certificate systems with an immutable, tamper-proof, and instantly verifiable digital credentialing framework.

By leveraging smart contracts, cryptographic hashing, and decentralized storage, Credentia ensures that student certificates cannot be forged, manipulated, or deleted—offering a secure and trustless verification standard for universities and employers.

---

## 🎯 Purpose of the Project

This project addresses a major real-world problem: **fake degrees, forged certificates, and slow/inefficient verification processes.**

Traditional verification depends on:
- Paper certificates
- Long verification cycles
- Manual checks by universities
- Vulnerable databases

**Credentia completely removes these limitations** by shifting credential authentication to the blockchain, enabling:
- ✅ Instant verification
- ✅ Zero dependency on middlemen
- ✅ Permanent tamper-proof records
- ✅ Universally accessible proof-of-authenticity

---

## 🧠 Core Technologies Used

### 1. Blockchain & Smart Contracts

- **Ethereum (Sepolia Testnet)**  
  Used as the decentralized ledger to store and validate credentials.

- **Solidity (0.8.x)**  
  Smart contract language used to implement:
  - Credential issuance
  - Credential verification
  - Event-based record logging
  - Duplicate ID prevention

### 2. Cryptography

- **Keccak-256 Hashing**  
  Generates a unique 32-byte Credential ID:
recordId = keccak256(studentName + course + institution + timestamp + issuer)
Ensures:
- Uniqueness
- Immutability
- Security

### 3. Web3 Integration

- **Ethers.js v6**  
Bridges the frontend with the blockchain:
- Sends transactions
- Reads on-chain data
- Parses event logs

- **MetaMask**  
Handles user authentication and transaction signing.

---

## 💻 Frontend Technologies

- **React.js**  
Component-based UI for issuing & verifying credentials with real-time blockchain interaction

- **Tailwind CSS**  
Fast, responsive layout with a clean professional interface

- **Lucide Icons**  
Modern vector-based icons for UI clarity

- **Vite**  
Lightning-fast development environment

---

## 🔧 Development Tools

- **Remix IDE** → For writing, compiling, and deploying Solidity smart contracts
- **Node.js / npm** → For managing frontend packages
- **VS Code** → Code editor

---

## ⚙️ Tech Stack Overview

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, Vite |
| **Blockchain Layer** | Ethereum Sepolia, Solidity, Smart Contracts |
| **Web3 Layer** | Ethers.js, MetaMask |
| **Dev Tools** | Remix IDE, Node.js, VS Code |

---

## 💼 Key Features

### ✔ Issuing Credentials
Universities input student details → Smart contract creates an immutable on-chain record → Returns a Credential Hash.

### ✔ Verifying Credentials
Employers paste the Credential Hash → Smart contract validates the record → Returns authentic certificate details instantly.

### ✔ Duplicate Prevention
Student IDs are hashed and stored to ensure the same ID cannot be issued twice.

### ✔ Blockchain Visualization
A live interactive blockchain visualizer displays newly mined blocks and verified blocks in real time.

### ✔ End-to-End Trustless System
No university, student, or employer can alter data. Trust is replaced by cryptography + blockchain consensus.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Sepolia testnet ETH (for transactions)

### Installation

1. **Clone the repository**
 git clone https://github.com/yourusername/credentia.git
 cd credentia
2. **Install dependencies**
 npm install
3. **Configure environment variables**
 Create a .env file in the root directory:
  VITE_CONTRACT_ADDRESS=your_deployed_contract_address
  VITE_NETWORK_ID=11155111
4. **Run the development server**
 npm run dev
5. **Open the application**
Go to: http://localhost:5173

---

## 📝 Smart Contract Deployment

1. Open the file `contracts/CredentialVerifier.sol` in this repository.  
2. Copy the code.  
3. Go to **Remix IDE**.  
4. Create a new file, paste the code, and compile it.  
5. Deploy it to the **Sepolia Testnet** or **Remix VM**.

---

## 🔐 Security Features

- **Immutable Records**: Once issued, credentials cannot be altered or deleted
- **Cryptographic Hashing**: Ensures data integrity and uniqueness
- **Decentralized Storage**: No single point of failure
- **Event Logging**: All actions are transparently recorded on-chain
- **Access Control**: Only authorized issuers can create credentials

---

## 🏁 Project Highlights

Credentia is a fully functional blockchain credential verification system that demonstrates mastery over:

- **Smart contract development**
- **Decentralized architecture**
- **Web3 integration**
- **Modern frontend engineering**

**It provides:**

- A secure academic certificate issuance process
- Instantaneous, tamper-proof verification
- A sleek and professional UI
- A robust architecture built on industry-standard blockchain tools

---

## 📸 Screenshots

### Recommended Screenshots to Include

- 🏠 **Home Page / Dashboard**
    <img width="1487" height="710" alt="image" src="https://github.com/user-attachments/assets/d75bfd10-81aa-4116-bf45-3e44b325a79b" />

- 🎓 **Issue Credential Form**
   <img width="1140" height="552" alt="image" src="https://github.com/user-attachments/assets/a8c31af1-666b-438a-9896-e22b62130aa2" />

- 🔍 **Verify Credential Page**
   <img width="1140" height="557" alt="image" src="https://github.com/user-attachments/assets/ec8bf6ac-5424-475c-8f2a-a3e60796b617" />

- ⛓️ **Blockchain Visualization Interface**
   <img width="1075" height="486" alt="image" src="https://github.com/user-attachments/assets/538f96a3-0791-462e-b860-8c277e109dc6" />
