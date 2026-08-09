import { Link, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { NavBar } from "../components/page-components/NavBar";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/authentication";

function SignupPage() {
  const navigate = useNavigate();
  // ดึงฟังก์ชัน signup จาก AuthContext (ยิง API ที่ backend)
  const { signup } = useAuth();

  // "form" = ฟอร์มสมัคร, "success" = หน้า Registration success
  const [step, setStep] = useState("form");

  // เก็บค่าที่ผู้ใช้พิมพ์ในฟอร์ม
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ข้อความ error ใต้ช่อง input (ตามดีไซน์)
  const [errorsMessage, setErrorsMessage] = useState({
    username: "",
    email: "",
    password: "",
  });

  // วางข้อความ error จาก backend ไว้ใต้ field ที่เกี่ยวข้อง
  const showBackendError = (message) => {
    const text = message || "Something went wrong. Please try again.";
    const lower = text.toLowerCase();

    if (lower.includes("username")) {
      setErrorsMessage({ username: text, email: "", password: "" });
      return;
    }

    if (lower.includes("email") || lower.includes("already exists")) {
      setErrorsMessage({ username: "", email: text, password: "" });
      return;
    }

    // error อื่นๆ แสดงใต้ email เป็นจุดหลักของฟอร์ม
    setErrorsMessage({ username: "", email: text, password: "" });
  };

  // ตรวจข้อมูลฝั่ง frontend ก่อนส่ง API
  const validateForm = () => {
    const newErrors = { username: "", email: "", password: "" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // อีเมลต้องมีรูปแบบถูกต้อง
    if (!emailPattern.test(email)) {
      newErrors.email = "Email must be a valid email";
    }

    // รหัสผ่านอย่างน้อย 6 ตัวอักษร
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrorsMessage(newErrors);

    // ถ้ามี error อย่างน้อย 1 อัน → ไม่ผ่าน
    return !newErrors.email && !newErrors.password;
  };

  // กด Sign up → ตรวจฟอร์ม แล้วค่อยส่งไป backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        name,
        username,
        email,
        password,
      });
      setStep("success");
    } catch (error) {
      // แสดงข้อความ error ตามที่ backend ส่งมาจริง
      showBackendError(error.response?.data?.error);
    }
  };

  // class ของ input: ถ้ามี error ให้ขอบแดง
  const getInputClassName = (field) =>
    `h-[48px] bg-white text-[16px] placeholder:text-[#75716B] ${
      errorsMessage[field]
        ? "border-red-500 text-red-500"
        : "border-stone-300 text-[#26231e]"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="flex justify-center px-4 py-16">
        {step === "success" ? (
          <section className="flex w-full max-w-[600px] flex-col items-center rounded-2xl bg-[#EFEEEB] px-8 py-16 md:px-12">
            <CircleCheck
              className="mb-6 size-16 text-[#12B279]"
              aria-hidden="true"
            />
            <h1 className="mb-10 text-center text-4xl font-semibold text-[#26231e]">
              Registration success
            </h1>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer rounded-full bg-[#26231e] px-12 py-3 text-[16px] font-medium text-white"
            >
              Continue
            </button>
          </section>
        ) : (
          <section className="w-full max-w-[600px] rounded-2xl bg-[#EFEEEB] px-8 py-12 md:px-12">
            <h1 className="mb-10 text-center text-4xl font-semibold text-[#26231e]">
              Sign up
            </h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-[16px] font-medium text-[#75716B]"
                >
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  className="h-[48px] border-stone-300 bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-[16px] font-medium text-[#75716B]"
                >
                  Username
                </label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setErrorsMessage((prev) => ({ ...prev, username: "" }));
                  }}
                  placeholder="Username"
                  className={getInputClassName("username")}
                />
                {errorsMessage.username && (
                  <p className="text-[14px] text-red-500">
                    {errorsMessage.username}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[16px] font-medium text-[#75716B]"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorsMessage((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Email"
                  className={getInputClassName("email")}
                />
                {errorsMessage.email && (
                  <p className="text-[14px] text-red-500">
                    {errorsMessage.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[16px] font-medium text-[#75716B]"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorsMessage((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="Password"
                  className={getInputClassName("password")}
                />
                {errorsMessage.password && (
                  <p className="text-[14px] text-red-500">
                    {errorsMessage.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="mx-auto mt-2 cursor-pointer rounded-full bg-[#26231e] px-12 py-3 text-[16px] font-medium text-white"
              >
                Sign up
              </button>
            </form>

            <p className="mt-8 text-center text-[16px] text-[#75716B]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#26231e] underline"
              >
                Log in
              </Link>
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default SignupPage;
