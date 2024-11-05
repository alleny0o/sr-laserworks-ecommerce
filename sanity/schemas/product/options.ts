import { defineField } from "sanity";

const OPTION_DISPLAY = {
  DROPDOWN: 'dropdown',
  BUTTONS: 'buttons',
  COLOR_SWATCH: 'colorSwatch',
  IMAGES: 'images'
} as const;

interface Option {
    name: string;
};

export const optionsFields = [
  defineField({
    name: 'options',
    title: 'Product Options',
    type: 'array',
    validation: Rule => [
      Rule.required(),
      Rule.max(3).error('Maximum of 3 product options allowed.'),
      Rule.custom((options: Option[] | undefined) => {
        if (options === undefined) {
          return 'Options must be an array.';
        }
        if (!Array.isArray(options)) {
          return 'Options must be an array.';
        }
        const optionNames = options.map(option => option.name);
        const uniqueOptionNames = new Set(optionNames);
        if (optionNames.length !== uniqueOptionNames.size) {
          const duplicateOptionNames = optionNames.filter((name, index) => optionNames.indexOf(name) !== index);
          return 'Option Names must be unique. Duplicates: ' + duplicateOptionNames.join(', ') + ".";
        }
        return true;
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
                if (!Array.isArray(values)) return true;
                const uniqueValues = new Set(values);
                if (values.length !== uniqueValues.size) {
                  const duplicateValues = values.filter((value, index) => values.indexOf(value) !== index);
                  return 'Option Values must be unique. Duplicates: ' + duplicateValues.join(', ') + ".";
                }
                return true;
              }),
            ]
          }
        ]
      }
    ]
  }),
];