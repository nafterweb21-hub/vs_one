export interface Profile {
  slug: string;
  title: string;
  description: string;
  iconKey: string;
  isActive: boolean;
  href: string;
  roadmapPhase: string;
  complexity: "Low" | "Medium" | "High";
  mockFields: string[];
  mockRows: Record<string, string>[];
}

export const masterProfiles: Profile[] = [
  {
    slug: "company",
    title: "Company Profile",
    description: "Manage system companies, logos, and global flags.",
    iconKey: "company",
    isActive: true,
    href: "/dashboard/admin/master-profile/company",
    roadmapPhase: "Phase 1 - Fully Functional",
    complexity: "High",
    mockFields: ["Company Name", "ROC No", "GST Reg No", "Status"],
    mockRows: []
  },
  {
    slug: "employee",
    title: "Employee Profile",
    description: "Track employee details, work credentials, and assignments.",
    iconKey: "employee",
    isActive: false,
    href: "/dashboard/admin/master-profile/employee",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "High",
    mockFields: ["Employee ID", "Full Name", "Department", "Role", "Join Date"],
    mockRows: [
      { "Employee ID": "EMP-001", "Full Name": "Sarah Jenkins", "Department": "Engineering", "Role": "Production Supervisor", "Join Date": "2024-03-15" },
      { "Employee ID": "EMP-002", "Full Name": "David Chen", "Department": "Quality Assurance", "Role": "QC Inspector", "Join Date": "2024-05-10" },
      { "Employee ID": "EMP-003", "Full Name": "Meera Patel", "Department": "Operations", "Role": "CNC Machinist", "Join Date": "2025-01-20" }
    ]
  },
  {
    slug: "approval-level",
    title: "Approval Level Profile",
    description: "Configure system signature requirements and approval thresholds.",
    iconKey: "approval",
    isActive: false,
    href: "/dashboard/admin/master-profile/approval-level",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "Medium",
    mockFields: ["Level", "Authorized Roles", "Max Limit (SGD)", "Required Signatures"],
    mockRows: [
      { "Level": "L1 - Supervisor", "Authorized Roles": "Production Lead", "Max Limit (SGD)": "5,000", "Required Signatures": "1" },
      { "Level": "L2 - Manager", "Authorized Roles": "Plant Manager, Head QC", "Max Limit (SGD)": "50,000", "Required Signatures": "2" },
      { "Level": "L3 - Executive", "Authorized Roles": "Director, General Manager", "Max Limit (SGD)": "Unlimited", "Required Signatures": "3" }
    ]
  },
  {
    slug: "tax",
    title: "Tax Profile",
    description: "Manage global tax configurations, codes, and rates.",
    iconKey: "tax",
    isActive: false,
    href: "/dashboard/admin/master-profile/tax",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "Low",
    mockFields: ["Tax Code", "Tax Rate (%)", "Description", "Type"],
    mockRows: [
      { "Tax Code": "GST-9", "Tax Rate (%)": "9.0", "Description": "Singapore Standard GST", "Type": "Sales/Purchase" },
      { "Tax Code": "GST-ZR", "Tax Rate (%)": "0.0", "Description": "Zero-Rated Supplies", "Type": "Export" },
      { "Tax Code": "GST-TX-N", "Tax Rate (%)": "9.0", "Description": "GST on imports (Non-claimable)", "Type": "Purchase" }
    ]
  },
  {
    slug: "currency",
    title: "Currency Profile",
    description: "Configure system trade currencies and live base rates.",
    iconKey: "currency",
    isActive: false,
    href: "/dashboard/admin/master-profile/currency",
    roadmapPhase: "Phase 3 - Q1 2027",
    complexity: "Medium",
    mockFields: ["Code", "Currency Name", "Exchange Rate", "Symbol"],
    mockRows: [
      { "Code": "SGD", "Currency Name": "Singapore Dollar (Base)", "Exchange Rate": "1.0000", "Symbol": "S$" },
      { "Code": "USD", "Currency Name": "US Dollar", "Exchange Rate": "1.3450", "Symbol": "$" },
      { "Code": "EUR", "Currency Name": "Euro", "Exchange Rate": "1.4580", "Symbol": "€" }
    ]
  },
  {
    slug: "customer",
    title: "Customer Profile",
    description: "Manage active clients, billing parameters, and metrics.",
    iconKey: "customer",
    isActive: false,
    href: "/dashboard/admin/master-profile/customer",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "High",
    mockFields: ["Cust ID", "Company Name", "Contact Person", "Sales Rep", "Credit Term"],
    mockRows: [
      { "Cust ID": "CUST-801", "Company Name": "Apex Aerospace Corp", "Contact Person": "Michael Vance", "Sales Rep": "Johnathan Taylor", "Credit Term": "30 Days" },
      { "Cust ID": "CUST-802", "Company Name": "Starlight Engineering Ltd", "Contact Person": "Elena Rostova", "Sales Rep": "Johnathan Taylor", "Credit Term": "45 Days" }
    ]
  },
  {
    slug: "supplier",
    title: "Supplier Profile",
    description: "Manage supply vendors, active grades, and contact rules.",
    iconKey: "supplier",
    isActive: false,
    href: "/dashboard/admin/master-profile/supplier",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "High",
    mockFields: ["Supp ID", "Supplier Name", "Category", "Contact No", "Payment Term"],
    mockRows: [
      { "Supp ID": "SUPP-501", "Supplier Name": "Nippon Steel Supplies", "Category": "Raw Material", "Contact No": "+81 3 5555 0192", "Payment Term": "60 Days" },
      { "Supp ID": "SUPP-502", "Supplier Name": "Global Logistics Corp", "Category": "Services / Freight", "Contact No": "+65 6744 1200", "Payment Term": "30 Days" }
    ]
  },
  {
    slug: "uom",
    title: "UOM Profile",
    description: "Configure base and converted Units of Measure (UOM).",
    iconKey: "uom",
    isActive: false,
    href: "/dashboard/admin/master-profile/uom",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "Low",
    mockFields: ["UOM Code", "Description", "Base Unit", "Conversion Factor"],
    mockRows: [
      { "UOM Code": "PCS", "Description": "Pieces / Single Item", "Base Unit": "Yes", "Conversion Factor": "1.0" },
      { "UOM Code": "KG", "Description": "Kilogram", "Base Unit": "Yes", "Conversion Factor": "1.0" },
      { "UOM Code": "BOX-12", "Description": "Box containing 12 items", "Base Unit": "No", "Conversion Factor": "12.0" }
    ]
  },
  {
    slug: "payment-term",
    title: "Payment Term Profile",
    description: "Configure billing deadlines and discount thresholds.",
    iconKey: "payment",
    isActive: true,
    href: "/dashboard/admin/master-profile/payment-term",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "Low",
    mockFields: ["Code", "Net Days", "Discount (%)", "Description"],
    mockRows: [
      { "Code": "NET30", "Net Days": "30", "Discount (%)": "0.0", "Description": "Payment due in 30 days" },
      { "Code": "NET60", "Net Days": "60", "Discount (%)": "0.0", "Description": "Payment due in 60 days" },
      { "Code": "2/10 NET60", "Net Days": "60", "Discount (%)": "2.0", "Description": "2% discount if paid in 10 days" }
    ]
  },
  {
    slug: "material-category",
    title: "Material Category Profile",
    description: "Group inventory assets into logical structured categories.",
    iconKey: "category",
    isActive: false,
    href: "/dashboard/admin/master-profile/material-category",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "Medium",
    mockFields: ["Cat ID", "Category Name", "Description", "Parent Category"],
    mockRows: [
      { "Cat ID": "MC-01", "Category Name": "Structural Steel", "Description": "H-Beams, I-Beams, and Channels", "Parent Category": "None" },
      { "Cat ID": "MC-02", "Category Name": "Coated Sheets", "Description": "Galvanized sheet metals and panels", "Parent Category": "None" }
    ]
  },
  {
    slug: "material",
    title: "Material Profile",
    description: "Track industrial raw material records and dimensions.",
    iconKey: "material",
    isActive: false,
    href: "/dashboard/admin/master-profile/material",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "High",
    mockFields: ["Material Code", "Description", "Grade", "Stock UOM", "Unit Price (SGD)"],
    mockRows: [
      { "Material Code": "MAT-S355-001", "Description": "Structural Steel Plate 10mm", "Grade": "S355JR", "Stock UOM": "PCS", "Unit Price (SGD)": "145.00" },
      { "Material Code": "MAT-ALU-082", "Description": "Aluminium Flat Bar 50x5mm", "Grade": "Al-6061-T6", "Stock UOM": "PCS", "Unit Price (SGD)": "32.50" }
    ]
  },
  {
    slug: "finished-good",
    title: "Finished Good Profile",
    description: "Manage final assembly product models and blueprints.",
    iconKey: "finished-good",
    isActive: false,
    href: "/dashboard/admin/master-profile/finished-good",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "High",
    mockFields: ["Item Code", "Name/Model", "Type", "Assembly Drawing", "QC Status"],
    mockRows: [
      { "Item Code": "FG-WELD-A90", "Name/Model": "Main Truss Section A90", "Type": "Fabricated Assembly", "Assembly Drawing": "DWG-TRUSS-091A", "QC Status": "Pending FAI" },
      { "Item Code": "FG-CAB-C2", "Name/Model": "Control Cabinet Box C2", "Type": "Enclosure Assembly", "Assembly Drawing": "DWG-CAB-002", "QC Status": "Approved" }
    ]
  },
  {
    slug: "material-type",
    title: "Material Type Profile",
    description: "Define distinct material properties and storage codes.",
    iconKey: "material-type",
    isActive: false,
    href: "/dashboard/admin/master-profile/material-type",
    roadmapPhase: "Phase 3 - Q1 2027",
    complexity: "Low",
    mockFields: ["Type Code", "Name", "Properties", "Inspection Frequency"],
    mockRows: [
      { "Type Code": "MT-AL", "Name": "Aluminium Alloy", "Properties": "Lightweight, Corrosion Resistant", "Inspection Frequency": "100%" },
      { "Type Code": "MT-CS", "Name": "Carbon Steel", "Properties": "High Tensile, Heavy Weight", "Inspection Frequency": "Batch-level (10%)" }
    ]
  },
  {
    slug: "welding-type",
    title: "Welding Type Profile",
    description: "Manage system-certified welding procedures and parameters.",
    iconKey: "welding",
    isActive: false,
    href: "/dashboard/admin/master-profile/welding-type",
    roadmapPhase: "Phase 3 - Q2 2027",
    complexity: "Medium",
    mockFields: ["Method Code", "Name", "Process Type", "Gas Mixture"],
    mockRows: [
      { "Method Code": "GTAW", "Name": "Gas Tungsten Arc Welding (TIG)", "Process Type": "Manual", "Gas Mixture": "100% Argon" },
      { "Method Code": "GMAW", "Name": "Gas Metal Arc Welding (MIG)", "Process Type": "Semi-Automatic", "Gas Mixture": "80% Ar / 20% CO2" }
    ]
  },
  {
    slug: "joint",
    title: "Joint Profile",
    description: "Track mechanical and structural joint parameters.",
    iconKey: "joint",
    isActive: true,
    href: "/dashboard/admin/master-profile/joint",
    roadmapPhase: "Phase 3 - Q2 2027",
    complexity: "Low",
    mockFields: ["Joint Code", "Joint Type", "Preparation", "Material Compatibility"],
    mockRows: [
      { "Joint Code": "J-BUTT-V", "Joint Type": "Single-V Butt Joint", "Preparation": "Bevel 30 deg", "Material Compatibility": "All Weldable Metals" },
      { "Joint Code": "J-FILLET-D", "Joint Type": "Double Fillet Joint", "Preparation": "None (Flat Face)", "Material Compatibility": "Steel Alloys Only" }
    ]
  },
  {
    slug: "machine",
    title: "Machine Profile",
    description: "Track plant machines, active capacities, and calibrations.",
    iconKey: "machine",
    isActive: false,
    href: "/dashboard/admin/master-profile/machine",
    roadmapPhase: "Phase 2 - Q3 2026",
    complexity: "Medium",
    mockFields: ["Machine ID", "Name / Brand", "Capacity", "Calibration Due Date", "Operator Grade Required"],
    mockRows: [
      { "Machine ID": "MAC-L400", "Name / Brand": "Laser Cutter - Trumpf 4kW", "Capacity": "Up to 25mm Mild Steel", "Calibration Due Date": "2026-09-30", "Operator Grade Required": "Senior / Grade A" },
      { "Machine ID": "MAC-CNC-B2", "Name / Brand": "CNC Press Brake - Amada", "Capacity": "220 Tons / 3.0 Meters", "Calibration Due Date": "2026-07-15", "Operator Grade Required": "Standard / Grade B" }
    ]
  },
  {
    slug: "elcometer",
    title: "Elcometer Profile",
    description: "Configure Dry Film Thickness (DFT) gauges and certifications.",
    iconKey: "elcometer",
    isActive: false,
    href: "/dashboard/admin/master-profile/elcometer",
    roadmapPhase: "Phase 3 - Q2 2027",
    complexity: "Low",
    mockFields: ["Serial No", "Model", "Range", "Last Calibrated", "Status"],
    mockRows: [
      { "Serial No": "ELC-90212", "Model": "Elcometer 456 Dry Film Gauge", "Range": "0 - 1500 um", "Last Calibrated": "2026-02-15", "Status": "Calibrated" },
      { "Serial No": "ELC-90215", "Model": "Elcometer 311 Auto Gauge", "Range": "0 - 500 um", "Last Calibrated": "2025-11-10", "Status": "Calibration Expired" }
    ]
  },
  {
    slug: "main-process",
    title: "Main Process Profile",
    description: "Define industrial and assembly production operations.",
    iconKey: "process-main",
    isActive: false,
    href: "/dashboard/admin/master-profile/main-process",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "Medium",
    mockFields: ["Process Code", "Name", "Standard Lead Time (Hrs)", "Cost Center"],
    mockRows: [
      { "Process Code": "FAB", "Name": "Metal Fabrication", "Standard Lead Time (Hrs)": "4.5", "Cost Center": "CC-FAB-01" },
      { "Process Code": "WELD", "Name": "MIG/TIG Welding Setup", "Standard Lead Time (Hrs)": "2.0", "Cost Center": "CC-WELD-03" }
    ]
  },
  {
    slug: "painting-method",
    title: "Painting Method Profile",
    description: "Define wet/powder paint specifications and DFT targets.",
    iconKey: "painting",
    isActive: false,
    href: "/dashboard/admin/master-profile/painting-method",
    roadmapPhase: "Phase 3 - Q3 2027",
    complexity: "Low",
    mockFields: ["Method Code", "Paint Type", "Curing Temp (C)", "DFT Range (um)"],
    mockRows: [
      { "Method Code": "EPOXY-COAT", "Paint Type": "Two-Pack Polyamide Epoxy", "Curing Temp (C)": "Ambient", "DFT Range (um)": "80 - 120" },
      { "Method Code": "POWDER-GLOSS", "Paint Type": "Polyester High-Gloss Powder", "Curing Temp (C)": "180C Oven Cure", "DFT Range (um)": "60 - 80" }
    ]
  },
  {
    slug: "process",
    title: "Process Profile (Routing Process)",
    description: "Configure sequence routings for finished good items.",
    iconKey: "routing-process",
    isActive: false,
    href: "/dashboard/admin/master-profile/process",
    roadmapPhase: "Phase 2 - Q4 2026",
    complexity: "High",
    mockFields: ["Routing ID", "Description", "Sequence", "Operation Name"],
    mockRows: [
      { "Routing ID": "RT-092", "Description": "Main Beam Production Routing", "Sequence": "10", "Operation Name": "CNC Plate Cutting" },
      { "Routing ID": "RT-092", "Description": "Main Beam Production Routing", "Sequence": "20", "Operation Name": "Pre-Assembly Beveling" },
      { "Routing ID": "RT-092", "Description": "Main Beam Production Routing", "Sequence": "30", "Operation Name": "MIG Welding Assembly" }
    ]
  },
  {
    slug: "failure-mode",
    title: "Failure Mode Profile",
    description: "Define defect modes and corrective QA inspection controls.",
    iconKey: "failure",
    isActive: true,
    href: "/dashboard/admin/master-profile/failure-mode",
    roadmapPhase: "Phase 3 - Q1 2027",
    complexity: "Medium",
    mockFields: ["Code", "Failure Mode Name", "Detection Method", "Severity (1-10)"],
    mockRows: [
      { "Code": "FM-WELD-POR", "Failure Mode Name": "Weld Porosity / Gas Trapped", "Detection Method": "Visual / Radiography", "Severity (1-10)": "8" },
      { "Code": "FM-PNT-BLIST", "Failure Mode Name": "Surface Blistering / Poor Adhesion", "Detection Method": "Cross-Hatch Adhesion Test", "Severity (1-10)": "5" }
    ]
  }
];
