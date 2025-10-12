import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
    baseUrl: process.env.PUBLIC_MEDUSA_URL || "http://localhost:9000",
    publishableKey: process.env.MEDUSA_API_KEY,
})

export default medusa;