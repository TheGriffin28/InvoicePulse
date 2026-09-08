-- PostgreSQL Schema for InvoicePulse
CREATE TABLE IF NOT EXISTS invoicepulse_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'General',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoicepulse_items_status ON invoicepulse_items(status);
CREATE INDEX IF NOT EXISTS idx_invoicepulse_items_created_at ON invoicepulse_items(created_at DESC);
