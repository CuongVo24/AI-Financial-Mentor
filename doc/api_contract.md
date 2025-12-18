# [API_CONTRACT]

## Base URL
`http://localhost:3000/api/v1`

## Endpoints

### 1. Health Check
- **GET** `/transactions/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "Momo AI Backend"
  }
  ```

### 2. Analyze Transaction (AI)
- **POST** `/transactions/analyze`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "rawText": "Giao dich thanh cong -50.000d mua Cafe tai HighLands"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "amount": 50000,
      "type": "EXPENSE",
      "category": "Food & Drink",
      "note": "Cafe tai HighLands",
      "party": "HighLands",
      "confidence": 0.95
    }
  }
  ```
- **Response (Error)**:
  ```json
  {
    "success": false,
    "error": "Error message description"
  }
  ```
