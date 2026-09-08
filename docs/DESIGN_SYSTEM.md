# InvoicePulse Design System & UI Specification

## 1. Aesthetic Vision & Brand Voice
InvoicePulse is a modern, high-contrast, professional FinTech billing hub. The interface radiates confidence and precision through deep obsidian glass surfaces, vibrant electric indigo (`#6366F1`) brand highlights, and crisp emerald (`#10B981`) cash-flow accents. All numbers represent real liquidity, demanding monospace clarity (`tabular-nums`) and instantaneous status feedback.

---

## 2. Color Tokens & Semantic Roles

| Token | Hex / RGBA | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#090D16` | `bg-[#090D16]` | Full-page dark base |
| **Surface (Card)** | `rgba(15, 23, 42, 0.75)` | `bg-slate-900/75 backdrop-blur-md` | Cards, tables, modals |
| **Surface Highlight** | `#1E293B` | `bg-slate-800` | Input controls, hover states |
| **Border Subdued** | `rgba(255, 255, 255, 0.08)` | `border-white/10` | Default card and row dividers |
| **Primary** | `#6366F1` | `text-indigo-500 bg-indigo-600` | Primary CTAs, active selections |
| **Accent / Paid** | `#10B981` | `text-emerald-400 bg-emerald-500/10` | Positive revenue, Paid status |
| **Warning / Sent** | `#F59E0B` | `text-amber-400 bg-amber-500/10` | Sent status, awaiting action |
| **Danger / Overdue** | `#EF4444` | `text-rose-400 bg-rose-500/10` | Overdue status, destructive ops |
| **Draft** | `#64748B` | `text-slate-400 bg-slate-500/10` | Draft invoices, neutral elements |

---

## 3. Typography & Numerical Representation

* **Headings & Labels**: `font-sans` (Inter or System UI) with `tracking-tight font-semibold`.
* **Financial Numbers & Totals**: `font-mono tabular-nums` to ensure decimal points and currency symbols align across all rows and summary cards.
* **Status Badges**: `text-xs uppercase tracking-wider font-bold` with an animated pulse dot for pending/live statuses.

---

## 4. Key Component Specifications

### 4.1 Financial Summary Dashboard Cards
A 4-column metric grid displaying cash flow velocity:
1. **Total Invoiced**: Slate text, total lifetime or period amount.
2. **Collected Revenue**: Emerald accent highlight (`#10B981`) with upward delta badge.
3. **Pending Receivables (Sent)**: Amber highlight (`#F59E0B`) with count of pending invoices.
4. **Overdue Exposure**: Rose highlight (`#EF4444`) with immediate attention alert icon.

*Container Classes*:
```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Collected</span>
      <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
    </div>
    <div class="mt-3 text-2xl font-bold font-mono tracking-tight text-white">$48,250.00</div>
    <div class="mt-1 text-xs text-emerald-400 font-medium">+12.4% vs last month</div>
  </div>
</div>
```

### 4.2 Invoice Line-Items Repeater (`invoicepulse_items`)
Dynamic item row collection within the invoice creation/edit modal:
* **Fields**:
  * Description (`col-span-6`): Text input with auto-suggest.
  * Quantity (`col-span-2`): Integer / decimal input with step controls.
  * Unit Price (`col-span-2`): Monospace numeric input with currency prefix `$`. 
  * Tax Rate % (`col-span-1`): Optional rate selector (e.g., 0%, 5%, 10%, 20%).
  * Line Total (`col-span-1`): Read-only calculated field (`Quantity * Unit Price`).
  * Remove Action: Trash icon button with hover red glow.

*Calculation Footer*:
* Subtotal, Cumulative Tax Amount, Discount, and Final Grand Total computed in real-time.

### 4.3 Status Pill Badges
* **Draft**: `bg-slate-500/10 text-slate-400 border border-slate-500/20`
* **Sent**: `bg-amber-500/10 text-amber-400 border border-amber-500/20`
* **Paid**: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
* **Overdue**: `bg-rose-500/10 text-rose-400 border border-rose-500/20`

### 4.4 Invoices Data Table
* Built inside a sleek glass container (`border border-white/10 rounded-2xl overflow-hidden bg-slate-900/70`).
* Row hover effect: `hover:bg-indigo-500/5 transition-colors cursor-pointer`.
* Actions on row: Quick Status changer dropdown, View/PDF Print trigger, Edit, and Delete.

---

## 5. Responsive Behavior
* **Mobile (<640px)**: The line-item table converts to stacked card inputs; status table collapses secondary metadata (created date, tax breakdown) into an expandable accordion drawer.
* **Desktop (>=1024px)**: Full split-view available when drafting an invoice (Form input on the left, live generated Invoice PDF preview on the right).