
# CRM-IO – Customer Relationship Management Platform

crm-io is a full-stack customer relationship management platform built with **Next.js**, **MongoDB**, and **NextAuth.js**. It enables businesses to ingest customer and order data, define custom campaign segments, and simulate message delivery through a mock vendor API.

## 🚀 Features

### ✅ Authentication

-   Google OAuth 2.0-based authentication using **NextAuth.js**
-   Secure access to user-specific dashboards, campaigns, and data

### 📁 Data Management

-   **Customer & Order Data Ingestion APIs**
    -   Accepts arrays of JSON objects for bulk upload
    -   Simplifies large-scale data management
-   Real-time database updates

### 📢 Campaign Management

-   **Campaign Creation UI** with rule-based audience segmentation
    -   Dynamic rule builder supporting `AND`/`OR` logic
    -   Example rules: `spend > INR 10,000 AND visits < 3 OR inactive for 90 days`
    -   Live audience size preview before saving
-   Campaign history view:
    -   List of all past campaigns
    -   Delivery stats: sent, failed, audience size
    -   Most recent campaign appears first

### 📨 Campaign Delivery & Logging

-   Initiates campaign delivery upon segment save
-   **Mock Vendor API** simulates message delivery (~90% success, ~10% failure)
-   Delivery results logged via backend **Delivery Receipt API**
-   Delivery status stored in `communication_log` collection
-   Work-in-progress: Redis Streams-based **pub-sub architecture** for batch updates

### 🤖 Gemini API Integration (Beta)

-   Experimental **Gemini API** integration to assist users in generating rule segments via natural language
-   Currently under refinement for optimal accuracy

## 🛠️ Tech Stack

-   **Frontend**: Next.js, Tailwind CSS
-   **Backend**: Node.js, MongoDB
-   **Authentication**: NextAuth.js (Google OAuth 2.0)
## 📽️ Demo

> 📌 https://youtu.be/u727zwykq70

## ⚠️ Known Issues & In-Progress Features

-   **NextAuth Issues**: In the live hosted version, NextAuth sometimes throws errors (under active investigation). Works as expected in the local environment, as shown in the demo.
-   **Gemini API**: Rule generation is functional but not yet fully optimized.
-   **Redis Streams**: Integration for pub-sub delivery tracking was attempted, but unresolved TypeScript typing issues prevented completion within the submission deadline. WIP code is included for review.

## 📦 Getting Started

### Prerequisites

-   Node.js 18+
-   MongoDB instance
-   Google OAuth credentials

### Installation

1.  **Clone the repository**
    
    ```bash
    git clone https://github.com/v1pinx/crm.io.git
    cd crm.io
    ```
    
2.  **Install dependencies**
    
    ```bash
    pnpm install
    ```
    
3.  **Environment Setup** Create a `.env.local` file in the root directory:
    
    ```env
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret
    MONGODB_URI=your_mongodb_uri
    GEMINI_API_KEY=your_gemini_api_key
    
    ```
    
4.  **Run the application**
    
    ```bash
    pnpm run dev
    ```
    
5.  **Access the application** Open [http://localhost:3000](http://localhost:3000/) in your browser.
    

## 📚 API Documentation

### Data Ingestion Endpoints

-   `POST /api/customers/bulk` - Bulk upload customer data
-   `POST /api/orders/bulk` - Bulk upload order data

### Campaign Management

-   `POST /api/campaigns` - Create new campaign
-   `GET /api/campaigns` - Retrieve campaign history
-   `POST /api/vendor-delivery/` - Trigger campaign delivery

### Delivery Tracking

-   `POST /api/delivery-receipt` - Log delivery status updates


## 👨‍💻 Author

**[Your Name]**  
Student Developer | Passionate about building scalable web systems  
📧 Email: [your.email@example.com](mailto:your.email@example.com)  
🐙 GitHub: [@yourusername](https://github.com/yourusername)

----------

_Built with ❤️ using Next.js and modern web technologies_
