import axios from "axios";

import { getCategoryNames } from "./categoryStorage";

// เก็บบทความใน localStorage
// ครั้งแรกจะดึงโพสต์จริงจาก API (~30 บทความ) มาเก็บไว้
// จากนั้น create / edit / delete จะทำงานบน localStorage

const ARTICLES_KEY = "blog_admin_articles";
const SEED_VERSION_KEY = "blog_admin_articles_seed_version";
// เปลี่ยนเลขนี้เมื่ออยากบังคับโหลดข้อมูลจาก API ใหม่
const SEED_VERSION = "api-v1";

const API_URL = "https://blog-post-project-api.vercel.app/posts";

// ดึงชื่อหมวดหมู่จาก categoryStorage (สร้าง/แก้ในหน้า Category management ได้)
export function getArticleCategories() {
  return getCategoryNames();
}

// เก็บไว้เพื่อโค้ดเก่าที่ยัง import ARTICLE_CATEGORIES
export const ARTICLE_CATEGORIES = ["Cat", "Inspiration", "General"];

// แปลงข้อมูลจาก API → รูปแบบที่หน้า admin ใช้
function mapApiPostToArticle(post) {
  return {
    id: String(post.id),
    title: post.title,
    category: post.category,
    status: "Published", // โพสต์จาก API ถือว่าเผยแพร่แล้ว
    author: post.author,
    introduction: post.description || "",
    content: post.content || "",
    thumbnail: post.image || "",
    createdAt: post.date,
  };
}

// เขียนรายการบทความลง localStorage ทั้งชุด
function saveArticles(articles) {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

// อ่านบทความทั้งหมดจาก localStorage (แบบ sync)
export function getArticles() {
  const raw = localStorage.getItem(ARTICLES_KEY);
  return raw ? JSON.parse(raw) : [];
}

// ดึงโพสต์จาก API แล้วเก็บลง localStorage (ทำครั้งแรก หรือเมื่อ seed version เปลี่ยน)
export async function loadArticles() {
  const currentSeed = localStorage.getItem(SEED_VERSION_KEY);
  const existing = getArticles();

  // ถ้าเคย seed เวอร์ชันนี้แล้ว และมีข้อมูลอยู่แล้ว → ใช้ของเดิมได้เลย
  if (currentSeed === SEED_VERSION && existing.length > 0) {
    return existing;
  }

  // ดึงโพสต์ทั้งหมดจาก API (ตอนนี้มี 30 โพสต์)
  const response = await axios.get(API_URL, {
    params: { page: 1, limit: 30 },
  });

  const articles = (response.data.posts || []).map(mapApiPostToArticle);
  saveArticles(articles);
  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);

  return articles;
}

// หาบทความจาก id
export function getArticleById(id) {
  return getArticles().find((article) => String(article.id) === String(id));
}

// สร้างบทความใหม่
export function createArticle(articleData) {
  const articles = getArticles();
  const newArticle = {
    ...articleData,
    id: String(Date.now()), // ใช้เวลาปัจจุบันเป็น id ง่ายๆ
    createdAt: new Date().toISOString(),
  };

  articles.unshift(newArticle); // ใส่ไว้บนสุดของรายการ
  saveArticles(articles);
  return newArticle;
}

// แก้ไขบทความตาม id
export function updateArticle(id, updates) {
  const articles = getArticles();
  const index = articles.findIndex(
    (article) => String(article.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  articles[index] = {
    ...articles[index],
    ...updates,
    id: articles[index].id, // กันไม่ให้ id ถูกเปลี่ยน
  };

  saveArticles(articles);
  return articles[index];
}

// ลบบทความตาม id
export function deleteArticle(id) {
  const articles = getArticles().filter(
    (article) => String(article.id) !== String(id),
  );
  saveArticles(articles);
}
