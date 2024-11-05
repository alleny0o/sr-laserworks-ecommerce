import { defineField } from "sanity";

export const generalFields = [
    defineField({
        name: 'name',
        title: 'Product Name',
        type: 'string',
        validation: Rule => Rule.required()
      }),
      defineField({
        name: 'description',
        title: 'Description (optional)',
        type: 'blockContent',
      }),
]