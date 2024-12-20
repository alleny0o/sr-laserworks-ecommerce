import { defineField } from "sanity";

export const generalFields = [
  defineField({
    name: "name",
    title: "Product Name",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: {
      source: "name",
      maxLength: 96,
      isUnique: () => true,
    },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "sku",
    title: "SKU",
    type: "string",
    validation: (Rule) => [
      Rule.required(),
      Rule.max(16).error("SKU must be at maximum 16 characters"),
      Rule.regex(/^[a-zA-Z0-9-]*$/).error(
        "SKU can only contain letters, numbers, and hyphens"
      ),
      Rule.custom(async (sku, context) => {
        if (!sku || typeof sku !== "string") return true;
  
        try {
          // Log validation attempt
          console.log('Validating SKU:', sku);
          console.log('Current document ID:', context.document?._id);
  
          const result = await context
            .getClient({ apiVersion: "2021-06-07" })
            .fetch(
              `
              {
                "otherProductsCount": count(*[
                  _type == "product" && 
                  _id != $currentId && 
                  (sku == $sku || defined(variants) && $sku in variants[].sku)
                ]),
                "variantsWithSameSku": count(*[
                  _type == "product" && 
                  _id == $currentId
                ][0].variants[defined(sku) && sku == $sku]),
                "debug": {
                  "currentProduct": *[_type == "product" && _id == $currentId][0],
                  "productsWithSku": *[
                    _type == "product" && 
                    (sku == $sku || defined(variants) && $sku in variants[].sku)
                  ]{_id, title, sku, variants}
                }
              }`,
              {
                sku,
                currentId: context.document?._id,
              }
            );
  
          // Log results
          console.log('Validation results:', {
            otherProductsCount: result.otherProductsCount,
            variantsWithSameSku: result.variantsWithSameSku,
            debug: result.debug
          });
  
          // If either count is greater than 0, the SKU is in use
          if (result.otherProductsCount > 0 || result.variantsWithSameSku > 0) {
            console.log('SKU validation failed:', {
              reason: result.otherProductsCount > 0 ? 'Found in other products' : 'Found in current product variants'
            });
            return 'This SKU is already in use';
          }
  
          return true;
        } catch (error) {
          console.error('SKU validation error:', error);
          return 'Error validating SKU uniqueness';
        }
      }),
    ],
  }),
  defineField({
    name: "categories",
    title: "Categories",
    type: "array",
    of: [{ type: "reference", to: [{ type: "category" }] }],
  }),
  defineField({
    name: "description",
    title: "Description (optional)",
    type: "blockContent",
  }),
  defineField({
    name: "stock",
    title: "Stock",
    type: "number",
    validation: (Rule) => Rule.required().positive().integer(),
  }),
  defineField({
    name: "maxOrderQuantity",
    title: "Max Order Quantity",
    type: "number",
    validation: (Rule) => Rule.required().positive().integer(),
  }),
];
