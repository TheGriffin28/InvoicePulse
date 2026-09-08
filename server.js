// ==============================================================================
// InvoicePulse — Production Express REST API Server
// ==============================================================================
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

class DomainStore {
  constructor() {
    this.items = new Map();
    this.nextId = 1;
    this.seed();
  }

  seed() {
    this.create({ name: 'Primary Item Alpha', category: 'Core', status: 'Active', description: 'Initial baseline record' });
    this.create({ name: 'Secondary Item Beta', category: 'Operations', status: 'Pending', description: 'Pending approval step' });
  }

  validate(data, isUpdate = false) {
    if (!isUpdate || data.name !== undefined) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) throw new Error('Name is required');
    }
  }

  create(data) {
    this.validate(data, false);
    const id = this.nextId++;
    const record = {
      id,
      name: data.name.trim(),
      category: data.category || 'General',
      status: data.status || 'Active',
      description: data.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.set(id, record);
    return record;
  }

  list(query = {}) {
    let list = Array.from(this.items.values());
    if (query.status && query.status !== 'All') list = list.filter(i => i.status.toLowerCase() === query.status.toLowerCase());
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q));
    }
    return { items: list, total: list.length };
  }

  get(id) { return this.items.get(Number(id)) || null; }

  update(id, data) {
    const existing = this.get(id);
    if (!existing) return null;
    this.validate(data, true);
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    this.items.set(Number(id), updated);
    return updated;
  }

  remove(id) { return this.items.delete(Number(id)); }

  stats() {
    const all = Array.from(this.items.values());
    return {
      total: all.length,
      active: all.filter(i => i.status === 'Active').length,
    };
  }
}

const store = new DomainStore();

app.get('/health', (req, res) => res.json({ status: 'healthy', app: 'InvoicePulse' }));
app.get('/api/stats', (req, res) => res.json(store.stats()));
app.get('/api/invoicepulse_items', (req, res) => res.json(store.list(req.query)));
app.get('/api/invoicepulse_items/:id', (req, res) => {
  const item = store.get(req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/invoicepulse_items', (req, res) => {
  try { res.status(201).json(store.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.patch('/api/invoicepulse_items/:id', (req, res) => {
  try {
    const item = store.update(req.params.id, req.body);
    item ? res.json(item) : res.status(404).json({ error: 'Not found' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/invoicepulse_items/:id', (req, res) => {
  store.remove(req.params.id) ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`🚀 ${'InvoicePulse'} on port ${PORT}`));
}

module.exports = { app, store, DomainStore };
