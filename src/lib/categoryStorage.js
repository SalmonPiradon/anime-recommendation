import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/categories`;

function normalizeCategory(category) {
  return {
    id: String(category.id),
    name: category.name || category.category || "",
  };
}

function normalizeCategories(data) {
  const list = Array.isArray(data)
    ? data
    : data?.categories || data?.data || [];

  return list.map(normalizeCategory).filter((category) => category.name);
}

// ดึง category ทั้งหมดจาก API
export async function loadCategories() {
  const response = await axios.get(API_URL);
  return normalizeCategories(response.data);
}

// ดึงชื่อ category (ใช้ในหน้า article filter / select)
export async function loadCategoryNames() {
  const categories = await loadCategories();
  return categories.map((category) => category.name);
}

// ดึง category ตาม id
export async function fetchCategoryById(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const data = response.data?.category || response.data?.data || response.data;
    return normalizeCategory(data);
  } catch {
    // ถ้าไม่มี GET by id → หาจาก list แทน
    const categories = await loadCategories();
    return (
      categories.find((category) => String(category.id) === String(id)) || null
    );
  }
}

// สร้าง category ใหม่
export async function createCategory(name) {
  const response = await axios.post(API_URL, { name: name.trim() });
  return response.data;
}

// แก้ไขชื่อ category
export async function updateCategory(id, name) {
  const response = await axios.put(`${API_URL}/${id}`, { name: name.trim() });
  return response.data;
}

// ลบ category ตาม id
export async function deleteCategory(id) {
  await axios.delete(`${API_URL}/${id}`);
}
