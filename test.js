const assert = require('assert');
const { DomainStore } = require('./server.js');

console.log('⚡ Running InvoicePulse Test Suite...');
const store = new DomainStore();
store.items.clear();
store.nextId = 1;

assert.throws(() => store.create({ name: '' }), /Name is required/);
const item = store.create({ name: 'Alpha', status: 'Active' });
assert.strictEqual(item.id, 1);
assert.strictEqual(item.name, 'Alpha');

const updated = store.update(1, { status: 'Archived' });
assert.strictEqual(updated.status, 'Archived');
assert.strictEqual(store.remove(1), true);

console.log('✓ All InvoicePulse automated test assertions passed cleanly with exit code 0.');
