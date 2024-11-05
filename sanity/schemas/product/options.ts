import { defineField } from "sanity";

const ERROR_MESSAGES = {
  REQUIRED_COLOR: 'Color is required for all values when using Color Swatch.',
  REQUIRED_IMAGE: 'Image is required for all values when using Images.',
  DUPLICATE_OPTIONS: (duplicates: string[]) => 
    `Option Names must be unique. Duplicates: ${duplicates.join(', ')}.`,
  DUPLICATE_VALUES: (duplicates: string[]) => 
    `Option Values must be unique. Duplicates: ${duplicates.join(', ')}.`,
} as const;

interface OptionValue {
  value: string;
  color?: { hex: string };
  image?: { _type: 'image'; asset: { _ref: string } };
}

interface Option {
  name: string;
  values?: OptionValue[];
}

export const optionsFields = [
  defineField({
    name: 'options',
    title: 'Product Options',
    type: 'array',
    validation: Rule => [
      Rule.required(),
      Rule.max(3).error('Maximum of 3 product options allowed.'),
      Rule.custom((options: Option[] | undefined) => {
        if (options === undefined || !Array.isArray(options)) {
          return 'Options must be an array.';
        }
        const optionNames = options.map(option => option.name);
        const uniqueOptionNames = new Set(optionNames);
        if (optionNames.length !== uniqueOptionNames.size) {
          const duplicateOptionNames = optionNames.filter((name, index) => optionNames.indexOf(name) !== index);
          return ERROR_MESSAGES.DUPLICATE_OPTIONS(duplicateOptionNames);
        }
        return true;
      }),
    ],
    of: [
      defineField({
        name: 'dropdownOption',
        title: 'Dropdown Menu',
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Option Name',
            type: 'string',
            validation: Rule => Rule.required().error('Option name cannot be empty.'),
          },
          {
            name: 'values',
            title: 'Option Values',
            type: 'array',
            validation: Rule => [
              Rule.required(),
              Rule.min(1).error('A minimum of ONE option value is required.'),
              Rule.max(30).error('You have reached the cap of 30 values.'),
            ],
            of: [{
              type: 'object',
              name: 'value',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: Rule => Rule.required().error('Option value cannot be empty.'),
                }
              ]
            }]
          }
        ]
      }),
      defineField({
        name: 'buttonOption',
        title: 'Buttons',
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Option Name',
            type: 'string',
            validation: Rule => Rule.required().error('Option name cannot be empty.'),
          },
          {
            name: 'values',
            title: 'Option Values',
            type: 'array',
            validation: Rule => [
              Rule.required(),
              Rule.min(1).error('A minimum of ONE option value is required.'),
              Rule.max(30).error('You have reached the cap of 30 values.'),
            ],
            of: [{
              type: 'object',
              name: 'value',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: Rule => Rule.required().error('Option value cannot be empty.'),
                }
              ]
            }]
          }
        ]
      }),
      defineField({
        name: 'colorOption',
        title: 'Color Swatch',
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Option Name',
            type: 'string',
            validation: Rule => Rule.required().error('Option name cannot be empty.'),
          },
          {
            name: 'values',
            title: 'Color Options',
            type: 'array',
            validation: Rule => [
              Rule.required(),
              Rule.min(1).error('A minimum of ONE option value is required.'),
              Rule.max(30).error('You have reached the cap of 30 values.'),
            ],
            of: [defineField({
              type: 'object',
              name: 'colorValue',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: Rule => Rule.required().error('Option value cannot be empty.'),
                },
                {
                  name: 'color',
                  title: 'Color',
                  type: 'simplerColor',
                  validation: Rule => Rule.required(),
                }
              ],
              preview: {
                select: {
                  title: 'value',
                  color: 'color'
                },
                prepare(selection: { title: string; color?: { hex: string } }) {
                  return {
                    title: selection.title,
                    media: selection.color ? selection.color.hex : undefined
                  }
                }
              }
            })]
          }
        ]
      }),
      defineField({
        name: 'imageOption',
        title: 'Images',
        type: 'object',
        fields: [
          {
            name: 'name',
            title: 'Option Name',
            type: 'string',
            validation: Rule => Rule.required().error('Option name cannot be empty.'),
          },
          {
            name: 'values',
            title: 'Image Options',
            type: 'array',
            validation: Rule => [
              Rule.required(),
              Rule.min(1).error('A minimum of ONE option value is required.'),
              Rule.max(30).error('You have reached the cap of 30 values.'),
            ],
            of: [{
              type: 'object',
              name: 'imageValue',
              fields: [
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string',
                  validation: Rule => Rule.required().error('Option value cannot be empty.'),
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: Rule => Rule.required(),
                }
              ],
              preview: {
                select: {
                  title: 'value',
                  media: 'image'
                }
              }
            }]
          }
        ]
      })
    ]
  })
];