import { defineType, defineField } from "sanity";
import { TrolleyIcon, ImagesIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TrolleyIcon,
  preview: {
    select: {
      title: 'name',
      media: 'mediaGroups.0.mediaItems.0',
      mediaType: 'mediaGroups.0.mediaItems.0._type'
    },
    prepare(selection) {
      const { title, media } = selection;
      
      return {
        title,
        media,
      }
    }
  },
  fields: [




    // GENERAL STUFF
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




    // PRICING STUFF
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
    
          // Allow empty values
          if (compareAtPrice === undefined || compareAtPrice === null) {
            return true;
          }
    
          // If no regular price, skip validation
          if (!price) {
            return true;
          }
    
          // If the compare-at-price is not greater than the price, return an error message
          return typeof price === 'number' && compareAtPrice > price 
            ? true 
            : 'Must be greater than price';
        })
      ]
    }),




    // MEDIA STUFF
    defineField({
      name: 'mediaGroups',
      title: 'Media Groups',
      type: 'array',
      validation: Rule => [
        Rule.required(),
        Rule.min(1).error('A minimum of ONE Media Group is required.'),
        Rule.max(20).error('You have reached the cap of 20 media groups.'),
      ],
      of: [{
        type: 'object',
        title: 'Media Group',
        icon: ImagesIcon,
        preview: {
          select: {
            mediaItems: 'mediaItems', 
          },
          prepare(selection) {
            const { mediaItems } = selection;
            const media = mediaItems && mediaItems.length > 0 ? mediaItems[0] : ImagesIcon;

            return {
              title: `Media group with ${selection.mediaItems?.length || 0} item${selection.mediaItems?.length === 1 ? '' : 's'}`,
              media: media,
            }
          }
        },
        fields: [{
          name: 'mediaItems',
          title: 'Media Items',
          type: 'array',
          options: {
            layout: 'grid'
          },
          validation: Rule => [
            Rule.required(),
            Rule.min(1).error('A minimum of ONE Media Item is required.'),
            Rule.max(20).error('You have reached the cap of 20 Media Items.'),
            Rule.custom((mediaItems) => {
              // Ensure mediaItems is an array
              if (!Array.isArray(mediaItems)) return true;
            
              const firstMedia = mediaItems[0];
              
              // Context parameter allows checking the field during reordering
              if (firstMedia?._type === 'video') {
                return 'The first media item cannot be a video. Please select an image first.';
              }
            
              return true;
            })
          ],
          of: [
            {
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  validation: Rule => Rule.required()
                }
              ]
            },
            {
              type: 'mux.video',
              title: 'Video',
              name: 'video',
            },
          ],
        }],
      }],
    }),




    // OPTIONS STUFF
    defineField({
      name: 'options',
      title: 'Add Options',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Option',
          fields: [
            {
              name: 'name',
              title: 'Option Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'values',
              title: 'Option Values',
              type: 'array',
              of: [
                {
                  type: 'string',
                  title: 'Value',
                }
              ],
              validation: Rule => [
                Rule.required(),
                Rule.min(1).error('A minimum of ONE option value is required.'),
                Rule.max(30).error('You have reached the cap of 30 values.'),
              ]
            }
          ]
        }
      ]
    }),
  ],
});