# Worldcoin Content Platform

A decentralized content submission and rating platform built on Worldcoin, where users can submit IPFS content and rate submissions with verified identity.

## 🤝 Features

- **IPFS Content Submission**: Submit content with IPFS hashes
- **Worldcoin Identity Verification**: Identity verification for rating submissions
- **Decentralized Storage**: Content stored on IPFS with blockchain pointers
- **Sybil-resistant Rating System**: 1-5 star ratings with verified identity

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: World Chain, Solidity smart contracts
- **Identity**: Worldcoin MiniKit SDK, Proof-of-Human verification
- **Storage**: IPFS (InterPlanetary File System)
- **App**: World App integration

## 📱 Mini App Features

### Content Submission (`/submit`)
- Real-time IPFS CIDv0 validation
- Copy-to-clipboard functionality
- World App transaction

### Content Rating (`/rate`)
- Fetch and display all submissions
- Star rating system
- Worldcoin Orb verification required

## 🤖 Smart Contracts

- **SubmissionContract**: Stores IPFS content pointers
- **RatingContract**: Manages ratings with verified identity
- **Deployed on World Chain**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- World App installed on your device

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## 🔗 Smart Contract Addresses on World Chain

- **Submission Storage**: `0x9724fbeb6C78F74B9237AdA99EAFf819Da1936Fa`
- **Rating Contract**: `0xDa29F517a7EbeF9478987b8025653B54E29D3Fc6`

## 📋 IPFS Requirements

- **CIDv0 Format**: Must start with "Qm"
- **Length**: Exactly 46 characters
- **Encoding**: Base58 (no 0, O, I, l characters)

## 📋 Usage

1. **Submit Content**: Upload content to IPFS and submit the hash
2. **Rate Content**: Browse submissions and rate with verified identity
3. **Verify Identity**: Complete verification for rating submissions
