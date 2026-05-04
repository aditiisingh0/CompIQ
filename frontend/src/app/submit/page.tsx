"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    level: "L4",
    location: "",
    experience_years: 0,
    base_salary: 0,
    bonus: 0,
    stock: 0,
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("https://compiq.onrender.com/ingest-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      alert("✅ Salary Submitted!");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting");
    }
  };

  const inputCls =
    "w-full bg-panel border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-subtle focus:outline-none focus:border-accent/60";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Submit Salary
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className={inputCls}
          placeholder="Company"
          onChange={(e) => handleChange("company", e.target.value)}
        />

        <input
          className={inputCls}
          placeholder="Role"
          onChange={(e) => handleChange("role", e.target.value)}
        />

        <select
          className={inputCls}
          onChange={(e) => handleChange("level", e.target.value)}
        >
          <option>L3</option>
          <option>L4</option>
          <option>L5</option>
          <option>L6</option>
          <option>L7</option>
          <option>L8</option>
        </select>

        <input
          className={inputCls}
          placeholder="Location"
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <input
          className={inputCls}
          type="number"
          placeholder="Experience (years)"
          onChange={(e) =>
            handleChange("experience_years", Number(e.target.value))
          }
        />

        <input
          className={inputCls}
          type="number"
          placeholder="Base Salary"
          onChange={(e) =>
            handleChange("base_salary", Number(e.target.value))
          }
        />

        <input
          className={inputCls}
          type="number"
          placeholder="Bonus"
          onChange={(e) => handleChange("bonus", Number(e.target.value))}
        />

        <input
          className={inputCls}
          type="number"
          placeholder="Stock"
          onChange={(e) => handleChange("stock", Number(e.target.value))}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Submit Salary
        </button>
      </form>
    </div>
  );
}