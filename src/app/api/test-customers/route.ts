import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customerProfile.findMany({
    include: { contactPersons: true }
  });
  return NextResponse.json(customers);
}
