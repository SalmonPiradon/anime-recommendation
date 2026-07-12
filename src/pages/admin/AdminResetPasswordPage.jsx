import { AdminLayout } from "../../components/page-components/AdminLayout";

// หน้า Reset password ของ admin (placeholder รอทำ logic ใน branch ถัดไป)
function AdminResetPasswordPage() {
  return (
    <AdminLayout pageTitle="Reset password">
      <section className="rounded-2xl bg-[#EFEEEB] px-6 py-10">
        <p className="text-[16px] text-[#75716B]">
          หน้านี้จะเป็นฟอร์มเปลี่ยนรหัสผ่าน (ทำใน branch
          feature/admin-settings)
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminResetPasswordPage;
