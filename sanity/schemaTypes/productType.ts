import { defineType, defineField } from "sanity";
import { TrolleyIcon, ImagesIcon } from "@sanity/icons";

// Define our display format types
const OPTION_DISPLAY = {
  DROPDOWN: 'dropdown',
  BUTTONS: 'buttons',
  COLOR_SWATCH: 'colorSwatch',
  IMAGES: 'images'
} as const;

type OptionDisplay = typeof OPTION_DISPLAY[keyof typeof OPTION_DISPLAY];

// Define our option types
interface Option {
  name: string;
};

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
      title: 'Medias',
      type: 'array',
      validation: Rule => [
        Rule.required().error('A minimum of ONE Media Group is required.'),
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
      title: 'Product Options',
      type: 'array',
      validation: Rule => [
        Rule.required(),
        Rule.max(3).error('Maximum of 3 product options allowed.'),
        Rule.custom((options: Option[] | undefined) => {
          // Check if options is undefined
          if (options === undefined) {
            return 'Options must be an array.';
          }
        
          // Check if options is not an array
          if (!Array.isArray(options)) {
            return 'Options must be an array.';
          }
        
          const optionNames = options.map(option => option.name);
          const uniqueOptionNames = new Set(optionNames);
        
          // Check for unique option names
          if (optionNames.length !== uniqueOptionNames.size) {
            const duplicateOptionNames = optionNames.filter((name, index) => optionNames.indexOf(name) !== index);
            return 'Option Names must be unique. Duplicates: ' + duplicateOptionNames.join(', ') + ".";
          }
        
          return true; // Validation successful
        }),
      ],
      of: [
        {
          type: 'object',
          title: 'Option',
          fields: [
            {
              name: 'name',
              title: 'Option Name',
              type: 'string',
              validation: Rule => Rule.required().error('Option name cannot be empty.'),
            },
            {
              name: 'displayFormat',
              title: 'Display Format',
              type: 'string',
              options: {
                list: [
                  { title: 'Dropdown Menu', value: OPTION_DISPLAY.DROPDOWN },
                  { title: 'Buttons', value: OPTION_DISPLAY.BUTTONS },
                  { title: 'Color Swatch', value: OPTION_DISPLAY.COLOR_SWATCH },
                  { title: 'Images', value: OPTION_DISPLAY.IMAGES }
                ]
              },
              initialValue: OPTION_DISPLAY.DROPDOWN,
            },
            {
              name: 'values',
              title: 'Option Values',
              type: 'array',
              of: [
                {
                  type: 'string',
                  title: 'Value',
                  validation: Rule => Rule.required().error('Option values cannot be empty.')
                }
              ],
              validation: Rule => [
                Rule.required(),
                Rule.min(1).error('A minimum of ONE option value is required.'),
                Rule.max(30).error('You have reached the cap of 30 values.'),
                Rule.custom((values) => {
                  // Ensure values is an array
                  if (!Array.isArray(values)) return true;
                
                  const uniqueValues = new Set(values);
                
                  // Check for unique values
                  if (values.length !== uniqueValues.size) {
                    const duplicateValues = values.filter((value, index) => values.indexOf(value) !== index);
                    return 'Option Values must be unique. Duplicates: ' + duplicateValues.join(', ') + ".";
                  }
                
                  return true; // Validation successful
                }),
              ]
            }
          ]
        }
      ]
    }),
  ],
});