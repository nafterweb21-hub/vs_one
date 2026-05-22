"use client";

import React, { useState } from "react";

// Categorized master profiles from the specification profiles.md
const MASTER_CATEGORIES = [
  {
    name: "Admin & Finance",
    profiles: [
      {
        id: "approval-levels",
        name: "Approval Level Profile",
        active: true,
        href: "/dashboard/profiles/approval-levels",
        desc: "Defines purchase value bands and multi-tier approval groups.",
        rules: [
          "Defines value bands (Min/Max ranges with 2 decimals).",
          "One band can have multiple approvers; any one can sign off.",
          "Tier-2 POs require Tier-1 approval first.",
          "Applies to material PO and subcon PO, never PR or WO."
        ],
        fields: [
          { name: "Module", type: "Dropdown (Fixed Choices)", mand: "Yes" },
          { name: "Action/Button", type: "Dropdown / Text", mand: "No" },
          { name: "Min Range", type: "Numeric (2 decimals)", mand: "No" },
          { name: "Max Range", type: "Numeric (2 decimals)", mand: "No" },
          { name: "Status", type: "Read-only (Active/Inactive/Void)", mand: "N/A" }
        ]
      },
      {
        id: "company",
        name: "Company Profile",
        active: false,
        desc: "Maintains legal tenant identities, logos, and AS9100 flags.",
        rules: [
          "Single shared DB — companies are rows, not separate databases.",
          "Allow to create PO for WO governs WO linkages (Vision One = Yes, Vision Laser = No).",
          "AS9100 Requirement Note Required toggles supplier note blocks on printouts."
        ],
        fields: [
          { name: "Company Name", type: "Text", mand: "Yes" },
          { name: "Address", type: "Multi-text", mand: "Yes" },
          { name: "GST Reg No", type: "Text", mand: "Yes" },
          { name: "Allow PO for WO", type: "Checkbox", mand: "No" },
          { name: "AS9100 Flag", type: "Checkbox", mand: "No" }
        ]
      },
      {
        id: "employee",
        name: "Employee Profile",
        active: false,
        desc: "Tracks staff members, designation, emails and NRICs for COCs.",
        rules: [
          "Employee name is immutable once saved.",
          "NRIC / FIN is sourced from other entries and is used on COC printouts.",
          "Must have a valid email to receive PR submission notifications."
        ],
        fields: [
          { name: "Employee Code", type: "Text", mand: "Yes" },
          { name: "Employee Name", type: "Text (Immutable)", mand: "Yes" },
          { name: "NRIC / FIN", type: "Dropdown (Employee NRIC)", mand: "Yes" },
          { name: "Email", type: "Text (Email format)", mand: "Yes" }
        ]
      },
      {
        id: "tax",
        name: "Tax Profile",
        active: false,
        desc: "Defines operational tax percentages such as GST rates.",
        rules: [
          "Tax Type is immutable once created (e.g. GST @ 7%).",
          "Tax Rate is numerical up to 3 decimals."
        ],
        fields: [
          { name: "Tax Type", type: "Text (Immutable)", mand: "Yes" },
          { name: "Tax Rate", type: "Numeric (3 decimals)", mand: "Yes" }
        ]
      },
      {
        id: "currency",
        name: "Currency Profile",
        active: false,
        desc: "Configures foreign currency conversion rates against SGD.",
        rules: [
          "All transactions snap the latest rate at creation. Transaction date is irrelevant.",
          "If no rate is defined, system aborts transactions with a prompt.",
          "One currency can be marked as Default."
        ],
        fields: [
          { name: "Currency Code", type: "Text (Immutable)", mand: "Yes" },
          { name: "Currency Name", type: "Text (Immutable)", mand: "Yes" },
          { name: "Exchange Rate", type: "Numeric (3 decimals)", mand: "Yes" },
          { name: "Default", type: "Checkbox", mand: "No" }
        ]
      },
      {
        id: "payment",
        name: "Payment Term Profile",
        active: false,
        desc: "Defines credit limits and terms such as COD or Net 30.",
        rules: [
          "Saves standard payment text (e.g. COD, Net 30).",
          "Mandatory integer days."
        ],
        fields: [
          { name: "Term", type: "Text (Immutable)", mand: "Yes" },
          { name: "Day", type: "Numeric (Integer)", mand: "Yes" }
        ]
      }
    ]
  },
  {
    name: "Partners & Contacts",
    profiles: [
      {
        id: "customer",
        name: "Customer Profile",
        active: false,
        desc: "Manages buyers, multiple contact persons, and delivery addresses.",
        rules: [
          "Customer must be created in this profile before use in Sales Orders.",
          "Has multiple contact persons & addresses with exactly one default each.",
          "Customer Code and Customer Name are immutable once saved."
        ],
        fields: [
          { name: "Customer Code", type: "Text (Immutable)", mand: "Yes" },
          { name: "Customer Name", type: "Text (Immutable)", mand: "Yes" },
          { name: "Contact Person List", type: "Table with 1 Default", mand: "Yes" },
          { name: "Address List", type: "Table with 1 Default", mand: "Yes" }
        ]
      },
      {
        id: "supplier",
        name: "Supplier Profile",
        active: false,
        desc: "Maintains vendor records for procurement and subcon orders.",
        rules: [
          "Supplier must exist before use in purchase orders.",
          "Structure is identical to Customer Profile (header + contact + address).",
          "Purchasers must verify vendor status remains Active."
        ],
        fields: [
          { name: "Supplier Code", type: "Text (Immutable)", mand: "Yes" },
          { name: "Supplier Name", type: "Text (Immutable)", mand: "Yes" },
          { name: "Contacts & Addresses", type: "Sub-tables", mand: "Yes" }
        ]
      }
    ]
  },
  {
    name: "Inventory & Materials",
    profiles: [
      {
        id: "material",
        name: "Material Profile",
        active: false,
        desc: "Stores internal item catalog, sizes, shapes, and category links.",
        rules: [
          "Must exist before use in purchase orders (unless free-text override is used).",
          "Supplier-specific descriptions are captured on the PO line directly, not here.",
          "NO standard UOM is tied to a material — UOM is selected per PO."
        ],
        fields: [
          { name: "Part No", type: "Text", mand: "No" },
          { name: "Description", type: "Multi-text", mand: "Yes" },
          { name: "Shape / Size", type: "Text", mand: "Yes/No" },
          { name: "Material Category", type: "Dropdown (Material Category)", mand: "Yes" }
        ]
      },
      {
        id: "finished-good",
        name: "Finished Good Profile",
        active: false,
        desc: "Tracks manufactured items sold to customers in Sales Orders.",
        rules: [
          "Must exist before use in Sales Order item rows.",
          "No quantity tracking or UOM is defined on the profile."
        ],
        fields: [
          { name: "Part No", type: "Text", mand: "No" },
          { name: "Description", type: "Multi-text", mand: "Yes" }
        ]
      },
      {
        id: "material-cat",
        name: "Material Category Profile",
        active: false,
        desc: "Groups items into specific categories (e.g. Raw Plates).",
        rules: [
          "Used to categorize materials in the main Material Profile.",
          "Category name is immutable once saved."
        ],
        fields: [
          { name: "Category", type: "Text (Immutable)", mand: "Yes" },
          { name: "Remark", type: "Multi-text", mand: "No" }
        ]
      },
      {
        id: "uom",
        name: "UOM Profile",
        active: false,
        desc: "Defines units of measurement like Pieces, Boxes, or Packs.",
        rules: [
          "UOM is immutable once created.",
          "Used extensively in Materials and Purchase Orders."
        ],
        fields: [
          { name: "UOM", type: "Text (Immutable)", mand: "Yes" },
          { name: "Remarks", type: "Multi-text", mand: "No" }
        ]
      }
    ]
  },
  {
    name: "Production & Shop Floor",
    profiles: [
      {
        id: "machine",
        name: "Machine Profile",
        active: false,
        desc: "Maintains welding and machining equipment with categorizations.",
        rules: [
          "Allows inline creation directly from operation modules if value not found.",
          "Machine Category filters which machines appear in welding vs machining routing dropdowns.",
          "Ties to CNC/Convention and Milling/Turning choices."
        ],
        fields: [
          { name: "Machine Code", type: "Text (Immutable)", mand: "Yes" },
          { name: "Machine No / Brand", type: "Text", mand: "Yes" },
          { name: "Machine Category", type: "Fixed Dropdown (Welding / Machine)", mand: "Yes" }
        ]
      },
      {
        id: "process",
        name: "Process Profile (Routing)",
        active: false,
        desc: "Configures sub-process routing steps, costs, and scan parameters.",
        rules: [
          "One row corresponds to one routing process under a Main Process.",
          "Cost per minute (2 decimals) must be specified for costing reports.",
          "Welding, Spray Painting, Machining checkboxes trigger specialized parameter forms on scan-out."
        ],
        fields: [
          { name: "Main Process", type: "Dropdown (Main Process)", mand: "Yes" },
          { name: "Routing Process", type: "Text (Immutable)", mand: "Yes" },
          { name: "Welding/Painting/Machining Flags", type: "Checkboxes", mand: "No" },
          { name: "Cost Per Minute", type: "Numeric (2 decimals)", mand: "Yes" }
        ]
      },
      {
        id: "main-process",
        name: "Main Process Profile",
        active: false,
        desc: "Tracks high-level operational groupings (e.g. Sizing).",
        rules: [
          "Main Process name is immutable once saved.",
          "Feeds into Routing Process dropdowns."
        ],
        fields: [
          { name: "Main Process", type: "Text (Immutable)", mand: "Yes" },
          { name: "Remark", type: "Multi-text", mand: "No" }
        ]
      },
      {
        id: "failure-mode",
        name: "Failure Mode Profile",
        active: false,
        desc: "Catalogs failure reasons for Non-Conformance reporting (NCR).",
        rules: [
          "Allows inline creation directly from NCR module.",
          "Failure Mode is immutable once created (e.g. Coating, Welding Defect)."
        ],
        fields: [
          { name: "Failure Mode", type: "Text (Immutable)", mand: "Yes" },
          { name: "Remark", type: "Multi-text", mand: "No" }
        ]
      }
    ]
  }
];

type ProfileDetails = typeof MASTER_CATEGORIES[0]["profiles"][0];

export default function MasterProfilesDirectory() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileDetails | null>(null);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          Admin Portal
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Master Profiles Directory
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage system-wide static data, finance rates, operational parameters, and approval matrices.
        </p>
      </div>

      {/* Directory Category Loops */}
      <div className="space-y-10">
        {MASTER_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {category.name}
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${
                    profile.active 
                      ? "ring-1 ring-indigo-500/25 dark:ring-indigo-500/10" 
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {profile.name}
                      </h4>
                      {profile.active ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 uppercase">
                          Spec Only
                        </span>
                      )}
                    </div>
                    <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                      {profile.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-zinc-100 pt-3.5 flex items-center justify-between dark:border-zinc-800">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                      View Profile Specification
                    </button>
                    {profile.active ? (
                      <a
                        href={profile.href}
                        className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
                      >
                        Manage &rarr;
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 dark:border-zinc-800 dark:hover:bg-zinc-850"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SPEC DRAWER SLIDE-OVER */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Drawer backdrop */}
          <div
            onClick={() => setSelectedProfile(null)}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs transition-opacity"
          ></div>

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-lg transform bg-white shadow-2xl dark:bg-zinc-900 transition-transform duration-300">
              <div className="flex h-full flex-col overflow-y-scroll py-6 px-6">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {selectedProfile.name}
                    </h3>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider mt-0.5">
                      {selectedProfile.active ? "Interactive Module" : "Developer Reference Specs"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="mt-6 flex-1 space-y-6">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</h4>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {selectedProfile.desc}
                    </p>
                  </div>

                  {/* Profile Rules */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Business Specifications</h4>
                    <ul className="mt-2 space-y-2">
                      {selectedProfile.rules.map((rule, index) => (
                        <li key={index} className="flex gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"></span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Profile Fields Table */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Database &amp; UI Fields</h4>
                    <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-500">
                          <tr>
                            <th className="px-4 py-2">Field Name</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Mandatory</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 bg-white text-xs dark:divide-zinc-800 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                          {selectedProfile.fields.map((field) => (
                            <tr key={field.name}>
                              <td className="px-4 py-2.5 font-semibold">{field.name}</td>
                              <td className="px-4 py-2.5 font-mono text-zinc-500 dark:text-zinc-400">{field.type}</td>
                              <td className="px-4 py-2.5">
                                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                  field.mand === "Yes" 
                                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" 
                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                }`}>
                                  {field.mand}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="mt-6 border-t border-zinc-100 pt-5 flex items-center justify-between dark:border-zinc-800">
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                  >
                    Close spec
                  </button>
                  {selectedProfile.active ? (
                    <a
                      href={selectedProfile.href}
                      onClick={() => setSelectedProfile(null)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-sm"
                    >
                      Open Master Admin
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">
                      Locked module - reference only
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
