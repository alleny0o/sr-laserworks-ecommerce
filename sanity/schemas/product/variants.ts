import { GenerateVariants } from "@/sanity/components/product/GenerateVariants";
import { MediaReferenceInput } from "@/sanity/components/product/MediaReferenceInput";
import { defineField, defineArrayMember } from "sanity";
import { VscCombine } from "react-icons/vsc";
import { GrSettingsOption } from "react-icons/gr";

interface Variant {
  variantPrice?: number;
  variantCompareAtPrice?: number;
  // ... other variant fields
}


export const variantsFields = [
  defineField({
    name: "variants",
    title: "Product Variants",
    type: "array",
    components: {
      input: GenerateVariants,
    },
    of: [
      defineArrayMember({
        name: "variant",
        title: "Variant",
        type: "object",
        fields: [
          defineField({
            name: "variantName",
            title: "Variant",
            type: "string",
            readOnly: true,
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "options",
            title: "Options",
            type: "array",
            readOnly: true,
            of: [
              defineArrayMember({
                name: "option",
                title: "Option",
                type: "object",
                fields: [
                  defineField({
                    name: "name",
                    title: "Name",
                    type: "string",
                    readOnly: true,
                  }),
                  defineField({
                    name: "value",
                    title: "Value",
                    type: "string",
                    readOnly: true,
                  }),
                ],
                preview: {
                  select: {
                    name: "name",
                    value: "value",
                  },
                  prepare({ name, value }) {
                    return {
                      title: `Option: ${name}`,
                      subtitle: `Option Value: ${value}`,
                      media: GrSettingsOption, // You can change this to any icon you prefer
                    };
                  },
                },
              }),
            ],
          }),
          defineField({
            name: "variantProductName",
            title: "Variant Name",
            type: "string",
            readOnly: false,
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

                const variants = (context.document?.variants ?? []) as Array<{
                  _key: string;
                  sku?: string;
                }>;

                const skuCount = variants.filter((v) => v.sku === sku).length;

                const result = await context
                  .getClient({ apiVersion: "2021-06-07" })
                  .fetch(
                    `{
                            "otherProductsCount": count(*[
                                _type == "product" && 
                                _id != $currentId && 
                                (sku == $sku || defined(variants) && $sku in variants[].sku)
                            ]),
                            "currentProductSku": *[_type == "product" && _id == $currentId][0].sku
                        }`,
                    {
                      sku,
                      currentId: context.document?._id,
                    }
                  );

                const hasDuplicate =
                  result.otherProductsCount > 0 ||
                  result.currentProductSku === sku ||
                  skuCount > 1;

                return !hasDuplicate || "This SKU is already in use";
              }),
            ],
          }),
          defineField({
            name: "variantDescription",
            title: "Description",
            type: "blockContent",
            readOnly: false,
          }),
          defineField({
            name: "variantPrice",
            title: "Price",
            type: "number",
            validation: (Rule) => Rule.required().positive(),
            readOnly: false,
          }),
          defineField({
            name: "variantCompareAtPrice",
            title: "Compare-At-Price",
            type: "number",
            validation: Rule => [
              Rule.positive().error('Must be a positive number'),
              Rule.custom((compareAtPrice, context) => {
                const parent = context.parent as Variant;
                const price = parent?.variantPrice;
                if (compareAtPrice === undefined || compareAtPrice === null) return true;
                if (!price) return true;
                return typeof price === 'number' && compareAtPrice > price 
                  ? true 
                  : 'Must be greater than price';
              })
            ],
            readOnly: false,
          }),
          defineField({
            name: "variantStock",
            title: "Stock",
            type: "number",
            validation: (Rule) => Rule.min(0).required().integer(),
          }),
          defineField({
            name: "variantMaxOrderQuantity",
            title: "Max Order Quantity",
            type: "number",
            initialValue: 0,
            validation: (Rule) => Rule.min(0).required().integer(),
            readOnly: false,
          }),
          defineField({
            name: "mediaAssociate",
            title: "Media Association (optional)",
            type: "string",
            components: {
              input: MediaReferenceInput,
            },
          }),
          defineField({
            name: "showForm",
            title: "Show Customization Form",
            type: "boolean",
            initialValue: false,
          }),
          defineField({
            name: "variantShippingInfo",
            title: "Variant-Specific Shipping Info",
            description: "Only fill if different from main product",
            type: "object",
            fields: [
              defineField({
                name: "weight",
                title: "Weight (in grams)",
                type: "number",
                validation: Rule => Rule.positive(),
                description: "Only if different from main product"
              }),
              defineField({
                name: "dimensions",
                title: "Dimensions",
                type: "object",
                fields: [
                  defineField({
                    name: "length",
                    title: "Length (cm)",
                    type: "number",
                    validation: Rule => Rule.positive()
                  }),
                  defineField({
                    name: "width",
                    title: "Width (cm)",
                    type: "number",
                    validation: Rule => Rule.positive()
                  }),
                  defineField({
                    name: "height",
                    title: "Height (cm)",
                    type: "number",
                    validation: Rule => Rule.positive()
                  }),
                ]
              }),
            ]
          }),
        ],
        preview: {
          select: {
            title: "variantName",
            stock: "variantStock",
          },
          prepare({ title, stock }) {
            return {
              title,
              subtitle: `Stock: ${stock}`,
              media: VscCombine,
            };
          },
        },
      }),
    ],
  }),
];
