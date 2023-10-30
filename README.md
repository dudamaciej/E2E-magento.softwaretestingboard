# E2E-magento.softwaretestingboard
This repo contains e2e test written in Cypress for https://magento.softwaretestingboard.com/

## Installation & Setup

It is assumed you have nothing installed except for node + git.

### 1. Install Cypress
[Follow these instructions to install Cypress.](https://on.cypress.io/installing-cypress)

### 2. Clone this repo
  ```bash
    ## clone this repo to a local directory
    git clone https://github.com/dudamaciej/E2E-magento.softwaretestingboard.git

    ## install the node_modules
    npm i

    ## start the cypress
    npx cypress open
  ```
  The `npx cypress open` script will open Cypress window.

### 3. Setup
#### 3.1 Create account on https://magento.softwaretestingboard.com/
#### 3.2.A Create cypress.env.json and there your test credentials
 ```bash
    {
    "username": "your_email",
    "password": "your_password"
    }
  ```
#### 3.2.B Or add in cypress.config.js
 ```bash
    env: {
        "username": "your_email",
        "password": "your_password"
    }
  ```