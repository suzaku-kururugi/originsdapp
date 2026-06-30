# OriginsDapp

The source code of [originsdapp.com](https://originsdapp.com)

Ethereum Mainnet contract address: [0x51e6f9159F46adC8A75861E9498aaaa0304DD977](https://etherscan.io/address/0x51e6f9159F46adC8A75861E9498aaaa0304DD977)

## Important Notice: How This Application Works

This application is a client-side, non-custodial software tool that allows users to store encrypted data references on a public blockchain. 

- We do not operate any backend servers
- We do not collect, store, or process user data
- All data encryption happens locally in your browser
- We do not have access to your data or encryption keys

## Data Encryption & Privacy

- All user data is encrypted on the client side before being written to the blockchain.
- Encryption keys and passwords are generated and managed only by you
- Keys are never transmitted, stored, or recoverable by us
- If you lose your password or key, the data cannot be recovered
- Encrypted blockchain data cannot be meaningfully read without the correct password
- Because encryption is performed locally and keys are user-controlled, we cannot access, view, modify, or delete user data

## Blockchain Immutability

This application uses a public, immutable blockchain.
By using this software, you acknowledge and understand that:

- Blockchain transactions are permanent and irreversible
- Data written to the blockchain cannot be deleted or altered
- “Deletion” is only possible by destroying encryption keys, making the data permanently inaccessible

Please review all information carefully before submitting any transaction.

## User Responsibility & Consent

Users are solely responsible for:

- The content they choose to encrypt and store
- Ensuring they have the legal right and consent to include information about other individuals
- Especially when uploading information related to living persons

We strongly discourage storing identifiable personal information about living individuals without their explicit consent.

## No Legal, Financial, or Identity Guarantees

This application:
- Does not provide legal, financial, or identity verification services
- Does not create official, legal, or authoritative family records
- Is provided for informational and personal use only
- No guarantees are made regarding accuracy, availability, or long-term accessibility

## Fees

Certain blockchain interactions may require a fee.
- Fees are required to cover network usage and software operation
- Fees are deterministic and visible before transaction submission

We do not custody user funds and do not provide financial services.

## By Using This Application

By interacting with this application, you confirm that you:
- Understand how blockchain technology works
- Accept the irreversible nature of transactions
- Accept full responsibility for key management and uploaded content

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To build and run this project locally please install [Docker](https://www.docker.com/) first.

Execute the following to build:  

`docker build --target export --output ./dist .`  

Static files in ./dist folder can be served by any web server of your choice. The repository provides a dockerfile with nginx.

`docker build -f infra/Dockerfile -t origins_static .`  
`docker run -p 8080:80 origins_static`  

Open [http://localhost:8080/](http://localhost:8080/) with your browser to see the result.

## License

The source code of this project is publicly available, but it is not open source under the OSI definition.

You are welcome to read, study, run, redistribute and modify the code, as long as your use is not competitive with this project or fradulent.

## Contact

For any inquiries reach out to originsdapp@protonmail.com
