"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";

export default function Home() {
  const [totalBill, setTotalBill] = useState("");
  const [roundUp, setRoundUp] = useState(true);

  const [students, setStudents] = useState([
    {
      name: "",
      roomType: "shared",
    },
  ]);

  const billDetailsRef = useRef(null);

  // Add new student
  const addStudent = () => {
    setStudents([
      ...students,
      {
        name: "",
        roomType: "shared",
      },
    ]);
  };

  // Remove student
  const removeStudent = (index) => {
    if (students.length === 1) return;

    setStudents(students.filter((_, i) => i !== index));
  };

  // Update student information
  const updateStudent = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  // Round up to nearest 10 (e.g. 325.70 -> 330)
  const roundUpToTen = (amount) => {
    if (!amount || amount <= 0) return 0;
    return Math.ceil(amount / 10) * 10;
  };

  // Format amount: if roundUp is on, round up to nearest 10
  const formatAmount = (amount) => {
    if (roundUp) {
      return roundUpToTen(amount);
    }
    return Number(amount.toFixed(2));
  };

  // Calculate total weight
  const totalWeight = students.reduce((total, student) => {
    if (student.roomType === "single") {
      return total + 1.5;
    }
    return total + 1;
  }, 0);

  // Calculate 1x bill
  const oneUnitBill =
    totalWeight > 0 && totalBill ? Number(totalBill) / totalWeight : 0;

  // Download bill details as image
  const downloadBillImage = async () => {
    if (!billDetailsRef.current) return;

    try {
      const canvas = await html2canvas(billDetailsRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "mess-electricity-bill.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("ছবি ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Mess Electricity Bill
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            সহজে মেসের বিদ্যুৎ বিল হিসাব করুন
          </p>
        </div>

        {/* Total Bill */}
        <div className="mb-5 rounded-xl bg-white p-4 shadow sm:mb-6 sm:p-6">
          <label className="mb-2 block text-sm font-semibold sm:text-base">
            মোট বিদ্যুৎ বিল
          </label>
          <input
            type="number"
            min="0"
            placeholder="যেমন: 10000"
            value={totalBill}
            onChange={(e) => setTotalBill(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-blue-500 sm:px-4 sm:py-3"
          />

          {/* Round Up Toggle */}
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span className="text-xs leading-relaxed text-gray-700 sm:text-sm">
              ইজি নোটে দেখাও (১০ টাকায় রাউন্ড আপ) — যেমন ৩২৫.৭০ → ৩৩০
            </span>
          </label>
        </div>

        {/* Students */}
        <div className="rounded-xl bg-white p-4 shadow sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold sm:text-xl">Students</h2>
            <button
              onClick={addStudent}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto sm:text-base"
            >
              + Add Student
            </button>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {students.map((student, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-3 sm:p-4"
              >
                <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                  {/* Student Name */}
                  <div>
                    <label className="mb-1 block text-xs text-gray-600 sm:text-sm">
                      Student Name
                    </label>
                    <input
                      type="text"
                      placeholder={`Student ${index + 1}`}
                      value={student.name}
                      onChange={(e) =>
                        updateStudent(index, "name", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:text-base"
                    />
                  </div>

                  {/* Room Type */}
                  <div>
                    <label className="mb-1 block text-xs text-gray-600 sm:text-sm">
                      Room Type
                    </label>
                    <select
                      value={student.roomType}
                      onChange={(e) =>
                        updateStudent(index, "roomType", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base"
                    >
                      <option value="shared">২ জনের রুম (1x)</option>
                      <option value="single">একা রুম (1.5x)</option>
                    </select>
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => removeStudent(index)}
                      disabled={students.length === 1}
                      className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-gray-300 sm:text-base"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Summary */}
        <div className="mt-5 rounded-xl bg-white p-4 shadow sm:mt-6 sm:p-6">
          <h2 className="mb-4 text-lg font-bold sm:mb-5 sm:text-xl">
            Calculation
          </h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {/* Students */}
            <div className="rounded-lg bg-blue-50 p-3 sm:p-4">
              <p className="text-xs text-gray-600 sm:text-sm">
                Total Students
              </p>
              <p className="mt-1 text-xl font-bold text-blue-600 sm:text-2xl">
                {students.length}
              </p>
            </div>

            {/* Total Weight */}
            <div className="rounded-lg bg-purple-50 p-3 sm:p-4">
              <p className="text-xs text-gray-600 sm:text-sm">
                Total Weight
              </p>
              <p className="mt-1 text-xl font-bold text-purple-600 sm:text-2xl">
                {totalWeight.toFixed(2)}
              </p>
            </div>

            {/* 1x Bill */}
            <div className="rounded-lg bg-green-50 p-3 sm:p-4">
              <p className="text-xs text-gray-600 sm:text-sm">1x Bill</p>
              <p className="mt-1 text-xl font-bold text-green-600 sm:text-2xl">
                ৳ {oneUnitBill.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        {totalBill && Number(totalBill) > 0 && (
          <div className="mt-5 rounded-xl bg-white p-4 shadow sm:mt-6 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold sm:text-xl">
                Bill Details
              </h2>

              <button
                onClick={downloadBillImage}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 sm:w-auto sm:text-base"
              >
                ⬇ Download Image
              </button>
            </div>

            {/* Captured area */}
            <div
              ref={billDetailsRef}
              className="w-full overflow-hidden rounded-lg bg-white p-2 sm:p-4"
            >
              {/* Table for small+ screens */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-3 py-3 text-sm lg:px-4">
                        Student
                      </th>
                      <th className="px-3 py-3 text-sm lg:px-4">
                        Room
                      </th>
                      <th className="px-3 py-3 text-sm lg:px-4">
                        Weight
                      </th>
                      <th className="px-3 py-3 text-sm lg:px-4">
                        Bill
                      </th>
                      <th className="px-3 py-3 text-sm lg:px-4">
                        Easy Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const weight =
                        student.roomType === "single" ? 1.5 : 1;
                      const bill = oneUnitBill * weight;
                      const easyNote = roundUpToTen(bill);

                      return (
                        <tr key={index} className="border-b">
                          <td className="px-3 py-3 text-sm font-medium lg:px-4">
                            {student.name || `Student ${index + 1}`}
                          </td>
                          <td className="px-3 py-3 text-sm lg:px-4">
                            {student.roomType === "single"
                              ? "Single"
                              : "Shared"}
                          </td>
                          <td className="px-3 py-3 text-sm lg:px-4">
                            {weight}
                          </td>
                          <td className="px-3 py-3 text-sm font-bold text-green-600 lg:px-4">
                            ৳ {bill.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 text-sm font-bold text-indigo-600 lg:px-4">
                            ৳ {roundUp ? easyNote : bill.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Card layout for mobile */}
              <div className="space-y-3 sm:hidden">
                {students.map((student, index) => {
                  const weight =
                    student.roomType === "single" ? 1.5 : 1;
                  const bill = oneUnitBill * weight;
                  const easyNote = roundUpToTen(bill);

                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">
                          {student.name || `Student ${index + 1}`}
                        </p>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {student.roomType === "single"
                            ? "Single"
                            : "Shared"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Weight</p>
                          <p className="font-semibold">{weight}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bill</p>
                          <p className="font-semibold text-green-600">
                            ৳ {bill.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Easy Note</p>
                          <p className="font-semibold text-indigo-600">
                            ৳ {roundUp ? easyNote : bill.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 p-3 text-sm sm:mt-5 sm:p-4 sm:text-base">
                <span className="font-bold">Total Bill</span>
                <span className="font-bold text-green-600">
                  ৳ {Number(totalBill).toFixed(2)}
                </span>
              </div>

              {roundUp && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-indigo-50 p-3 text-sm sm:p-4 sm:text-base">
                  <span className="font-bold text-indigo-700">
                    Total (Easy Note)
                  </span>
                  <span className="font-bold text-indigo-700">
                    ৳{" "}
                    {students
                      .reduce((sum, s) => {
                        const w = s.roomType === "single" ? 1.5 : 1;
                        return sum + roundUpToTen(oneUnitBill * w);
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}