import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | string) {
  if (!d) return "—";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${dt.getFullYear()}`;
}

export default async function PrintCocPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const coc = await prisma.certificateOfConformity.findUnique({
    where: { id },
    include: {
      customer: { include: { addresses: true } },
      deliveryOrder: true,
      workOrder: true,
      cocUom: true,
      approvedBy: true,
      checkedBy: true,
    },
  });
  if (!coc) notFound();

  const company = await prisma.companyProfile.findFirst({ where: { status: "Active" } });
  
  const footerLine = company
    ? `${company.address} (Co. reg. No.: ${company.rocNo || ""}) Telephone: ${company.phoneNo} / Fax: ${company.faxNo}`
    : "";

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; padding: 0; background: #fff; color: #111; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .page { width: 210mm; min-height: 297mm; padding: 20mm; box-sizing: border-box; position: relative; }
        .row { display: flex; justify-content: space-between; align-items: flex-start; }
        .brand { color: #1e3a8a; font-weight: 700; font-size: 26px; letter-spacing: 0.5px; text-align: left; }
        .brand small { display: block; color: #64748b; font-size: 11px; font-weight: 400; }
        h1.title { text-align: center; font-size: 22px; margin: 20mm 0; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; display: inline-block; }
        .content { margin-top: 10mm; }
        table.kv { width: 100%; border-collapse: collapse; margin-bottom: 20mm; }
        table.kv td { padding: 12px 10px; font-size: 13px; border: 1px solid #e2e8f0; }
        table.kv td.label { color: #334155; font-weight: 600; width: 35%; background: #f8fafc; }
        table.kv td.value { color: #0f172a; width: 65%; }
        .footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; font-size: 10px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        
        .signatures { display: flex; justify-content: space-between; margin-top: 30mm; }
        .signature-box { width: 40%; text-align: center; }
        .signature-line { border-bottom: 1px solid #111; height: 30px; margin-bottom: 5px; }
        .signature-name { font-size: 12px; font-weight: 600; color: #1e293b; }
        .signature-title { font-size: 11px; color: #475569; }

        @media screen {
          body { background: #f1f1f1; }
          .page { box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px auto; background: #fff; }
          .print-actions { position: fixed; top: 12px; right: 12px; z-index: 100; }
          .print-actions button { padding: 10px 16px; font-size: 14px; font-weight: 600; background: #1e3a8a; color: #fff; border: 0; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .print-actions button:hover { background: #1e40af; }
        }
        @media print { .print-actions { display: none; } }
      `}</style>

      <PrintButton />

      <div className="page">
        <div className="row">
          <div className="brand">VISION<small>your engineering solutions</small></div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
            <div>COC No: <b>{coc.cocNo}</b></div>
            <div>Date: {fmtDate(coc.date)}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 className="title">CERTIFICATE OF CONFORMITY</h1>
        </div>

        <div className="content">
          <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8mm' }}>
            This is to certify that the products detailed below have been inspected and tested in accordance with the conditions and requirements of the contract or purchase order, and unless otherwise noted below, conform in all respects to the specifications.
          </p>

          <table className="kv">
            <tbody>
              <tr>
                <td className="label">Customer Name</td>
                <td className="value">{coc.customer?.customerName || "—"}</td>
              </tr>
              <tr>
                <td className="label">Delivery Order No.</td>
                <td className="value">{coc.deliveryOrder?.doNo || "—"}</td>
              </tr>
              <tr>
                <td className="label">Work Order No.</td>
                <td className="value">{coc.workOrderNo || "—"}</td>
              </tr>
              {coc.drawingNo && (
                <tr>
                  <td className="label">Drawing No.</td>
                  <td className="value">{coc.drawingNo}</td>
                </tr>
              )}
              <tr>
                <td className="label">Quantity</td>
                <td className="value">{coc.cocQuantity?.toString()} {coc.cocUom?.uomName || ""}</td>
              </tr>
              <tr>
                <td className="label">Type of Inspection</td>
                <td className="value">{coc.type}</td>
              </tr>
            </tbody>
          </table>

          <div className="signatures">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div className="signature-name">{coc.checkedBy?.name || "QC Inspector"}</div>
              <div className="signature-title">Prepared By / Date</div>
            </div>
            <div className="signature-box">
              <div className="signature-line"></div>
              <div className="signature-name">{coc.approvedBy?.name || "QC Manager"}</div>
              <div className="signature-title">Approved By / Date</div>
            </div>
          </div>
        </div>

        <div className="footer">{footerLine}</div>
      </div>
    </>
  );
}
