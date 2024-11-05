import { defineField } from "sanity";

export const pricingFields = [
  defineField({
    name: 'price',
    title: 'Price',
    type: 'number',
    validation: Rule => Rule.required().positive()
  }),
  defineField({
    name: 'compareAtPrice',
    title: 'Compare-At-Price (optional)',
    type: 'number',
    validation: Rule => [
      Rule.positive().error('Must be a positive number'),
      Rule.custom((compareAtPrice, context) => {
        const price = context.document?.price;
        if (compareAtPrice === undefined || compareAtPrice === null) {
          return true;
        }
        if (!price) {
          return true;
        }
        return typeof price === 'number' && compareAtPrice > price 
          ? true 
          : 'Must be greater than price';
      })
    ]
  }),
];