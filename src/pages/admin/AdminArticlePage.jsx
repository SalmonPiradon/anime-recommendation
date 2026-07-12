import { AdminLayout } from "../../components/page-components/AdminLayout";

// หน้า Article management (placeholder รอทำ logic ใน branch ถัดไป)
function AdminArticlePage() {
  return (
    <AdminLayout pageTitle="Article management">
      <section className="rounded-2xl bg-[#EFEEEB] px-6 py-10">
        <p className="text-[16px] text-[#75716B]">
          หน้านี้จะแสดงรายการบทความทั้งหมด (ทำใน branch
          feature/article-management)
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminArticlePage;
