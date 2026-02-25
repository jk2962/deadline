<div align="center">

# ⏰ Deadline

### A minimalist deadline tracker for students — no accounts, no cloud, no friction

[![GitHub](https://img.shields.io/badge/GitHub-View_Code-181717?style=for-the-badge&logo=github)](https://github.com/jk2962/deadline)

![Electron](https://img.shields.io/badge/Electron-28-47848F?style=flat-square&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4-FF6B35?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-macOS-lightgrey?style=flat-square&logo=apple&logoColor=white)

---

**Track every deadline before it tracks you.** Live countdowns, urgency-based color coding, and local-first storage — everything a student needs, nothing they don't.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Data Storage](#-data-storage)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### ⏱️ **Live Countdowns**
Tasks update in real time, down to the second. Always know exactly how much time you have left.

</td>
<td width="50%">

### 🚦 **Urgency Levels**
Cards change color automatically as deadlines approach:

| Level    | Threshold     | Color    |
|----------|---------------|----------|
| Calm     | > 24 hours    | Green    |
| Aware    | > 6 hours     | Yellow   |
| Urgent   | > 1 hour      | Orange   |
| Critical | > 15 minutes  | Red      |
| Alarm    | < 15 minutes  | Pulsing  |
| Overdue  | Past deadline | —        |

</td>
</tr>
<tr>
<td width="50%">

### 🔍 **Smart Search & Filters**
- Instant search by task title
- Time filters: Today, 3 Days, 1 Week, 2 Weeks, 1 Month
- Tag-based filtering from the sidebar

</td>
<td width="50%">

### 🏷️ **Tags with Custom Colors**
- Organize tasks into color-coded categories
- Filter by tag from the sidebar
- Full CRUD — create, rename, delete

</td>
</tr>
<tr>
<td width="50%">

### ✏️ **Inline Editing**
Click any title or deadline to edit it in place. No modals, no extra steps.

</td>
<td width="50%">

### 🌿 **Someday Tasks**
Add tasks without a deadline for things that matter but aren't urgent. No pressure.

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

#### **App Shell**
- **Framework:** [Electron](https://electronjs.org) 28
- **Build Tool:** [electron-vite](https://electron-vite.org) 2
- **Target:** macOS arm64

</td>
<td valign="top" width="50%">

#### **Renderer**
- **UI:** [React](https://react.dev) 18 + [Vite](https://vitejs.dev) 5
- **State:** [Zustand](https://zustand-demo.pmnd.rs) 4
- **Storage:** JSON files via Electron `userData`

</td>
</tr>
</table>

---

## 🚀 Getting Started

### **Prerequisites**

```bash
Node.js 18+
npm
```

### **Install & Run**

```bash
# Clone repository
git clone https://github.com/jk2962/deadline.git
cd deadline

# Install dependencies
npm install

# Start in development mode
npm run dev
```

### **Build for Production**

```bash
# Build macOS app (arm64)
npm run dist
```

The built app is output to `dist/`.

---

## 📁 Project Structure

```
deadline/
├── build/
│   └── icon.icns               # macOS app icon
├── src/
│   ├── main/
│   │   ├── index.js            # Electron main process entry
│   │   └── ipc.js              # IPC handlers for tasks and tags
│   ├── preload/                 # Context bridge (window.api)
│   └── renderer/src/
│       ├── App.jsx              # Root layout, filters, search
│       ├── components/
│       │   ├── TaskList.jsx     # Filtered, sorted task list
│       │   ├── TaskCard.jsx     # Individual task with inline editing
│       │   ├── NewTaskForm.jsx  # Task creation form
│       │   ├── Sidebar.jsx      # Tag-based navigation
│       │   └── TagPicker.jsx    # Tag selector component
│       ├── store/
│       │   ├── useTasks.js      # Task CRUD via IPC
│       │   ├── useTagStore.js   # Tag persistence
│       │   └── useNow.js        # Shared clock tick
│       └── utils/
│           ├── urgency.js       # Urgency levels + countdown formatting
│           └── tags.js          # Tag color utilities
├── electron.vite.config.mjs    # electron-vite configuration
└── package.json
```

---

## 💾 Data Storage

All data is stored locally as JSON — nothing ever leaves your machine.

| File | Location (macOS) | Contents |
|------|-----------------|----------|
| `tasks.json` | `~/Library/Application Support/deadline/` | All tasks |
| `tags.json` | `~/Library/Application Support/deadline/` | Tag definitions |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/jk2962/deadline?style=social)](https://github.com/jk2962/deadline)
[![GitHub forks](https://img.shields.io/github/forks/jk2962/deadline?style=social)](https://github.com/jk2962/deadline/fork)

**Built for students who just want to get things done**

</div>
