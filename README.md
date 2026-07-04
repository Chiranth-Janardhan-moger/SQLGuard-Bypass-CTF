# SQLGuard Bypass CTF 🚩

> A vulnerable Node.js web application designed to test your SQL Injection (SQLi) skills against a custom WAF (`sqlguardjs`).

[![Node.js CI](https://github.com/Chiranth-Janardhan-moger/SQLGuard-Bypass-CTF/actions/workflows/node.js.yml/badge.svg)](https://github.com/Chiranth-Janardhan-moger/SQLGuard-Bypass-CTF/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Welcome to the **SQLGuard Bypass Capture The Flag (CTF)** challenge! This project is a deliberately vulnerable web application built with Express.js and SQLite, protected by a Web Application Firewall (WAF) called `sqlguardjs`. Your objective is to bypass the WAF and extract the hidden flag from the database.

---

## 🎯 The Challenge

The application has two main endpoints that are vulnerable to SQL Injection:
1. **Login Endpoint**: Authentication bypass.
2. **Search Endpoint**: Data exfiltration.

Both endpoints are actively monitored and filtered by `sqlguardjs`. Your goal is to find a payload that successfully exploits the SQL vulnerability without triggering the WAF's block threshold.

### 🏆 Objective
Extract the secret flag located in the `flags` table. 

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SQLGuard-Bypass-CTF.git
   cd SQLGuard-Bypass-CTF
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   *Note: The server runs on port `4040` by default.*

4. Access the application in your browser:
   [http://localhost:4040](http://localhost:4040)

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (In-Memory)
- **Security / WAF**: `sqlguardjs`
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

---

## ⚠️ Disclaimer

**WARNING:** This application is intentionally vulnerable and contains severe security flaws. Do **NOT** deploy this code in a production environment or on a public-facing server. It is strictly for educational purposes and local security testing.

---

## 🏷️ Tags
`ctf` `cybersecurity` `sql-injection` `nodejs` `security-challenge` `expressjs` `vulnerable-app` `sqlguardjs` `waf-bypass` `penetration-testing`

---

*Happy Hacking! Let's see if you can bypass the guard.* 🛡️🔓
