# Sui Blockchain Certificate Issuing Application

In order for this application to run correctly, the sui move package needs to be built and published to the Sui Blockchain. Follow the instructions below in order to do this.

## Sui Blockchain Wallets and Objects

Like almost every other blockchain, sui functions with wallets representing users and user possession of items. Unlike traditional blockchains that store transactions and coins in large ledgers, sui stores coins and items in the form of objects. Every object has a creator, abilities and can store metadata. Once created, objects may be owned by wallets. 

This application takes advantage of the Sui Move structure that enables immutable, non-transferable, and truly unique objects to be created and owned by wallets. These attributes allow the properties of traditional academic certificates to be replicated in the creation and ownership of unique certificates by students on a decentralized blockchain network.

<!-- ## System Structure

The purpose of this application is to enable data sovereignty for the students. Unlike traditional centralized systems that store the certificates in one large database the certificates created by this application will be stored on the sui blockchain and perminantly belonging to the students who achieved them in the form of ***Soulbound NFTs***. -->

## Capabilities Within the Application

When the Sui move package is built and published the user who conducted the command is granted *admin capabilities*. (In a truly decentralized system, another form of governance must be used to prevent a single point of failure.) The hierarchy of the application is as follows; the admin can create institutions, and institutions can create and issue certificates. In order for the admin wallet to give institution capabilities to a wallet, the recipient institution wallet must already be created and exist on the Sui Blockchain. Once institution capabilities have been granted, the institution may use the sui package to create certificates and transfer them to the student wallets.

## Sui Move Modules Functionality 

Once the Sui move smart contracts are built and published onto a Sui blockchain (*Devnet*, *Testnet*, *Mainnet*), the package has two responsibilities; creating institution capabilities and assigning them to a university owned wallet, and creating certificate objects and assigning them to student owned wallets. The modules inside the package are called ***admin_manager*** and ***create_certificate***.

### admin_manager

Inside the admin manager module there is only one function that can be called. Upon calling the function, the user must pass their admin capability object.

One is the silly move smart contract package that is published onto the sui blockchain and is responsible for assigning institution capabilities to users.
Sui Move smart contract package and a typescript react program to act as the front end of the system.

---

## Prerequisites

Make sure you have the following installed on your machine:
* [Sui CLI](https://docs.sui.io/build/install) (or your relevant tool stack)
* Git

---

## Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name