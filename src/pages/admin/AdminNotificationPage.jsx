import { Link } from "react-router-dom";

import { AdminLayout } from "../../components/page-components/AdminLayout";

// ข้อมูลแจ้งเตือนแบบ mock (ยังไม่ต่อ API จริง)
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New comment on article",
    message: "Someone commented on “The Art of Mindfulness”.",
    time: "2 hours ago",
    linkTo: "/admin/articles",
  },
  {
    id: "2",
    title: "Category updated",
    message: "The “Inspiration” category was edited.",
    time: "Yesterday",
    linkTo: "/admin/categories",
  },
  {
    id: "3",
    title: "New article published",
    message: "An article was saved and published successfully.",
    time: "3 days ago",
    linkTo: "/admin/articles",
  },
  {
    id: "4",
    title: "Profile reminder",
    message: "Don’t forget to complete your admin bio.",
    time: "1 week ago",
    linkTo: "/admin/profile",
  },
];

// หน้า Notification ของ admin — แสดงรายการ + ปุ่ม View
function AdminNotificationPage() {
  return (
    <AdminLayout pageTitle="Notification">
      <section className="overflow-hidden rounded-2xl bg-white">
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <p className="px-6 py-10 text-center text-[16px] text-[#75716B]">
            No notifications
          </p>
        ) : (
          <ul className="divide-y divide-stone-200">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <li
                key={notification.id}
                className="flex items-center justify-between gap-6 px-6 py-5"
              >
                {/* ข้อความแจ้งเตือน */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16px] font-semibold text-[#26231e]">
                    {notification.title}
                  </h2>
                  <p className="mt-1 text-[16px] text-[#75716B]">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-[14px] text-[#A1A1A1]">
                    {notification.time}
                  </p>
                </div>

                {/* กด View แล้วไปหน้าที่เกี่ยวข้อง */}
                <Link
                  to={notification.linkTo}
                  className="shrink-0 rounded-full border border-stone-400 bg-white px-6 py-2 text-[16px] font-medium text-[#26231e] hover:bg-[#EFEEEB]"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminNotificationPage;
