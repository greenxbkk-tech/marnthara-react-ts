# Marnthara Pricing Tool (React/TS Version 7)

นี่คือโปรเจกต์ที่ทำการ Reverse Engineering จากเวอร์ชัน JavaScript (V6) มาเป็นสแต็กสมัยใหม่ (Modern Stack)

## Tech Stack

* **Framework:** React 18
* **Language:** TypeScript
* **Bundler:** Vite
* **State Management:** Zustand (v4)
* **Styling:** Pure CSS (จาก `main.css` เดิม)
* **Testing:** Vitest (Unit), Playwright (E2E)
* **Utilities:** Immer, Phosphor Icons, React Hot Toast

## Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(หรือ `yarn install`)*

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *(หรือ `yarn dev`)*

## Build for Production

1.  **Build Static Files:**
    ```bash
    npm run build
    ```
    *(หรือ `yarn build`)*

2.  **Deploy:**
    ไฟล์ที่พร้อมใช้งานจะอยู่ในโฟลเดอร์ `dist/` สามารถนำไป Deploy บน GitHub Pages, Netlify, Vercel หรือโฮสติ้งอื่นๆ ได้ทันที