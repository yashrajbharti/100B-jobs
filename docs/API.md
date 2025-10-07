# API Documentation

This document describes the RESTful API endpoints provided by the 100B Jobs backend server.

## Base URL

```
http://localhost:3001
```

## Table of Contents

- [Endpoints](#endpoints)
  - [Get All Candidates](#get-all-candidates)
  - [Get Candidate by ID](#get-candidate-by-id)
  - [Upload Candidates](#upload-candidates)
  - [Update Top 5](#update-top-5)
  - [Delete All Candidates](#delete-all-candidates)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Query Parameters](#query-parameters)

## Endpoints

### Get All Candidates

Retrieves a paginated list of candidates with optional search and filtering.

**Endpoint:** `GET /candidates`

**Query Parameters:**

- `search` (string, optional): Search term to filter by name, email, or skills
- `filter` (string, optional): Set to "Top Candidates" to filter and sort by score
- `limit` (number, optional, default: 50): Number of results per page
- `offset` (number, optional, default: 0): Number of results to skip

**Response:**

```json
{
  "length": 100,
  "data": [
    {
      "index": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "skills": ["JavaScript", "React", "Node.js"],
      "top": "#1",
      "score": 9.5
    }
  ]
}
```

**Examples:**

```bash
# Get first 50 candidates
GET /candidates

# Search for candidates with "python" skill
GET /candidates?search=python

# Get top candidates sorted by score
GET /candidates?filter=Top%20Candidates

# Pagination: Get candidates 51-100
GET /candidates?limit=50&offset=50

# Combined: Search with pagination
GET /candidates?search=developer&limit=20&offset=0
```

### Get Candidate by ID

Retrieves full details for a specific candidate.

**Endpoint:** `GET /candidates/:id`

**Parameters:**

- `id` (number): The candidate's index

**Response:**

```json
{
  "index": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "skills": ["JavaScript", "React", "Node.js"],
  "score": 9.5,
  "top": "#1",
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "description": "Led development team",
      "start": "2020-01-01",
      "end": "2024-01-01"
    }
  ],
  "education": [
    {
      "institution": "University of Technology",
      "degree": "BS Computer Science",
      "field": "Computer Science",
      "start": "2015",
      "end": "2019"
    }
  ],
  "projects": [],
  "certifications": []
}
```

**Error Response (404):**

```json
{
  "message": "Candidate not found"
}
```

**Examples:**

```bash
# Get candidate with index 1
GET /candidates/1

# Get candidate with index 42
GET /candidates/42
```

### Upload Candidates

Uploads a batch of candidates with deduplication by index.

**Endpoint:** `POST /upload`

**Request Body:**

```json
[
  {
    "index": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["JavaScript", "React"],
    "score": 9.5,
    "top": "#1",
    "experience": [],
    "education": [],
    "projects": [],
    "certifications": []
  }
]
```

**Response:**

```json
{
  "message": "Batch uploaded with deduplication.",
  "new": 50,
  "total": 150
}
```

**Behavior:**

- Accepts an array of candidate objects
- Deduplicates by `index` field
- If a candidate with the same index exists, it will be replaced
- Existing candidates with different indexes are preserved
- Returns count of new candidates and total count

**Examples:**

```bash
curl -X POST http://localhost:3001/upload \
  -H "Content-Type: application/json" \
  -d '[{"index":1,"name":"John","email":"john@example.com","skills":["JS"],"score":8.5}]'
```

### Update Top 5

Updates the top 5 rankings for candidates.

**Endpoint:** `PATCH /upload/top5`

**Request Body:**

```json
[
  { "index": 1, "top": "#1" },
  { "index": 2, "top": "#2" },
  { "index": 3, "top": "#3" },
  { "index": 4, "top": "#4" },
  { "index": 5, "top": "#5" }
]
```

**Response:**

```json
{
  "message": "Top 5 updated successfully."
}
```

**Behavior:**

- Updates the `top` field for specified candidates
- Only updates candidates that exist in the database
- Other candidate data remains unchanged

**Error Response (404):**

```json
{
  "message": "No existing candidate data."
}
```

### Delete All Candidates

Deletes all candidate data from the system.

**Endpoint:** `DELETE /candidates`

**Response:**

```json
{
  "message": "Candidate data cleared."
}
```

**Error Response (404):**

```json
{
  "message": "No candidate data to delete."
}
```

**Error Response (500):**

```json
{
  "message": "Failed to delete candidate file."
}
```

**Warning:** This operation is irreversible. All candidate data will be permanently deleted.

## Data Models

### Candidate

```typescript
interface Candidate {
  index: number;                    // Unique identifier
  name: string;                     // Full name
  email: string;                    // Email address
  skills: string[];                 // Array of skills
  score?: number;                   // Overall score (0-10)
  top?: string;                     // Top ranking (e.g., "#1")
  experience?: Experience[];        // Work experience
  education?: Education[];          // Educational background
  projects?: Project[];             // Projects
  certifications?: Certification[]; // Certifications
}
```

### Experience

```typescript
interface Experience {
  company: string;      // Company name
  position: string;     // Job title
  description?: string; // Job description
  start: string;        // Start date (ISO format)
  end: string;          // End date (ISO format or "Present")
}
```

### Education

```typescript
interface Education {
  institution: string; // School/University name
  degree: string;      // Degree type (e.g., "BS", "MS")
  field: string;       // Field of study
  start: string;       // Start year
  end: string;         // End year
  gpa?: number;        // GPA (optional)
}
```

### Project

```typescript
interface Project {
  name: string;         // Project name
  description: string;  // Project description
  technologies?: string[]; // Technologies used
  url?: string;         // Project URL
}
```

### Certification

```typescript
interface Certification {
  name: string;         // Certification name
  issuer: string;       // Issuing organization
  date: string;         // Date obtained
  url?: string;         // Verification URL
}
```

## Error Handling

### HTTP Status Codes

- `200 OK`: Request succeeded
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "message": "Error description"
}
```

## Query Parameters

### Pagination

All list endpoints support pagination using `limit` and `offset`:

```bash
# First page (results 1-50)
GET /candidates?limit=50&offset=0

# Second page (results 51-100)
GET /candidates?limit=50&offset=50

# Third page (results 101-150)
GET /candidates?limit=50&offset=100
```

### Search

The search parameter performs case-insensitive matching across:

- Candidate name
- Email address
- Skills array

```bash
# Search for "JavaScript" in all fields
GET /candidates?search=javascript

# Search for specific email domain
GET /candidates?search=@example.com

# Search for name
GET /candidates?search=john
```

### Filtering

Current supported filter:

- `Top Candidates`: Filters candidates with scores and sorts by score (descending)

```bash
GET /candidates?filter=Top%20Candidates
```

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting middleware.

## CORS

CORS is enabled for all origins in development. For production, configure specific allowed origins.

## Data Persistence

Data is stored in a local JSON file (`candidates.json`) in the backend directory. For production use, consider migrating to a proper database (PostgreSQL, MongoDB, etc.).

## Examples

### Complete Workflow

```bash
# 1. Upload candidates
curl -X POST http://localhost:3001/upload \
  -H "Content-Type: application/json" \
  -d @candidates.json

# 2. Search for Python developers
curl "http://localhost:3001/candidates?search=python"

# 3. Get top candidates
curl "http://localhost:3001/candidates?filter=Top%20Candidates"

# 4. Get specific candidate details
curl "http://localhost:3001/candidates/1"

# 5. Update top 5 rankings
curl -X PATCH http://localhost:3001/upload/top5 \
  -H "Content-Type: application/json" \
  -d '[{"index":1,"top":"#1"}]'

# 6. Clear all data
curl -X DELETE http://localhost:3001/candidates
```

## Future API Enhancements

Planned features:

- Authentication and authorization
- More advanced filtering options
- Sorting by multiple fields
- Bulk operations
- Export functionality
- Candidate comparison endpoint
- Analytics endpoints
