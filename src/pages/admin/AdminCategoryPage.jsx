import { AdminLayout } from "../../components/page-components/AdminLayout";

// หน้า Category management (placeholder รอทำ logic ใน branch ถัดไป)
function AdminCategoryPage() {
  return (
    <AdminLayout pageTitle="Category management">
      <section className="rounded-2xl bg-[#EFEEEB] px-6 py-10">
        <p className="text-[16px] text-[#75716B]">
          หน้านี้จะแสดงรายการ category ทั้งหมด (ทำใน branch
          feature/category-management)
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminCategoryPage;
