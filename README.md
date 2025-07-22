# Time Tracker App

A simple web app built with **HTML, CSS, JavaScript (TypeScript)** to track time sessions, display logs, and support light/dark themes.  

---

## **How to Run the Project**

### **1. Install Dependencies**
Ensure you have **Node.js (>=18)** and **npm** installed.
```bash
npm install
````

### **2. Start the Development Server**

```bash
npm run dev
```

Open the URL printed in the terminal (default: `http://localhost:5173`).

### **3. Build for Production (Optional)**

```bash
npm run build
npm run preview
```

---

## **Project Structure**

```
time-tracker-app/
├─ src/
│  ├─ functions/
│  │  ├─ storage.ts      # localStorage read/write helpers
│  │  └─ theme.ts        # light/dark theme toggle
│  ├─ styles/
│  │  └─ style.css       # global styles, responsive layout
│  ├─ types/
│  │  ├─ StoredData.ts   # interface for saved data
│  │  ├─ TimerLog.ts     # interface for timer log entries
│  │  └─ TimerState.ts   # interface for timer state
│  ├─ main.ts            # main entry point: timer logic & DOM events
│  └─ utils.ts           # helper functions (e.g., time formatting)
├─ index.html            # semantic structure & root markup
├─ package.json          # scripts and dependencies
├─ tsconfig.json         # TypeScript configuration
└─ .gitignore
```

---

## **Challenges or Trade-offs**

1. **Timer Precision vs. Performance**

   * Using `setInterval()` (250ms) for updating the UI balances smooth updates with performance.

2. **TypeScript Strictness**

   * With `strict: true` enabled, it required careful typing of DOM elements and function return types.

3. **State Persistence**

   * `localStorage` was chosen for simplicity, but it doesn’t handle multi-tab synchronization.

4. **UI Responsiveness**

   * CSS Grid & Flexbox were used for responsive layout. A decision was made to keep the design minimal rather than adding complex UI frameworks.

5. **Accessibility**

   * Added `aria-label`, `aria-live`, and proper heading structure. However, screen reader testing could be further improved.

---

## **Next Steps (Possible Improvements)**

* Add total time per day summary.
* Implement edit/delete for log entries.
* Export session data as CSV.

---


