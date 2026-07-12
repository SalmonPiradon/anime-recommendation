import { AdminLayout } from "../../components/page-components/AdminLayout";

// หน้า Notification (placeholder รอทำ logic ใน branch ถัดไป)
function AdminNotificationPage() {
  return (
    <AdminLayout pageTitle="Notification">
      <section className="rounded-2xl bg-[#EFEEEB] px-6 py-10">
        <p className="text-[16px] text-[#75716B]">
          หน้านี้จะแสดงรายการแจ้งเตือน (ทำใน branch feature/admin-settings)
        </p>
      </section>
    </AdminLayout>
  );
}

export default AdminNotificationPage;
