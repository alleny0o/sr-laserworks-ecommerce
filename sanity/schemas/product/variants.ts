import { GenerateVariants } from "@/sanity/components/product/GenerateVariants";
import { MediaReferenceInput } from "@/sanity/components/product/MediaReferenceInput";
import { defineField, defineArrayMember } from "sanity";
import { VscCombine } from "react-icons/vsc";
import { GrSettingsOption } from "react-icons/gr";

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
            validation: Rule => Rule.required(),
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
        
                    // First check current document's variants for duplicates
                    const variants: { sku: string }[] = context.document?.variants || [];
                    const skuCount = variants.filter(v => v.sku === sku).length;
        
                    // Then check other products
                    const result = await context.getClient({ apiVersion: "2021-06-07" }).fetch(
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
                            currentId: context.document?._id
                        }
                    );
        
                    console.log({
                        validating_sku: sku,
                        sku_count_in_current_doc: skuCount,
                        other_products: result.otherProductsCount,
                        current_product_sku: result.currentProductSku,
                        all_skus: variants.map(v => v.sku)
                    });
        
                    const hasDuplicate = 
                        result.otherProductsCount > 0 ||
                        result.currentProductSku === sku ||
                        skuCount > 1;
        
                    console.log('Has duplicate:', hasDuplicate);
        
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
            validation: (Rule) => Rule.required(),
            readOnly: false,
          }),
          defineField({
            name: "variantCompareAtPrice",
            title: "Compare-At-Price",
            type: "number",
            validation: (Rule) => Rule.min(0),
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
            validation: (Rule) => Rule.min(0),
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
