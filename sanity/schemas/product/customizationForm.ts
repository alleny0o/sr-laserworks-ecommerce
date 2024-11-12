import { defineField } from "sanity";

export const formFields = [
  defineField({
    name: 'formCustomization',
    title: 'Product Customization Form',
    type: 'object',
    fields: [
      defineField({
        name: 'enabled',
        title: 'Enable Custom Form',
        type: 'boolean',
        initialValue: false
      }),
      defineField({
        name: 'showForm',
        title: 'Show Customization Form',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'title',
        title: 'Form Title',
        type: 'string',
        validation: Rule => Rule.required() 
      }),

      defineField({
        name: 'fields',
        title: 'Form Fields',
        type: 'array',
        of: [
          // Input field type
          {
            type: 'object',
            name: 'input',
            title: 'Input Field',
            fields: [
              defineField({
                name: 'label',
                title: 'Label',
                type: 'string',
                validation: Rule => Rule.required()
              }),
              defineField({
                name: 'subDescription',
                title: 'Sub-Description',
                type: 'string'
              }),
              defineField({
                name: 'isRequired',
                title: 'Required Field',
                type: 'boolean',
                initialValue: false
              }),
              defineField({
                name: 'placeholder',
                title: 'Placeholder Text',
                type: 'string'
              }),
              defineField({
                name: 'validation',
                title: 'Character Limits',
                type: 'object',
                fields: [
                  defineField({
                    name: 'minCharacters',
                    title: 'Minimum Characters',
                    type: 'number'
                  }),
                  defineField({
                    name: 'maxCharacters',
                    title: 'Maximum Characters',
                    type: 'number'
                  })
                ]
              })
            ],
            preview: {
              select: {
                title: 'label',
                required: 'isRequired'
              },
              prepare({ title, required }) {
                return {
                  title,
                  subtitle: `Input Field${required ? ' (Required)' : ''}`
                };
              }
            }
          },
          // Textarea field type
          {
            type: 'object',
            name: 'textarea',
            title: 'TextArea Field',
            fields: [
              defineField({
                name: 'label',
                title: 'Label',
                type: 'string',
                validation: Rule => Rule.required()
              }),
              defineField({
                name: 'subDescription',
                title: 'Sub-Description',
                type: 'string'
              }),
              defineField({
                name: 'isRequired',
                title: 'Required Field',
                type: 'boolean',
                initialValue: false
              }),
              defineField({
                name: 'placeholder',
                title: 'Placeholder Text',
                type: 'string'
              }),
              defineField({
                name: 'validation',
                title: 'Character Limits',
                type: 'object',
                fields: [
                  defineField({
                    name: 'minCharacters',
                    title: 'Minimum Characters',
                    type: 'number'
                  }),
                  defineField({
                    name: 'maxCharacters',
                    title: 'Maximum Characters',
                    type: 'number'
                  })
                ]
              })
            ],
            preview: {
              select: {
                title: 'label',
                required: 'isRequired'
              },
              prepare({ title, required }) {
                return {
                  title,
                  subtitle: `TextArea Field${required ? ' (Required)' : ''}`
                };
              }
            }
          },
          // Image upload field type
          {
            type: 'object',
            name: 'imageUpload',
            title: 'Image Upload',
            fields: [
              defineField({
                name: 'label',
                title: 'Label',
                type: 'string',
                validation: Rule => Rule.required()
              }),
              defineField({
                name: 'subDescription',
                title: 'Sub-Description',
                type: 'string'
              }),
              defineField({
                name: 'isRequired',
                title: 'Required Field',
                type: 'boolean',
                initialValue: false
              })
            ],
            preview: {
              select: {
                title: 'label',
                required: 'isRequired'
              },
              prepare({ title, required }) {
                return {
                  title,
                  subtitle: `Image Upload${required ? ' (Required)' : ''}`
                };
              }
            }
          }
        ]
      })
    ]
  })
];