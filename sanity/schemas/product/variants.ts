import { GenerateVariants } from '@/sanity/components/product/GenerateVariants';
import { defineField, defineArrayMember } from 'sanity';

export const variantsFields = [
  defineField({
    name: 'variants',
    title: 'Product Variants',
    type: 'array',
    readOnly: true,
    components: { input: GenerateVariants },
    of: [
      defineArrayMember({
        name: 'variant',
        title: 'Variant',
        type: 'object',
        fields: [
          defineField({
            name: 'variantName',
            title: 'Variant Name',
            type: 'string',
            readOnly: true,
          }),
          defineField({
            name: 'options',
            title: 'Options',
            type: 'array',
            readOnly: true,
            of: [
              defineArrayMember({
                type: 'object',
                fields: [
                  defineField({
                    name: 'name',
                    title: 'Option Name',
                    type: 'string',
                    readOnly: true,
                  }),
                  defineField({
                    name: 'value',
                    title: 'Option Value',
                    type: 'string',
                    readOnly: true,
                  }),
                ],
              }),
            ],
          }),
          defineField({
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0),
          }),
        ],
        preview: {
          select: {
            title: 'variantName',
            quantity: 'quantity',
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