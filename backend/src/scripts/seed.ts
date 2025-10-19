import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION);
  const apiKeyModule = container.resolve(Modules.API_KEY);
  const productModule = container.resolve(Modules.PRODUCT);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // Check if region already exists
  logger.info("Checking for existing regions...");
  let regions = await regionModuleService.listRegions({
    name: "Europe",
  });

  let region;
  if (!regions.length) {
    logger.info("Seeding region data...");
    const { result: regionResult } = await createRegionsWorkflow(container).run(
      {
        input: {
          regions: [
            {
              name: "Europe",
              currency_code: "eur",
              countries,
              payment_providers: ["pp_system_default"],
            },
          ],
        },
      }
    );
    region = regionResult[0];
    logger.info("Finished seeding regions.");
  } else {
    region = regions[0];
    logger.info("Region already exists, skipping creation.");
  }

  logger.info("Seeding tax regions...");

  // Check existing tax regions before creating
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["country_code"],
  });
  const existingCountryCodes = new Set(
    existingTaxRegions.map((tr) => tr.country_code)
  );
  const countriesToCreate = countries.filter(
    (country) => !existingCountryCodes.has(country)
  );

  if (countriesToCreate.length > 0) {
    await createTaxRegionsWorkflow(container).run({
      input: countriesToCreate.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }
  logger.info("Finished seeding tax regions.");

  // Check if stock location exists
  logger.info("Checking for existing stock locations...");
  let stockLocations = await stockLocationModule.listStockLocations({
    name: "European Warehouse",
  });

  let stockLocation;
  if (!stockLocations.length) {
    logger.info("Seeding stock location data...");
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];
  } else {
    stockLocation = stockLocations[0];
    logger.info("Stock location already exists, skipping creation.");
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  // Try to create link, ignore if it already exists
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
    logger.info(
      "Created link between stock location and fulfillment provider."
    );
  } catch (error) {
    logger.info(
      "Link between stock location and fulfillment provider already exists."
    );
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Check if fulfillment set already exists
  let fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
    {
      name: "European Warehouse delivery",
    },
    {
      relations: ["service_zones", "service_zones.geo_zones"],
    }
  );

  let fulfillmentSet;
  let serviceZoneId;

  if (!fulfillmentSets.length) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: [
            {
              country_code: "gb",
              type: "country",
            },
            {
              country_code: "de",
              type: "country",
            },
            {
              country_code: "dk",
              type: "country",
            },
            {
              country_code: "se",
              type: "country",
            },
            {
              country_code: "fr",
              type: "country",
            },
            {
              country_code: "es",
              type: "country",
            },
            {
              country_code: "it",
              type: "country",
            },
          ],
        },
      ],
    });
    serviceZoneId = fulfillmentSet.service_zones[0].id;

    try {
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_set_id: fulfillmentSet.id,
        },
      });
      logger.info("Created link between stock location and fulfillment set.");
    } catch (error) {
      logger.info(
        "Link between stock location and fulfillment set already exists."
      );
    }
  } else {
    fulfillmentSet = fulfillmentSets[0];
    // Get the service zone id from the existing fulfillment set
    if (
      fulfillmentSet.service_zones &&
      fulfillmentSet.service_zones.length > 0
    ) {
      serviceZoneId = fulfillmentSet.service_zones[0].id;
    } else {
      // If no service zones, we need to fetch them separately
      const serviceZones = await fulfillmentModuleService.listServiceZones({
        fulfillment_set_id: [fulfillmentSet.id],
      });
      if (serviceZones.length > 0) {
        serviceZoneId = serviceZones[0].id;
      } else {
        throw new Error("No service zones found for the fulfillment set");
      }
    }
  }

  // Check if shipping options already exist
  const existingShippingOptions =
    await fulfillmentModuleService.listShippingOptions({
      service_zone_id: serviceZoneId,
    });

  if (!existingShippingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "eur",
              amount: 10,
            },
            {
              region_id: region.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ship in 24 hours.",
            code: "express",
          },
          prices: [
            {
              currency_code: "eur",
              amount: 10,
            },
            {
              region_id: region.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
  }
  logger.info("Finished seeding fulfillment data.");

  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel[0].id],
      },
    });
  } catch (error) {
    logger.info("Sales channel already linked to stock location.");
  }
  logger.info("Finished seeding stock location data.");

  // Check if API key already exists
  logger.info("Checking for existing API keys...");
  let apiKeys = await apiKeyModule.listApiKeys({
    title: "Webshop",
  });

  let publishableApiKey;
  if (!apiKeys.length) {
    logger.info("Seeding publishable API key data...");
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      container
    ).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    publishableApiKey = publishableApiKeyResult[0];

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    });
  } else {
    publishableApiKey = apiKeys[0];
    logger.info("API key already exists, skipping creation.");
  }
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  // List of all demo products
  const productsToSeed = [
    {
      title: "Paloma Haven",
      handle: "sofa",
      subtitle: "Modern Luxe",
      description:
        "Minimalistic designs, neutral colors, and high-quality textures. Perfect for those who seek comfort with a clean and understated aesthetic. This collection brings the essence of Scandinavian elegance to your living room.",
      category_name: "Sofas",
      weight: 45000,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "http://localhost:9000/static/1760083945072-6620ea897d26d568997efa34abc517d9177df473.jpg",
        },
        { url: "http://localhost:9000/static/1760444726575-image.jpeg" },
      ],
      options: [
        { title: "Materials", values: ["Linen"] },
        { title: "Colors", values: ["Dark Gray", "Black", "Light Gray"] },
      ],
      variants: [
        {
          title: "Linen / Dark Gray",
          sku: "sku-11",
          options: { Materials: "Linen", Colors: "Dark Gray" },
          prices: [{ amount: 12000, currency_code: "eur" }],
        },
        {
          title: "Linen / Black",
          sku: "sku-12",
          options: { Materials: "Linen", Colors: "Black" },
          prices: [{ amount: 12000, currency_code: "eur" }],
        },
        {
          title: "Linen / Light Gray",
          sku: "sku-13",
          options: { Materials: "Linen", Colors: "Light Gray" },
          prices: [{ amount: 12000, currency_code: "eur" }],
        },
      ],
    },
    {
      title: "Camden Retreat",
      handle: "camden-retreat",
      subtitle: "Boho Chic",
      description:
        "Minimalistic designs, neutral colors, and high-quality textures. Perfect for those who seek comfort with a clean and understated aesthetic.",
      category_name: "Sofas",
      weight: 40000,
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "http://localhost:9000/static/1760339378573-image.jpeg" },
      ],
      options: [
        { title: "Colors", values: ["Green"] },
        { title: "Materials", values: ["Linen"] },
      ],
      variants: [
        {
          title: "Green / Linen",
          sku: "sku-21",
          options: { Colors: "Green", Materials: "Linen" },
          prices: [{ amount: 1000, currency_code: "eur" }],
        },
      ],
    },
    {
      title: "Oslo Drift",
      handle: "oslo-drift",
      subtitle: "Scandinavian Simplicity",
      description:
        "Experience the essence of Nordic design with clean lines and functional beauty.",
      category_name: "Sofas",
      weight: 42000,
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "http://localhost:9000/static/1760376644156-image(1).jpeg" },
      ],
      options: [
        { title: "Colors", values: ["White"] },
        { title: "Materials", values: ["Linen"] },
      ],
      variants: [
        {
          title: "White / Linen",
          sku: "sku-31",
          options: { Colors: "White", Materials: "Linen" },
          prices: [{ amount: 3000, currency_code: "eur" }],
        },
      ],
    },
    {
      title: "Sutton Royale",
      handle: "sutton-royale",
      subtitle: "Modern Luxe",
      description:
        "Indulge in luxury with this premium sofa that combines comfort with sophisticated style.",
      category_name: "Sofas",
      weight: 48000,
      status: ProductStatus.PUBLISHED,
      images: [
        { url: "http://localhost:9000/static/1760376796844-image.jpeg" },
      ],
      options: [
        { title: "Colors", values: ["Purple"] },
        { title: "Materials", values: ["Linen"] },
      ],
      variants: [
        {
          title: "Purple / Linen",
          sku: "sku-41",
          options: { Colors: "Purple", Materials: "Linen" },
          prices: [{ amount: 2500, currency_code: "eur" }],
        },
      ],
    },
  ];

  // Get existing product handles
  const existingProducts = await productModule.listProducts({
    handle: productsToSeed.map((p) => p.handle),
  });
  const existingHandles = new Set(existingProducts.map((p) => p.handle));

  // Filter out the missing products
  const productsToCreate = productsToSeed.filter(
    (p) => !existingHandles.has(p.handle)
  );

  if (productsToCreate.length > 0) {
    logger.info(`Creating ${productsToCreate.length} missing products...`);

    // Get existing categories
    const { data: existingCategories } = await query.graph({
      entity: "product_category",
      fields: ["id", "name"],
    });
    const existingCategoryNames = new Set(
      existingCategories.map((cat) => cat.name)
    );

    // Create the missing categories
    const categoriesToCreate = Array.from(
      new Set(productsToCreate.map((p) => p.category_name))
    )
      .filter((name) => !existingCategoryNames.has(name))
      .map((name) => ({ name, is_active: true }));

    let categoryResult: any[] = existingCategories;

    if (categoriesToCreate.length > 0) {
      const { result: createdCategories } =
        await createProductCategoriesWorkflow(container).run({
          input: { product_categories: categoriesToCreate },
        });
      categoryResult = categoryResult.concat(createdCategories);
    }

    // Mapping category name to id
    const categoryMap = new Map(
      categoryResult.map((cat) => [cat.name, cat.id])
    );

    // Create missing products
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate.map((p) => ({
          ...p,
          category_ids: [categoryMap.get(p.category_name)!],
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        })),
      },
    });

    logger.info("Finished creating missing products.");
  } else {
    logger.info("All products already exist, skipping creation.");
  }

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  if (inventoryItems.length > 0) {
    const inventoryLevels: CreateInventoryLevelInput[] = [];
    for (const inventoryItem of inventoryItems) {
      const inventoryLevel = {
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: inventoryItem.id,
      };
      inventoryLevels.push(inventoryLevel);
    }

    try {
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: inventoryLevels,
        },
      });
      logger.info("Created inventory levels.");
    } catch (error) {
      logger.info("Inventory levels may already exist, skipping.");
    }
  }

  logger.info("Finished seeding inventory levels data.");
}