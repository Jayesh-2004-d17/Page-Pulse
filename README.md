# 🚀 Page Pulse

A simple web audit tool that analyzes any public webpage and provides useful SEO and webpage insights.

---

## 📌 Features

- ✅ Analyze any website URL
- ✅ HTTP Status Check
- ✅ Response Time Measurement
- ✅ Page Title Extraction
- ✅ Meta Description Extraction
- ✅ H1 Tag Count
- ✅ Missing ALT Images Count
- ✅ Word Count
- ✅ Invalid URL Validation
- ✅ Non-HTML Detection
- ✅ Timeout Handling
- ✅ Responsive User Interface

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Axios
- Cheerio

---

## 📂 Folder Structure

```
page-pulse
│
├── frontend
│
├── backend
│
└── README.md
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/page-pulse.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoint

### POST

```
/api/audit
```

### Request

```json
{
  "url": "https://example.com"
}
```

### Success Response

```json
{
  "success": true,
  "status": 200,
  "responseTime": "215 ms",
  "title": "Example Domain",
  "metaDescription": "No Description",
  "h1Count": 1,
  "missingAltImages": 0,
  "wordCount": 17
}
```

---

## 📋 Test Cases

### ✅ Test 1

Input

```
https://example.com
```

Expected

- Status 200
- Title Found
- H1 Count
- Word Count

---

### ✅ Test 2

Input

```
abc
```

Expected

```
Invalid URL format.
```

---

### ✅ Test 3

Input

```
https://abcd123xyz987.com
```

Expected

```
Website not found.
```

---

## 🎯 Design Decisions

- Used **Axios** for reliable HTTP requests.
- Used **Cheerio** to parse HTML and extract SEO information.
- Separated frontend and backend for better scalability and maintainability.

---

## 🤖 AI Usage

AI tools (ChatGPT) were used to brainstorm the UI, improve error handling, and review the implementation. The project was implemented, tested, debugged, and customized based on my own understanding and decisions.

---

## 🚀 Future Improvements

- Lighthouse Score Integration
- Broken Link Detection
- SEO Score
- Open Graph Tag Analysis
- Export Report as PDF

---

## 👨‍💻 Author

Jayesh Dharmik

Built for **Digital Heroes Training Task**
