// =====================
// STORAGE KEYS
// =====================
const KEYS = {
  posts: "xclone_posts_v5",
  profile: "xclone_profile_v2",
  theme: "xclone_theme_v2",
  notifs: "xclone_notifs_v2",
  messages: "xclone_msgs_v2",
  history: "xclone_history_v2",
  route: "xclone_route_v2",
  follows: "xclone_follows_v1",
};

const MAX_CHARS = 280;

// =====================
// DOM
// =====================
const main = document.querySelector("main");
const overlay = document.getElementById("overlay");
const composer = document.getElementById("composer");
const openPostBtn = document.getElementById("openPost");
const closePostBtn = document.getElementById("closePost");

const views = document.querySelectorAll(".view");
const feedList = document.getElementById("feedList");

// Home tabs
const tabs = document.querySelectorAll(".tab");
let activeTab = "for-you";

// Modal composer
const form = document.getElementById("post-form");
const caption = document.getElementById("caption");
const postBtn = document.querySelector(".post");
const charCounter = document.getElementById("char-counter");
const imgInput = document.getElementById("img");
const videoInput = document.getElementById("video");
const postImg = document.getElementById("post-img");
const postVideo = document.getElementById("post-video");
const imgInputIcon = document.getElementsByClassName("icon-for-select")[0];
const videoInputIcon = document.getElementsByClassName("icon-for-select")[1];

// Inline composer
const inlineCaption = document.getElementById("inline-caption");
const inlineCounter = document.getElementById("inline-counter");
const inlinePostBtn = document.getElementById("inlinePostBtn");
const inlineImgInput = document.getElementById("inline-img");
const inlineVideoInput = document.getElementById("inline-video");
const inlineImgPreview = document.getElementById("inline-img-preview");
const inlineVideoPreview = document.getElementById("inline-video-preview");
const inlineOpenModal = document.getElementById("inlineOpenModal");
const inlineAvatar = document.getElementById("inlineAvatar");

// Profile view
const profileAvatar = document.getElementById("profileAvatar");
const profileNameEl = document.getElementById("profileName");
const profileHandleEl = document.getElementById("profileHandle");
const profileBioEl = document.getElementById("profileBio");
const profileList = document.getElementById("profileList");
const pTabs = document.querySelectorAll(".ptab");
let activeProfileTab = "posts";

// Settings
const setName = document.getElementById("setName");
const setUser = document.getElementById("setUser");
const setBio = document.getElementById("setBio");
const toggleTheme = document.getElementById("toggleTheme");
const saveProfileBtn = document.getElementById("saveProfile");
const clearDataBtn = document.getElementById("clearData");

// Search view
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchClear = document.getElementById("searchClear");
const searchResults = document.getElementById("searchResults");
const rightSearch = document.getElementById("rightSearch");
const rightSearchBtn = document.getElementById("rightSearchBtn");

// Messages view
const msgThread = document.getElementById("msgThread");
const msgText = document.getElementById("msgText");
const msgSend = document.getElementById("msgSend");

// Notifications view
const notifList = document.getElementById("notifList");
const notifBadge = document.getElementById("notifBadge");
const markNotifRead = document.getElementById("markNotifRead");

// History view
const historyList = document.getElementById("historyList");

// Top profile UI
const topAvatar = document.getElementById("topAvatar");
const topName = document.getElementById("topName");

// Modal avatar
const modalAvatar = document.getElementById("modalAvatar");

// Thread view
const threadParent = document.getElementById("threadParent");
const threadReplies = document.getElementById("threadReplies");
const threadAvatar = document.getElementById("threadAvatar");
const threadReplyText = document.getElementById("threadReplyText");
const threadCounter = document.getElementById("threadCounter");
const threadSend = document.getElementById("threadSend");

// Image modal
const imgModal = document.getElementById("imgModal");
const imgModalEl = document.getElementById("imgModalEl");
const imgClose = document.getElementById("imgClose");

// Who to follow
const whoToFollow = document.getElementById("whoToFollow");

// Drawer
const drawer = document.getElementById("drawer");
const openDrawer = document.getElementById("openDrawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawerAvatar = document.getElementById("drawerAvatar");
const drawerName = document.getElementById("drawerName");
const drawerUser = document.getElementById("drawerUser");

// Mobile post
const mPost = document.getElementById("mPost");

// =====================
// UTIL
// =====================
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function uuid() { return (crypto?.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random()); }
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}
function linky(text) {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.replace(urlRegex, function (url, b, c) {
    const url2 = c === "www." ? "http://" + url : url;
    return `<a href="${url2}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
function formatTime(ms) {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// =====================
// THEME
// =====================
function applyTheme() {
  const theme = load(KEYS.theme, "dark");
  if (theme === "light") {
    document.documentElement.style.setProperty("--bg", "#f7f9fb");
    document.documentElement.style.setProperty("--text", "#0f1419");
    document.documentElement.style.setProperty("--muted", "#536471");
    document.documentElement.style.setProperty("--panel", "rgba(0,0,0,.05)");
    document.documentElement.style.setProperty("--border", "rgba(0,0,0,.12)");
  } else {
    document.documentElement.style.setProperty("--bg", "#000");
    document.documentElement.style.setProperty("--text", "#f8f9fa");
    document.documentElement.style.setProperty("--muted", "#adb5bd");
    document.documentElement.style.setProperty("--panel", "rgba(255,255,255,.06)");
    document.documentElement.style.setProperty("--border", "rgba(255,255,255,.12)");
  }
}
applyTheme();

// =====================
// STATE
// =====================
const defaultProfile = {
  name: "Asif Khan",
  username: "@asifkhan",
  bio: "No bio yet.",
  avatar: "images/profile-img/profile.jpg",
};

let profile = load(KEYS.profile, defaultProfile);
let posts = load(KEYS.posts, []);
let notifs = load(KEYS.notifs, []);
let messages = load(KEYS.messages, []);
let history = load(KEYS.history, []);
let route = load(KEYS.route, "home");
let follows = load(KEYS.follows, { followedUsernames: [] });

// Thread state
let currentThreadId = null;

// Demo accounts for "Who to follow"
const SUGGESTED = [
  { name: "Elon Musk", username: "@elonmusk", avatar: "images/profile-img/elon.jpg", bio: "CEO at SpaceX" },
  { name: "Mark Zuck", username: "@markzuck", avatar: "images/profile-img/mark.webp", bio: "CEO at Facebook" },
  { name: "Bill Gates", username: "@billgates", avatar: "images/profile-img/bill.jpg", bio: "CEO at Microsoft" },
];

// =====================
// NOTIFS + HISTORY
// =====================
function pushNotif(text) {
  const n = { id: uuid(), text, ts: Date.now(), read: false };
  notifs.unshift(n);
  save(KEYS.notifs, notifs);
  updateNotifBadge();
}
function pushHistory(type, text) {
  history.unshift({ id: uuid(), type, text, ts: Date.now() });
  save(KEYS.history, history);
}
function updateNotifBadge() {
  const unread = notifs.filter(n => !n.read).length;
  if (unread > 0) {
    notifBadge.hidden = false;
    notifBadge.textContent = String(unread);
  } else {
    notifBadge.hidden = true;
  }
}
updateNotifBadge();

// =====================
// ROUTER
// =====================
function setActiveView(next) {
  route = next;
  save(KEYS.route, route);
  views.forEach(v => v.classList.toggle("active", v.dataset.view === next));

  // render screen
  if (next === "home") renderFeed();
  if (next === "profile") renderProfile();
  if (next === "search") renderSearchResults(searchInput.value.trim());
  if (next === "settings") renderSettings();
  if (next === "history") renderHistory();
  if (next === "notifications") renderNotifs();
  if (next === "messages") renderMessages();
  if (next === "thread") renderThread();
}

document.addEventListener("click", (e) => {
  const rEl = e.target.closest("[data-route]");
  if (rEl) {
    e.preventDefault();
    const r = rEl.getAttribute("data-route");
    if (!r) return;
    setActiveView(r);
    closeDrawerUI();
  }
});

// =====================
// PROFILE UI SYNC
// =====================
function syncProfileUI() {
  topAvatar.src = profile.avatar;
  topName.textContent = profile.name;

  inlineAvatar.src = profile.avatar;
  modalAvatar.src = profile.avatar;
  threadAvatar.src = profile.avatar;

  drawerAvatar.src = profile.avatar;
  drawerName.textContent = profile.name;
  drawerUser.textContent = profile.username;

  profileAvatar.src = profile.avatar;
  profileNameEl.textContent = profile.name;
  profileHandleEl.textContent = profile.username;
  profileBioEl.textContent = profile.bio;

  setName.value = profile.name;
  setUser.value = profile.username;
  setBio.value = profile.bio;
}
syncProfileUI();

// =====================
// DRAWER (mobile menu)
// =====================
function openDrawerUI() {
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}
function closeDrawerUI() {
  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}
openDrawer?.addEventListener("click", openDrawerUI);
closeDrawer?.addEventListener("click", closeDrawerUI);
drawer?.addEventListener("click", (e) => { if (e.target === drawer) closeDrawerUI(); });

// =====================
// POSTS / REPLIES MODEL
// parentId === null => normal post
// parentId !== null => reply
// =====================
function normalizeForSave(p) {
  // video blob doesn't persist after refresh
  return { ...p, video: "" };
}
function getRepliesCount(postId) {
  return posts.filter(x => x.parentId === postId).length;
}
function isMine(p) {
  return p.user.username === profile.username;
}
function isFollowingUser(username) {
  return follows.followedUsernames.includes(username);
}

function postTemplate(p, { compact = false } = {}) {
  const replies = getRepliesCount(p.id);

  const imgHtml = p.img
    ? `<img class="post-content post-image" src="${p.img}" style="display:block" alt="post image">`
    : `<img class="post-content post-image" alt="">`;

  const videoHtml = p.video
    ? `<video class="post-content" src="${p.video}" style="display:block" controls controlsList="nodownload"></video>`
    : `<video class="post-content" src="" controls></video>`;

  const likedClass = p.liked ? "liked" : "";

  const menuDelete = isMine(p)
    ? `<button class="menu-item danger" data-action="delete">Delete</button>`
    : ``;

  return `
  <div class="post-container" data-id="${p.id}" data-source="${p.source}" data-parent="${p.parentId || ""}">
    <div class="post-header">
      <img class="post-profile-img" src="${p.user.avatar}" alt="${escapeHtml(p.user.name)}">
      <div class="post-info">
        <div class="post-title flex">
          <span class="verified">${escapeHtml(p.user.name)}</span>
          <span class="muted">·</span>
          <div class="time">${formatTime(p.createdAt)}</div>
          ${p.parentId ? `<span class="muted">· reply</span>` : ``}
        </div>
        <div class="profile-name">${escapeHtml(p.user.username)}</div>
      </div>

      <div class="post-actions">
        <button class="more-btn" aria-label="Post menu">⋯</button>
        <div class="more-menu">
          <button class="menu-item" data-action="copy">Copy text</button>
          <button class="menu-item" data-action="openThread">Open thread</button>
          ${menuDelete}
        </div>
      </div>
    </div>

    <div class="post-body">
      <pre class="caption-text">${p.textHtml}</pre>
      ${imgHtml}
      ${videoHtml}
    </div>

    <div class="post-bottom flex">
      <div class="post-icons">
        <button class="action-btn reply-btn" aria-label="Reply">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20 15a4 4 0 0 1-4 4H9.4l-3.7 2.1A1 1 0 0 1 4 20.2V19a4 4 0 0 1-2-3.5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
          </svg>
        </button>
        <span class="count reply-count">${replies}</span>
      </div>

      <div class="post-icons">
        <svg role="img" xmlns="http://www.w3.org/2000/svg"
          class="post-icon like-btn ${likedClass}"
          fill="none" viewBox="0 0 24 24" aria-label="Like icon"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="count like-count">${p.likes}</span>
      </div>

      <div class="post-icons">
        <svg role="img" xmlns="http://www.w3.org/2000/svg"
          class="post-icon share-btn" fill="none" viewBox="0 0 24 24" aria-label="Share icon"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span class="count share-hint">share</span>
      </div>
    </div>
  </div>`;
}

function renderFeed() {
  const demo = feedList.querySelector(".demo-post");
  const existing = feedList.querySelectorAll('.post-container[data-id]');
  existing.forEach(el => el.remove());

  // only top-level posts in feed
  const topLevel = posts.filter(p => !p.parentId).slice().sort((a, b) => b.createdAt - a.createdAt);

  let filtered = topLevel;
  if (activeTab === "following") {
    filtered = topLevel.filter(p => isFollowingUser(p.user.username) || p.user.username === profile.username);
  }

  filtered.forEach(p => demo.insertAdjacentHTML("beforebegin", postTemplate(p)));

  demo.style.display = (activeTab === "following") ? "none" : "block";
}

function createPost({ text, img, video, parentId = null }) {
  const rawText = (text || "").trim();
  if (!rawText && !img && !video) return;
  if (rawText.length > MAX_CHARS) return;

  const textPlain = rawText;
  const textHtml = linky(escapeHtml(rawText));

  const p = {
    id: uuid(),
    user: { ...profile },
    textHtml,
    textPlain,
    img: img || "",
    video: video || "",
    likes: 0,
    liked: false,
    createdAt: Date.now(),
    parentId,
    source: "following",
  };

  posts.unshift(p);
  save(KEYS.posts, posts.map(normalizeForSave));

  if (parentId) {
    pushNotif(`You replied: "${textPlain.slice(0, 40)}${textPlain.length > 40 ? "..." : ""}"`);
    pushHistory("reply", `Replied in a thread (${textPlain.slice(0, 40)}${textPlain.length > 40 ? "..." : ""})`);
  } else {
    pushNotif(`You posted: "${textPlain.slice(0, 40)}${textPlain.length > 40 ? "..." : ""}"`);
    pushHistory("post", `Created a post (${textPlain.slice(0, 40)}${textPlain.length > 40 ? "..." : ""})`);
  }

  // refresh current screen
  renderFeed();
  renderProfile();
  if (route === "thread") renderThread();
}

// =====================
// HOME TABS
// =====================
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    tabs.forEach(b => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
    renderFeed();
  });
});

// Demo time
(function fixDemoTime() {
  const t = document.getElementsByClassName("time")[0];
  if (t) t.textContent = formatTime(Date.now());
})();

// =====================
// COMPOSER MODAL
// =====================
function openComposer() {
  overlay.classList.add("show");
  composer.classList.add("pop-show");
  main.classList.add("main-block");
  document.body.classList.add("body-hidden");
  setTimeout(() => caption.focus(), 50);
  updateModalButtonState();
}
function closeComposer() {
  overlay.classList.remove("show");
  composer.classList.remove("pop-show");
  main.classList.remove("main-block");
  document.body.classList.remove("body-hidden");
  resetModalFields();
}
openPostBtn?.addEventListener("click", openComposer);
mPost?.addEventListener("click", openComposer);
inlineOpenModal?.addEventListener("click", openComposer);

closePostBtn?.addEventListener("click", (e) => { e.preventDefault(); closeComposer(); });
overlay.addEventListener("click", () => {
  // don't close if drawer is open
  if (drawer.classList.contains("show")) return;
  closeComposer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (composer.classList.contains("pop-show")) closeComposer();
    if (imgModal.classList.contains("show")) closeImageModal();
    if (drawer.classList.contains("show")) closeDrawerUI();
  }
});

function resetModalFields() {
  form.reset();
  postImg.src = "";
  postVideo.src = "";
  postImg.style.display = "none";
  postVideo.style.display = "none";
  imgInput.value = "";
  videoInput.value = "";
  imgInput.disabled = false;
  videoInput.disabled = false;
  imgInputIcon.style.cssText = "opacity: 100%; pointer-events: auto;";
  videoInputIcon.style.cssText = "opacity: 100%; pointer-events: auto;";
  updateModalButtonState();
}

function updateModalButtonState() {
  const len = caption.value.length;
  const hasText = caption.value.trim().length > 0;
  const hasImg = !!postImg.src;
  const hasVideo = !!postVideo.src;

  charCounter.textContent = `${len}/${MAX_CHARS}`;
  charCounter.style.color = len > MAX_CHARS ? "#ff6b6b" : "#adb5bd";

  if ((hasText || hasImg || hasVideo) && len <= MAX_CHARS) postBtn.classList.add("post-valued");
  else postBtn.classList.remove("post-valued");
}
caption.addEventListener("input", updateModalButtonState);

// Modal media
window.readURL = function (input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      postImg.style.display = "block";
      postImg.src = e.target.result;
      videoInput.disabled = true;
      videoInputIcon.style.cssText = "opacity: 60%; pointer-events: none;";
      updateModalButtonState();
    };
    reader.readAsDataURL(input.files[0]);
  }
};
videoInput.onchange = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const blobURL = URL.createObjectURL(file);
  postVideo.style.display = "block";
  postVideo.src = blobURL;
  imgInput.disabled = true;
  imgInputIcon.style.cssText = "opacity: 60%; pointer-events: none;";
  updateModalButtonState();
};

// Modal submit
form.addEventListener("submit", () => {
  createPost({ text: caption.value, img: postImg.src || "", video: postVideo.src || "", parentId: null });
  closeComposer();
});

// =====================
// INLINE COMPOSER
// =====================
function updateInlineButtonState() {
  const len = inlineCaption.value.length;
  inlineCounter.textContent = `${len}/${MAX_CHARS}`;
  inlineCounter.style.color = len > MAX_CHARS ? "#ff6b6b" : "#adb5bd";

  const hasText = inlineCaption.value.trim().length > 0;
  const hasImg = !!inlineImgPreview.src;
  const hasVideo = !!inlineVideoPreview.src;

  inlinePostBtn.disabled = !((hasText || hasImg || hasVideo) && len <= MAX_CHARS);
}
inlineCaption.addEventListener("input", updateInlineButtonState);

inlineImgInput.addEventListener("change", () => {
  const file = inlineImgInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    inlineImgPreview.style.display = "block";
    inlineImgPreview.src = e.target.result;

    inlineVideoInput.value = "";
    inlineVideoPreview.src = "";
    inlineVideoPreview.style.display = "none";

    updateInlineButtonState();
  };
  reader.readAsDataURL(file);
});

inlineVideoInput.addEventListener("change", () => {
  const file = inlineVideoInput.files?.[0];
  if (!file) return;
  const blobURL = URL.createObjectURL(file);
  inlineVideoPreview.style.display = "block";
  inlineVideoPreview.src = blobURL;

  inlineImgInput.value = "";
  inlineImgPreview.src = "";
  inlineImgPreview.style.display = "none";

  updateInlineButtonState();
});

inlinePostBtn.addEventListener("click", () => {
  createPost({ text: inlineCaption.value, img: inlineImgPreview.src || "", video: inlineVideoPreview.src || "", parentId: null });

  inlineCaption.value = "";
  inlineImgPreview.src = "";
  inlineVideoPreview.src = "";
  inlineImgPreview.style.display = "none";
  inlineVideoPreview.style.display = "none";
  inlineImgInput.value = "";
  inlineVideoInput.value = "";
  updateInlineButtonState();
});

// =====================
// THREAD VIEW
// =====================
function openThread(postId) {
  currentThreadId = postId;
  threadReplyText.value = "";
  updateThreadReplyState();
  setActiveView("thread");
}
function updateThreadReplyState() {
  const len = threadReplyText.value.length;
  threadCounter.textContent = `${len}/${MAX_CHARS}`;
  threadCounter.style.color = len > MAX_CHARS ? "#ff6b6b" : "#adb5bd";
  threadSend.disabled = !(threadReplyText.value.trim().length > 0 && len <= MAX_CHARS);
}
threadReplyText.addEventListener("input", updateThreadReplyState);

threadSend.addEventListener("click", () => {
  if (!currentThreadId) return;
  createPost({ text: threadReplyText.value, img: "", video: "", parentId: currentThreadId });
  threadReplyText.value = "";
  updateThreadReplyState();
});

function renderThread() {
  if (!currentThreadId) {
    threadParent.innerHTML = `<div class="card"><div class="card-title">No thread selected</div></div>`;
    threadReplies.innerHTML = "";
    return;
  }

  const parent = posts.find(p => p.id === currentThreadId) || null;
  if (!parent) {
    threadParent.innerHTML = `<div class="card"><div class="card-title">Thread not found</div></div>`;
    threadReplies.innerHTML = "";
    return;
  }

  threadParent.innerHTML = postTemplate(parent, { compact: true });
  const replies = posts
    .filter(p => p.parentId === currentThreadId)
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt);

  threadReplies.innerHTML = "";
  if (replies.length === 0) {
    threadReplies.innerHTML = `<div class="card"><div class="card-title">No replies yet</div><div class="card-sub">Be the first to reply.</div></div>`;
    return;
  }

  replies.forEach(r => threadReplies.insertAdjacentHTML("beforeend", postTemplate(r, { compact: true })));
}

// =====================
// PROFILE TABS
// =====================
pTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    pTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeProfileTab = btn.dataset.ptab;
    renderProfile();
  });
});

function renderProfile() {
  syncProfileUI();
  const mine = posts.filter(p => p.user.username === profile.username).slice().sort((a, b) => b.createdAt - a.createdAt);

  let list = [];
  if (activeProfileTab === "posts") list = mine.filter(p => !p.parentId);
  if (activeProfileTab === "replies") list = mine.filter(p => !!p.parentId);
  if (activeProfileTab === "media") list = mine.filter(p => !!p.img || !!p.video);
  if (activeProfileTab === "likes") list = posts.filter(p => p.liked === true).slice().sort((a, b) => b.createdAt - a.createdAt);

  profileList.innerHTML = "";
  if (list.length === 0) {
    profileList.innerHTML = `<div class="card"><div class="card-title">Nothing here</div><div class="card-sub">Try another tab.</div></div>`;
    return;
  }

  list.forEach(p => {
    profileList.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="card-title">${escapeHtml(p.user.name)} <span class="small">${escapeHtml(p.user.username)}</span></div>
        <div class="card-sub">${escapeHtml((p.textPlain || "Media post").slice(0, 140))}</div>
        <div class="card-row">
          <span class="small">${formatTime(p.createdAt)} · replies ${getRepliesCount(p.id)} · likes ${p.likes}</span>
          <div style="display:flex; gap:.6rem;">
            <button class="chip muted" data-open-thread="${p.id}">Thread</button>
            <button class="chip muted" data-jump="${p.id}" data-route="home">Open</button>
          </div>
        </div>
      </div>
    `);
  });
}

// =====================
// WHO TO FOLLOW + FOLLOWING FEED
// =====================
function renderWhoToFollow() {
  whoToFollow.innerHTML = "";
  SUGGESTED.forEach(acc => {
    const followed = isFollowingUser(acc.username);
    whoToFollow.insertAdjacentHTML("beforeend", `
      <div class="follow-account">
        <img src="${acc.avatar}" class="follow-img" alt="">
        <address class="address">
          <span class="follow-name verified">${escapeHtml(acc.name)}</span>
          <div class="follow-workplace">${escapeHtml(acc.bio)}</div>
        </address>
        <button class="follow ${followed ? "clicked" : ""}" data-follow="${acc.username}">${followed ? "Follow" : "Follow"}</button>
      </div>
    `);
  });
}

function toggleFollow(username) {
  const idx = follows.followedUsernames.indexOf(username);
  if (idx >= 0) {
    follows.followedUsernames.splice(idx, 1);
    pushHistory("follow", `Unfollowed ${username}`);
    pushNotif(`Unfollowed ${username}`);
  } else {
    follows.followedUsernames.push(username);
    pushHistory("follow", `Followed ${username}`);
    pushNotif(`Followed ${username}`);
  }
  save(KEYS.follows, follows);
  renderWhoToFollow();
  if (route === "home") renderFeed();
}

document.addEventListener("click", (e) => {
  const fBtn = e.target.closest("[data-follow]");
  if (!fBtn) return;
  const user = fBtn.getAttribute("data-follow");
  if (!user) return;
  toggleFollow(user);
});

// Keep old inline follow function compatibility
window.followBtnChange = function (btn) {
  btn.classList.toggle("clicked");
};

// =====================
// SEARCH
// =====================
function renderSearchResults(q) {
  const query = (q || "").toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.innerHTML = `<div class="card"><div class="card-title">Type something to search</div><div class="card-sub">Try “@asifkhan” or “hello”.</div></div>`;
    return;
  }

  const matches = posts.filter(p => {
    const inText = (p.textPlain || "").toLowerCase().includes(query);
    const inUser = (p.user.username || "").toLowerCase().includes(query) || (p.user.name || "").toLowerCase().includes(query);
    return inText || inUser;
  }).slice(0, 40);

  if (matches.length === 0) {
    searchResults.innerHTML = `<div class="card"><div class="card-title">No results</div><div class="card-sub">Try another keyword.</div></div>`;
    return;
  }

  matches.forEach(p => {
    searchResults.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="card-title">${escapeHtml(p.user.name)} <span class="small">${escapeHtml(p.user.username)}</span></div>
        <div class="card-sub">${escapeHtml((p.textPlain || "Media post").slice(0, 140))}</div>
        <div class="card-row">
          <span class="small">${formatTime(p.createdAt)} · ${p.parentId ? "reply" : "post"} · likes ${p.likes}</span>
          <div style="display:flex; gap:.6rem;">
            <button class="chip muted" data-open-thread="${p.parentId || p.id}">Thread</button>
            <button class="chip muted" data-jump="${p.id}" data-route="home">Open</button>
          </div>
        </div>
      </div>
    `);
  });
}
searchBtn.addEventListener("click", () => renderSearchResults(searchInput.value.trim()));
searchClear.addEventListener("click", () => { searchInput.value = ""; renderSearchResults(""); });
rightSearchBtn.addEventListener("click", () => {
  setActiveView("search");
  searchInput.value = rightSearch.value.trim();
  renderSearchResults(searchInput.value.trim());
});
rightSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); rightSearchBtn.click(); }
});

// =====================
// SETTINGS
// =====================
function renderSettings() {
  setName.value = profile.name;
  setUser.value = profile.username;
  setBio.value = profile.bio;
}
toggleTheme.addEventListener("click", () => {
  const cur = load(KEYS.theme, "dark");
  const next = cur === "dark" ? "light" : "dark";
  save(KEYS.theme, next);
  applyTheme();
});

saveProfileBtn.addEventListener("click", () => {
  profile = {
    ...profile,
    name: setName.value.trim() || profile.name,
    username: (setUser.value.trim() || profile.username).startsWith("@")
      ? (setUser.value.trim() || profile.username)
      : "@" + (setUser.value.trim() || profile.username).replace(/^@/, ""),
    bio: setBio.value.trim() || "No bio yet.",
  };
  save(KEYS.profile, profile);
  syncProfileUI();
  pushNotif("Profile updated");
  pushHistory("settings", "Updated profile settings");
  setActiveView("profile");
});

clearDataBtn.addEventListener("click", () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  posts = [];
  notifs = [];
  messages = [];
  history = [];
  follows = { followedUsernames: [] };
  profile = defaultProfile;
  save(KEYS.profile, profile);
  save(KEYS.follows, follows);
  save(KEYS.theme, "dark");
  applyTheme();
  syncProfileUI();
  updateNotifBadge();
  renderWhoToFollow();
  renderFeed();
  renderProfile();
  renderNotifs();
  renderMessages();
  renderHistory();
  alert("App data cleared.");
});

// =====================
// NOTIFICATIONS
// =====================
function renderNotifs() {
  notifList.innerHTML = "";
  if (notifs.length === 0) {
    notifList.innerHTML = `<div class="card"><div class="card-title">No notifications</div><div class="card-sub">Interact with posts to generate notifications.</div></div>`;
    return;
  }
  notifs.slice(0, 60).forEach(n => {
    notifList.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="card-title">${escapeHtml(n.text)}</div>
        <div class="card-sub">${formatTime(n.ts)} · ${n.read ? "read" : "unread"}</div>
      </div>
    `);
  });
}
markNotifRead.addEventListener("click", () => {
  notifs = notifs.map(n => ({ ...n, read: true }));
  save(KEYS.notifs, notifs);
  updateNotifBadge();
  renderNotifs();
});

// =====================
// MESSAGES
// =====================
function renderMessages() {
  msgThread.innerHTML = "";
  if (messages.length === 0) {
    msgThread.innerHTML = `<div class="bubble">Say hi 👋 (this is a local demo chat)</div>`;
    return;
  }
  messages.slice(-100).forEach(m => {
    msgThread.insertAdjacentHTML("beforeend", `
      <div class="bubble ${m.from === "me" ? "me" : ""}">${escapeHtml(m.text)}</div>
    `);
  });
  msgThread.scrollTop = msgThread.scrollHeight;
}
function sendMessage(text, from = "me") {
  const t = text.trim();
  if (!t) return;
  messages.push({ id: uuid(), from, text: t, ts: Date.now() });
  save(KEYS.messages, messages);
  pushHistory("message", `Sent a message: ${t.slice(0, 30)}${t.length > 30 ? "..." : ""}`);
  renderMessages();

  if (from === "me") {
    setTimeout(() => {
      messages.push({ id: uuid(), from: "other", text: "Got it ✅", ts: Date.now() });
      save(KEYS.messages, messages);
      renderMessages();
    }, 450);
  }
}
msgSend.addEventListener("click", () => { sendMessage(msgText.value, "me"); msgText.value = ""; });
msgText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); msgSend.click(); }
});

// =====================
// HISTORY
// =====================
function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = `<div class="card"><div class="card-title">No activity yet</div><div class="card-sub">Likes, posts, replies, shares will appear here.</div></div>`;
    return;
  }
  history.slice(0, 100).forEach(h => {
    historyList.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="card-title">${escapeHtml(h.type.toUpperCase())}</div>
        <div class="card-sub">${escapeHtml(h.text)} · ${formatTime(h.ts)}</div>
      </div>
    `);
  });
}

// =====================
// IMAGE MODAL
// =====================
function openImageModal(src) {
  imgModalEl.src = src;
  imgModal.classList.add("show");
  imgModal.setAttribute("aria-hidden", "false");
}
function closeImageModal() {
  imgModal.classList.remove("show");
  imgModal.setAttribute("aria-hidden", "true");
  imgModalEl.src = "";
}
imgClose.addEventListener("click", closeImageModal);
imgModal.addEventListener("click", (e) => { if (e.target === imgModal) closeImageModal(); });

// =====================
// POST INTERACTIONS (delegation)
// =====================
document.addEventListener("click", async (e) => {
  // close menus when clicking outside
  document.querySelectorAll(".more-menu.show").forEach(m => {
    const actions = m.closest(".post-actions");
    if (actions && !actions.contains(e.target)) m.classList.remove("show");
  });

  // open thread from cards (profile/search)
  const openThreadBtn = e.target.closest("[data-open-thread]");
  if (openThreadBtn) {
    const id = openThreadBtn.getAttribute("data-open-thread");
    if (id) openThread(id);
    return;
  }

  const postEl = e.target.closest(".post-container");
  if (!postEl) return;

  // menu toggle
  const moreBtn = e.target.closest(".more-btn");
  if (moreBtn) { postEl.querySelector(".more-menu")?.classList.toggle("show"); return; }

  // menu actions
  const menuItem = e.target.closest(".menu-item");
  if (menuItem) {
    const action = menuItem.dataset.action;
    const postId = postEl.getAttribute("data-id");
    const txt = postEl.querySelector(".caption-text")?.textContent?.trim() || "";

    if (action === "copy") {
      try { await navigator.clipboard.writeText(txt); }
      catch { alert("Could not copy text."); }
      postEl.querySelector(".more-menu")?.classList.remove("show");
      return;
    }

    if (action === "openThread") {
      if (postId) openThread(postId);
      else openThread("demo");
      return;
    }

    if (action === "delete") {
      if (!postId) return;
      // delete post + its replies
      posts = posts.filter(p => p.id !== postId && p.parentId !== postId);
      save(KEYS.posts, posts.map(normalizeForSave));
      pushHistory("delete", `Deleted a post (${txt.slice(0, 40)}${txt.length > 40 ? "..." : ""})`);
      renderFeed();
      renderProfile();
      if (route === "thread") renderThread();
      return;
    }
  }

  // reply
  const replyBtn = e.target.closest(".reply-btn");
  if (replyBtn) {
    const postId = postEl.getAttribute("data-id");
    if (postId) openThread(postId);
    return;
  }

  // like
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    const likeCountEl = postEl.querySelector(".like-count");
    const postId = postEl.getAttribute("data-id");

    // demo UI only
    if (!postId) {
      likeBtn.classList.toggle("liked");
      likeBtn.classList.remove("like-anim"); void likeBtn.offsetWidth; likeBtn.classList.add("like-anim");
      const cur = parseInt(likeCountEl.textContent || "0", 10);
      likeCountEl.textContent = likeBtn.classList.contains("liked") ? cur + 1 : Math.max(0, cur - 1);
      pushHistory("like", "Liked a demo post");
      return;
    }

    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return;

    posts[idx].liked = !posts[idx].liked;
    posts[idx].likes = posts[idx].liked ? posts[idx].likes + 1 : Math.max(0, posts[idx].likes - 1);

    likeBtn.classList.toggle("liked", posts[idx].liked);
    likeBtn.classList.remove("like-anim"); void likeBtn.offsetWidth; likeBtn.classList.add("like-anim");
    likeCountEl.textContent = posts[idx].likes;

    save(KEYS.posts, posts.map(normalizeForSave));
    pushHistory("like", `${posts[idx].liked ? "Liked" : "Unliked"} a post`);
    pushNotif(posts[idx].liked ? "You liked a post" : "You unliked a post");

    renderProfile();
    if (route === "thread") renderThread();
    return;
  }

  // share
  const shareBtn = e.target.closest(".share-btn");
  if (shareBtn) {
    const postId = postEl.getAttribute("data-id") || "demo";
    const txt = postEl.querySelector(".caption-text")?.textContent?.trim() || "";
    const shareText = `X Clone Post (${postId}): ${txt}`;
    try {
      await navigator.clipboard.writeText(shareText);
      const hint = postEl.querySelector(".share-hint");
      if (hint) { const old = hint.textContent; hint.textContent = "copied!"; setTimeout(() => hint.textContent = old, 900); }
    } catch {
      alert("Copy failed:\n" + shareText);
    }
    pushHistory("share", "Shared a post (copied to clipboard)");
    return;
  }

  // image zoom
  const img = e.target.closest(".post-image");
  if (img && img.getAttribute("src")) openImageModal(img.getAttribute("src"));
});

// jump to post
document.addEventListener("click", (e) => {
  const jumpBtn = e.target.closest("[data-jump]");
  if (!jumpBtn) return;
  const id = jumpBtn.getAttribute("data-jump");
  setActiveView("home");
  setTimeout(() => {
    const el = document.querySelector(`.post-container[data-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
});

// =====================
// INITIAL LOAD + RENDER
// =====================
function applyInitial() {
  profile = load(KEYS.profile, defaultProfile);
  posts = load(KEYS.posts, []);
  notifs = load(KEYS.notifs, []);
  messages = load(KEYS.messages, []);
  history = load(KEYS.history, []);
  follows = load(KEYS.follows, { followedUsernames: [] });

  syncProfileUI();
  updateNotifBadge();
  updateModalButtonState();
  updateInlineButtonState();
  renderWhoToFollow();

  // keep route
  setActiveView(route);

  // if no thread selected, keep null
  if (route === "thread" && currentThreadId) renderThread();
}
applyInitial();

// =====================
// SETTINGS NAV SHORTCUTS
// =====================
toggleTheme.addEventListener("click", () => {
  const cur = load(KEYS.theme, "dark");
  const next = cur === "dark" ? "light" : "dark";
  save(KEYS.theme, next);
  applyTheme();
});


