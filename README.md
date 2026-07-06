# 🌸 Rajesh & Anchal Wedding Invitation App

A visually stunning, fully interactive, and deeply personalized digital wedding invitation application built with **React**, **TypeScript**, **Tailwind CSS (v4)**, and **Motion**. Designed to invite, engage, and celebrate with guests online.

🎥 **Live Preview:** [Vite App on AI Studio](https://ais-pre-jxq5unncfpzd6txcx7sqnl-973096845495.asia-east1.run.app)

---

## ✨ Features

This digital invitation blends modern animations with traditional aesthetic elements to deliver a heartwarming experience for the guests:

*   **🌸 Interactive Welcome Overlay:** A beautiful and elegant entrance screen that plays traditional background music upon user interaction, respecting browser autoplay policies.
*   **🙏 Sacred Ganesha Header:** Starts with divine blessings featuring a beautifully animated Lord Ganesha motif.
*   **⏳ Live Countdown Timer:** Keeps track of the remaining days, hours, minutes, and seconds until the auspicious moment.
*   **📅 Event Timeline & Details:** A beautifully structured timeline showcasing wedding events (like Haldi, Mehendi, Sangeet, and Wedding) with timings, venue details, and maps.
*   **🎵 Integrated Music Player:** An aesthetic music bar featuring carefully selected tracks:
    *   *Vakratunda Mahakaya* (Lord Ganesha Shlok for auspicious beginnings)
    *   *Aaj Se Teri* (Padman Wedding Theme)
    *   *Rab Ne Milayi Dhadkan* (Rab Ne Bana Di Jodi)
*   **✍️ RSVP Form:** An interactive and seamless form for guests to confirm their attendance, food preferences, and guest count.
*   **📖 Guestbook / Wish Board:** A personalized message board where friends and family can leave blessings, sweet wishes, and celebratory messages.
*   **🍃 Festive Petal Animation:** High-performance falling flower petals (using `motion`) cascading down the screen to provide a lively, traditional, and celebratory atmosphere.
*   **📱 Fully Responsive Design:** Handcrafted using mobile-first Tailwind design principles, looking absolute perfection on mobile screens, tablets, and desktop displays.

---

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Strictly typed for reliability)
*   **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations:** [Motion (Framer Motion v12)](https://motion.dev/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Database & Integration:** Google Sheets API & Firebase integration for live RSVPs and Guestbook entries

---

## 📁 Project Structure

```text
├── public/                 # Static assets (images, music files)
│   └── music/              # MP3 background music files
├── src/
│   ├── components/         # Highly modular React components
│   │   ├── WelcomeOverlay.tsx  # Initial greeting card
│   │   ├── GaneshaHeader.tsx   # Lord Ganesha greeting & blessings
│   │   ├── Countdown.tsx       # Live countdown ticker
│   │   ├── EventTimeline.tsx   # Schedule and details of ceremonies
│   │   ├── MusicPlayer.tsx     # Custom MP3 player
│   │   ├── RsvpForm.tsx        # Guest RSVP submission
│   │   ├── Guestbook.tsx       # Blessing board & comments
│   │   ├── PetalAnimation.tsx  # Interactive falling flower petals
│   │   └── WeddingCard.tsx     # Main wrapper card
│   ├── App.tsx             # Application core layout
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles and Tailwind configs
│   ├── googleSheets.ts     # RSVP sheet integration handlers
│   └── types.ts            # Common TypeScript interfaces
├── package.json            # Scripts & dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

Follow these simple steps to set up and run the project locally:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/wedding-invitation.git
cd wedding-invitation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Your application will be live at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
This compiles the application into static files under the `dist/` directory, optimized and ready to be hosted on Vercel, Netlify, GitHub Pages, or any web hosting provider.

---

## ⚙️ Customization Guide

You can easily adapt this application for other weddings or events:

### 1. Update Names & Dates
Open `src/App.tsx` or `src/components/WelcomeOverlay.tsx` to change the names of the Bride & Groom, and the wedding dates.

### 2. Configure Background Tracks
Place your custom `.mp3` files inside `public/music/` and update the track metadata inside `src/components/MusicPlayer.tsx`:
```typescript
const WEBBING_PLAYLIST = [
  {
    name: "Auspicious Ganesha Shlok",
    artist: "Devotional",
    url: "/music/Vakratunda Mahakaya.mp3",
    type: 'audio',
  },
  // Add your tracks here
];
```

### 3. Change Invitation Card Content & Timeline
Edit `src/components/EventTimeline.tsx` to list custom events, dates, timings, and map integration coordinates for your venues.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_GITHUB_USERNAME/wedding-invitation/issues).

---

## 💖 Show your support

Give a ⭐ if you liked this elegant project or found it helpful for your wedding invitation template!
