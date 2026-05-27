import { NextResponse } from "next/server";
import { getFormData } from "@/app/dashboard/sales/sales-order/[id]/actions";

export async function GET() {
  try {
    const data = await getFormData();
    return NextResponse.json(data);
  } catch(e: any) {
    return NextResponse.json({error: e.message}, {status: 500});
  }
}
