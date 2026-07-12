// เก็บ category ใน localStorage (แบบเดียวกับ articleStorage)
// ใช้ฝึก CRUD ฝั่ง frontend — ยังไม่ต่อ API จริง

const CATEGORIES_KEY = "blog_admin_categories";

// category เริ่มต้น (ตรงกับที่ API ใช้)
const DEFAULT_CATEGORIES = [
  { id: "1", name: "Cat" },
  { id: "2", name: "Inspiration" },
  { id: "3", name: "General" },
];

// อ่าน category ทั้งหมด
export function getCategories() {
  const raw = localStorage.getItem(CATEGORIES_KEY);

  // ถ้ายังไม่เคยมีข้อมูล → ใส่ของเริ่มต้นให้ก่อน
  if (!raw) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }

  return JSON.parse(raw);
}

// เขียนรายการ category ลง localStorage ทั้งชุด
function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// เอาเฉพาะชื่อ category (ใช้ตอน filter / select ในหน้า article)
export function getCategoryNames() {
  return getCategories().map((category) => category.name);
}

// หา category จาก id
export function getCategoryById(id) {
  return getCategories().find((category) => String(category.id) === String(id));
}

// เช็กว่าชื่อซ้ำหรือยัง (ตอนสร้าง/แก้ไข)
export function isCategoryNameTaken(name, excludeId = "") {
  return getCategories().some(
    (category) =>
      category.name.toLowerCase() === name.trim().toLowerCase() &&
      String(category.id) !== String(excludeId),
  );
}

// สร้าง category ใหม่
export function createCategory(name) {
  const categories = getCategories();
  const newCategory = {
    id: String(Date.now()),
    name: name.trim(),
  };

  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
}

// แก้ไขชื่อ category
export function updateCategory(id, name) {
  const categories = getCategories();
  const index = categories.findIndex(
    (category) => String(category.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  categories[index] = {
    ...categories[index],
    name: name.trim(),
  };

  saveCategories(categories);
  return categories[index];
}

// ลบ category ตาม id
export function deleteCategory(id) {
  const categories = getCategories().filter(
    (category) => String(category.id) !== String(id),
  );
  saveCategories(categories);
}
