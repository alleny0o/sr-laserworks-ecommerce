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
    defineField({
      name: 'mediaGroups',
      title: 'Media Groups',
      type: 'array',
      validation: Rule => [
        Rule.required().min(1).error('A minimum of ONE Media Group is required.'),
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
            Rule.required().min(1).error('A minimum of ONE Media Item is required.'),
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
            }
          ]
        }]
      }]
    })
  ]
});