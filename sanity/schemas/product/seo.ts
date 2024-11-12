import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: 'seo',
    title: 'Search Engine Listing Preview',
    description: 'Search engines show a preview of your page in search results.',
    type: 'object',
    fields: [
      defineField({
        name: 'title',
        title: 'Page Title',
        type: 'string',
        description: 'The title shown in search engine results and browser tabs. Defaults to product title if empty.',
        validation: Rule => Rule.max(70).warning('Should be under 70 characters for optimal display in search results')
      }),
      defineField({
        name: 'description',
        title: 'Meta Description',
        type: 'text',
        rows: 3,
        description: 'A brief summary of the page content. Defaults to product description if empty.',
        validation: Rule => Rule.max(160).warning('Should be under 160 characters for optimal display in search results')
      })
    ]
  })
];