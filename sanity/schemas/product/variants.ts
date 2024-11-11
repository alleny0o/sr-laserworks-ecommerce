import { GenerateVariants } from '@/sanity/components/product/GenerateVariants';
import { MediaReferenceInput } from '@/sanity/components/product/MediaReferenceInput';
import { defineField, defineArrayMember } from 'sanity';

export const variantsFields = [
  defineField({
    name: 'variants',
    title: 'Product Variants',
    type: 'array',
    components: { 
        input: GenerateVariants,
    },
    of: [
      defineArrayMember({
        name: 'variant',
        title: 'Variant',
        type: 'object',
        fields: [
          defineField({
            name: 'variantName',
            title: 'Variant',
            type: 'string',
            readOnly: true,
          }),
          defineField({
            name: 'options',
            title: 'Options',
            type: 'array',
            of: [
              defineArrayMember({
                name: 'option',
                title: 'Option',
                type: 'object',
                fields: [
                  defineField({
                    name: 'name',
                    title: 'Name',
                    type: 'string',
                    readOnly: true,
                  }),
                  defineField({
                    name: 'value',
                    title: 'Value',
                    type: 'string',
                    readOnly: true,
                  }),
                ],
              }),
            ],
          }),
          defineField({
            name: 'variantProductName',
            title: 'Variant Name',
            type: 'string',
            readOnly: false,
          }),
          defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
            readOnly: false,
          }),
          defineField({
            name: 'variantDescription',
            title: 'Description',
            type: 'blockContent',
            readOnly: false,
          }),
          defineField({
            name: 'variantPrice',
            title: 'Price',
            type: 'number',
            validation: Rule => Rule.required(),
            readOnly: false,
          }),
          defineField({
            name: 'variantCompareAtPrice',
            title: 'Compare-At-Price',
            type: 'number',
            validation: Rule => Rule.min(0),
            readOnly: false,
          }),
          defineField({
            name: 'variantQuantity',
            title: 'Quantity',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0),
            readOnly: false,
          }),
          defineField({
            name: 'mediaAssociate',
            title: 'Media Associate',
            type: 'string',
            components: {
                input: MediaReferenceInput,
            }
          }),
        ],
        preview: {
          select: {
            title: 'variantName',
            quantity: 'variantQuantity',
          },
          prepare({ title, quantity }) {
            return {
              title,
              subtitle: `Quantity: ${quantity}`,
            };
          },
        },
      }),
    ],
  }),
];