import { getFormData } from "../src/app/dashboard/sales/sales-order/[id]/actions";

async function main() {
  try {
    const data = await getFormData();
    console.log("Success, found prerequisites");
  } catch (error) {
    console.error(error);
  }
}

main();
