"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserInfoFormProps {
  onLoginSuccess: (userId: string) => Promise<void>;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [classNumber, setClassNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("users")
        .upsert({ name, grade: parseInt(grade), class: parseInt(classNumber) })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("name", name);
        localStorage.setItem("grade", grade);
        localStorage.setItem("class", classNumber);

        await onLoginSuccess(data.id);
      }
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2">
          이름:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="grade" className="block mb-2">
          학년:
        </label>
        <input
          type="number"
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
          min="1"
          max="6"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="class" className="block mb-2">
          반:
        </label>
        <input
          type="number"
          id="class"
          value={classNumber}
          onChange={(e) => setClassNumber(e.target.value)}
          required
          min="1"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        시작하기
      </button>
    </form>
  );
};

export default UserInfoForm;
