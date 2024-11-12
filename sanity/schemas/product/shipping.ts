import { defineField } from 'sanity';

export const shippingFields = [
    defineField({
        name: 'shippingInfo',
        title: 'Shipping Information',
        type: 'object',
        fields: [
          defineField({
            name: 'weight',
            title: 'Weight (in grams)',
            type: 'number',
            validation: Rule => Rule.required().positive(),
            description: 'Product weight in grams'
          }),
          defineField({
            name: 'dimensions',
            title: 'Dimensions',
            type: 'object',
            fields: [
              defineField({
                name: 'length',
                title: 'Length (cm)',
                type: 'number',
                validation: Rule => Rule.required().positive()
              }),
              defineField({
                name: 'width',
                title: 'Width (cm)',
                type: 'number',
                validation: Rule => Rule.required().positive()
              }),
              defineField({
                name: 'height',
                title: 'Height (cm)',
                type: 'number',
                validation: Rule => Rule.required().positive()
              })
            ]
          }),
          defineField({
            name: 'requiresShipping',
            title: 'Requires Shipping',
            type: 'boolean',
            initialValue: true,
            description: 'Set to false for digital products or services'
          }),
          defineField({
            name: 'fragile',
            title: 'Fragile Item',
            type: 'boolean',
            initialValue: false,
            description: 'Requires special handling'
          }),
          defineField({
            name: 'shippingRestrictions',
            title: 'Shipping Restrictions',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
              list: [
                { title: 'Hazardous Materials', value: 'hazmat' },
                { title: 'No Air Shipping', value: 'noAir' },
                { title: 'Temperature Controlled', value: 'tempControl' },
                { title: 'No International', value: 'noInternational' }
              ]
            }
          }),
          defineField({
            name: 'customsInfo',
            title: 'Customs Information',
            type: 'object',
            description: 'Required for international shipping',
            fields: [
              defineField({
                name: 'hsCode',
                title: 'HS Code',
                type: 'string',
                description: 'Harmonized System Code for international shipping'
              }),
              defineField({
                name: 'countryOfOrigin',
                title: 'Country of Origin',
                type: 'string',
                description: 'Where the product was manufactured'
              }),
              defineField({
                name: 'customsValue',
                title: 'Customs Value',
                type: 'number',
                description: 'Value for customs declaration (if different from selling price)'
              })
            ]
          })
        ]
      })
];