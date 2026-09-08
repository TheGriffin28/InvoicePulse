# InvoicePulse API Documentation

Welcome to the InvoicePulse API reference. All requests and responses use the `application/json` format.

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints Summary

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check and database connection status |
| `GET` | `/api/invoicepulse` | Retrieve filtered invoice collection |
| `POST` | `/api/invoicepulse` | Create new invoice with line items and automatic tax calculation |
| `GET` | `/api/invoicepulse/:id` | Fetch specific invoice by unique identifier |
| `PATCH` | `/api/invoicepulse/:id` | Update invoice details, items, or status |
| `DELETE` | `/api/invoicepulse/:id` | Delete invoice record and associated items |

---

## Endpoint Details

### 1. Health Check
**`GET /api/health`**

Returns server status and database connectivity info.

#### Response (`200 OK`)
```json
{
  "status": "ok",
  "timestamp": "2023-10-24T12:00:00.000Z",
  "database": "connected"
}
```

#### cURL Example
```bash
curl -X GET http://localhost:5000/api/health
```

---

### 2. List Invoices
**`GET /api/invoicepulse`**

Retrieves invoices with optional filtering by status or client ID.

#### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | `string` | Filter by status (`Draft`, `Sent`, `Paid`, `Overdue`) |
| `clientId` | `string` | Filter by specific client ID |
| `limit` | `number` | Result set limit (Default: `20`) |
| `offset` | `number` | Result set offset (Default: `0`) |

#### Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "inv_101",
      "invoiceNumber": "INV-2023-001",
      "client": {
        "id": "cli_501",
        "name": "Acme Corp",
        "email": "billing@acme.com"
      },
      "status": "Sent",
      "subtotal": 1500.00,
      "taxRate": 10.0,
      "taxAmount": 150.00,
      "total": 1650.00,
      "dueDate": "2023-11-15",
      "createdAt": "2023-10-15T08:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

#### cURL Example
```bash
curl -X GET "http://localhost:5000/api/invoicepulse?status=Sent&limit=10"
```

---

### 3. Create Invoice
**`POST /api/invoicepulse`**

Creates a new invoice record, computes subtotals, tax amount, and total billable amount.

#### Request Body Schema
```json
{
  "client": {
    "name": "Acme Corp",
    "email": "billing@acme.com",
    "address": "123 Tech Way, Suite 100"
  },
  "dueDate": "2023-11-30",
  "taxRate": 10.0,
  "status": "Draft",
  "items": [
    {
      "description": "Full-Stack Web Development",
      "quantity": 40,
      "unitPrice": 100.00
    },
    {
      "description": "UI/UX Design System",
      "quantity": 10,
      "unitPrice": 125.00
    }
  ],
  "notes": "Payment due within 30 days."
}
```

#### Response (`201 Created`)
```json
{
  "id": "inv_102",
  "invoiceNumber": "INV-2023-002",
  "client": {
    "id": "cli_501",
    "name": "Acme Corp",
    "email": "billing@acme.com"
  },
  "status": "Draft",
  "dueDate": "2023-11-30",
  "items": [
    {
      "id": "item_01",
      "description": "Full-Stack Web Development",
      "quantity": 40,
      "unitPrice": 100.00,
      "total": 4000.00
    },
    {
      "id": "item_02",
      "description": "UI/UX Design System",
      "quantity": 10,
      "unitPrice": 125.00,
      "total": 1250.00
    }
  ],
  "subtotal": 5250.00,
  "taxRate": 10.0,
  "taxAmount": 525.00,
  "total": 5775.00,
  "notes": "Payment due within 30 days.",
  "createdAt": "2023-10-24T12:05:00.000Z"
}
```

#### cURL Example
```bash
curl -X POST http://localhost:5000/api/invoicepulse \
  -H "Content-Type: application/json" \
  -d '{
    "client": { "name": "Acme Corp", "email": "billing@acme.com" },
    "dueDate": "2023-11-30",
    "taxRate": 10.0,
    "status": "Draft",
    "items": [{ "description": "Full-Stack Web Development", "quantity": 40, "unitPrice": 100.00 }]
  }'
```

---

### 4. Get Invoice by ID
**`GET /api/invoicepulse/:id`**

Retrieves full record for a single invoice by its ID.

#### Path Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique invoice identifier |

#### Response (`200 OK`)
```json
{
  "id": "inv_102",
  "invoiceNumber": "INV-2023-002",
  "client": {
    "id": "cli_501",
    "name": "Acme Corp",
    "email": "billing@acme.com"
  },
  "status": "Draft",
  "subtotal": 5250.00,
  "taxRate": 10.0,
  "taxAmount": 525.00,
  "total": 5775.00,
  "dueDate": "2023-11-30",
  "items": [
    {
      "id": "item_01",
      "description": "Full-Stack Web Development",
      "quantity": 40,
      "unitPrice": 100.00,
      "total": 4000.00
    }
  ],
  "createdAt": "2023-10-24T12:05:00.000Z"
}
```

#### cURL Example
```bash
curl -X GET http://localhost:5000/api/invoicepulse/inv_102
```

---

### 5. Update Invoice
**`PATCH /api/invoicepulse/:id`**

Updates payment status or attributes of an invoice.

#### Request Body Schema
```json
{
  "status": "Paid"
}
```

#### Response (`200 OK`)
```json
{
  "id": "inv_102",
  "invoiceNumber": "INV-2023-002",
  "status": "Paid",
  "updatedAt": "2023-10-25T09:15:00.000Z"
}
```

#### cURL Example
```bash
curl -X PATCH http://localhost:5000/api/invoicepulse/inv_102 \
  -H "Content-Type: application/json" \
  -d '{ "status": "Paid" }'
```

---

### 6. Delete Invoice
**`DELETE /api/invoicepulse/:id`**

Deletes an invoice and its line items.

#### Path Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique invoice identifier to remove |

#### Response (`200 OK`)
```json
{
  "message": "Invoice inv_102 deleted successfully",
  "id": "inv_102"
}
```

#### cURL Example
```bash
curl -X DELETE http://localhost:5000/api/invoicepulse/inv_102
```
