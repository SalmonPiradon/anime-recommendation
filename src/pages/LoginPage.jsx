import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { NavBar } from "../components/page-components/NavBar";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/authStorage";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const showLoginError = () => {
    setHasError(true);
    toast("Your password is incorrect or this email doesn't exist", {
      description: "Please try another password or email",
      classNames: {
        toast: "!bg-[#EB5164] !w-[500px] !pr-10",
        title: "!text-white !font-semibold !text-base",
        description: "!text-white/95 !text-sm",
        closeButton:
          "!left-auto !right-4 !top-4 !transform-none !size-7 [&>svg]:!size-5 !border-none !bg-transparent !text-white hover:!bg-white/20",
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasError(false);

    const user = loginUser(email, password);

    if (!user) {
      showLoginError();
      return;
    }

    navigate("/");
  };

  const inputClassName = `h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
    hasError ? "border-red-500" : "border-stone-300"
  }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="flex justify-center px-4 py-16">
        <section className="w-full max-w-[600px] rounded-2xl bg-[#EFEEEB] px-8 py-12 md:px-12">
          <h1 className="mb-10 text-center text-4xl font-semibold text-[#26231e]">
            Log in
          </h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasError(false);
                }}
                placeholder="Email"
                className={inputClassName}
              />
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasError(false);
                }}
                placeholder="Password"
                className={inputClassName}
              />
            </div>

            <button
              type="submit"
              className="mx-auto mt-2 cursor-pointer rounded-full bg-[#26231e] px-12 py-3 text-[16px] font-medium text-white"
            >
              Log in
            </button>
          </form>

          <p className="mt-8 text-center text-[16px] text-[#75716B]">
            Don&apos;t have any account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#26231e] underline"
            >
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
