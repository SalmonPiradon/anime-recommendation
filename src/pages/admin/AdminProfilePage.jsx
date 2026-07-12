import { AdminLayout } from "../../components/page-components/AdminLayout";

// หน้า Profile ของ admin (placeholder รอทำ logic ใน branch ถัดไป)
function AdminProfilePage() {
  return (
    <AdminLayout pageTitle="Profile">
      <section className="rounded-2xl bg-[#EFEEEB] px-6 py-10">
        <p className="text-[16px] text-[#75716B]">
          หน้านี้จะเป็นฟอร์มแก้ profile ของ admin (ทำใน branch
          feature/admin-settings)
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminProfilePage;
