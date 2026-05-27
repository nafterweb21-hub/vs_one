"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-200"
    >
      🖨️ Print NCR
    </button>
  );
}
