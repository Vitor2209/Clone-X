# 🐦 X (Twitter) Clone — Front-end

A **front-end clone of X (formerly Twitter)** built **from scratch** using only **HTML, CSS, and Vanilla JavaScript**, focused on:
- real platform-like features
- consistent experience across **desktop and mobile**
- clean and scalable code, ready for future backend integration

👉 This is a **100% front-end project**, no frameworks used.

---

## 🚀 Demo
> Open the project locally using **Live Server** (VS Code) for the best experience.

---

## 🧠 Features

### 🏠 Feed
- Create posts (text, image, or video)
- Character counter (280)
- New posts appear at the top of the feed
- Like / unlike with counter
- Share (copy post reference)
- Threads (reply to posts)
- **For You / Following** tabs

### 👤 Profile
- Profile view
- Editable name, username, and bio
- Tabs: Posts, Replies, Media, and Likes
- Dynamic avatar

### 🔍 Search
- Search posts by text
- Search users by `@username`

### 💬 Messages
- Simple chat system
- Messages stored in `localStorage`

### 🔔 Notifications
- Automatic notifications
- Mark notifications as read

### ⚙️ Settings
- Edit profile
- Toggle theme (Dark / Light)
- Reset application data

### 📱 Mobile
- Side drawer navigation
- Fixed bottom navigation bar
- All desktop features available on mobile

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3**
  - Flexbox
  - Grid
  - Media Queries
- **JavaScript (Vanilla JS)**
- **LocalStorage** for data persistence
- No frameworks or external libraries

---

## 📂 Project Structure

/
├── index.html
├── stylesheets/
│ ├── general.css
│ └── index.css
├── scripts/
│ └── index.js
└── images/
├── icons_white/
├── profile-img/
└── trending-img/

yaml
Copiar código

---

## 💾 Data Persistence

The following data is stored using **LocalStorage**:
- Posts
- Likes
- Profile data
- Messages
- Notifications

> ⚠️ Note: Videos use `blobURL` and may not persist after page reload (front-end limitation).

---

## 📱 Responsiveness

- Desktop
- Tablet
- Mobile

The application behaves **consistently across all screen sizes**.

---

## ▶️ How to Run

1. Clone or download this repository
2. Open the folder in **VS Code**
3. Run with **Live Server**
4. Enjoy 🎉

---

## 🔮 Future Improvements

- Authentication (login/logout)
- Backend integration with Firebase or Supabase
- Infinite scroll on the feed
- Dynamic trends based on hashtags
- Migration to React / Next.js

---

## 👨‍💻 Author

Developed by **Vitor Dutra Melo**  
Project created for learning, practice, and portfolio purposes.

---

## 📄 License

This project is for **educational purposes only**.  
It is not affiliated with or endorsed by **X (Twitter)**.
