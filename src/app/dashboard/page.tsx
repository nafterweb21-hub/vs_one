"use client";

import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6 bg-white text-black">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-600">
          Overview of operations, key metrics, and quick action links.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: "—", change: "0% from last month" },
          { label: "Active Orders", value: "—", change: "0 pending" },
          { label: "Revenue", value: "—", change: "SGD 0.00 this month" },
          { label: "Inventory Items", value: "—", change: "0 items in stock" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl glossy-bg p-6 relative group overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-700">
                {card.label}
              </p>
            </div>
            <p className="mt-2.5 text-3xl font-extrabold tracking-tight text-black">
              {card.value}
            </p>
            <p className="mt-1.5 text-xs text-blue-600 font-bold">
              {card.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
