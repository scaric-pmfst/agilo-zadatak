import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
    baseUrl: process.env.PUBLIC_MEDUSA_URL || "http://localhost:9000"
})

export default medusa;