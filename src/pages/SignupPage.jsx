import { Link, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { NavBar } from "../components/page-components/NavBar";
import { Input } from "@/components/ui/input";
import { isEmailTaken, saveUser } from "@/lib/authStorage";

const signupFields = [
  { id: "name", label: "Name", type: "text", placeholder: "Full name" },
  { id: "username", label: "Username", type: "text", placeholder: "Username" },
  { id: "email", label: "Email", type: "email", placeholder: "Email" },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
  },
];

const initialFormData = {
  name: "",
  username: "",
  email: "",
  password: "",
};

const initialErrors = {
  name: "",
  username: "",
  email: "",
  password: "",
};

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Email must be a valid email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isEmailTaken(formData.email)) {
      newErrors.email = "Email is already taken, Please try another email.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    saveUser(formData);
    setStep("success");
  };

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
              onClick={() => navigate("/")}
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
              {signupFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={field.id}
                    className="text-[16px] font-medium text-[#75716B]"
                  >
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
                      errors[field.id]
                        ? "border-red-500"
                        : "border-stone-300"
                    }`}
                  />
                  {errors[field.id] && (
                    <p className="text-[14px] text-red-500">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

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
