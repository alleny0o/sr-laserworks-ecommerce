import { defineField, Rule } from "sanity";

// Types
interface OptionValue {
  value: string;
  color?: { hex: string };
  image?: { _type: 'image'; asset: { _ref: string } };
}

interface Option {
  name: string;
  values?: OptionValue[];
}

// Error Messages
const ERROR_MESSAGES = {
  REQUIRED_COLOR: 'Color is required for all values when using Color Swatch.',
  REQUIRED_IMAGE: 'Image is required for all values when using Images.',
  DUPLICATE_OPTIONS: (duplicates: string[]) => 
    `Option Names must be unique. Duplicates: ${duplicates.join(', ')}.`,
  DUPLICATE_VALUES: (duplicates: string[]) => 
    `Option Values must be unique. Duplicates: ${duplicates.join(', ')}.`,
} as const;

// Common Validation Rules
const createDuplicateValuesValidator = (values: OptionValue[] | undefined) => {
  if (!Array.isArray(values)) return 'Option values must be an array.';
  
  const optionValues = values.map(option => option.value);
  const uniqueOptionValues = new Set(optionValues);
  
  if (optionValues.length !== uniqueOptionValues.size) {
    const duplicateOptionValues = optionValues.filter(
      (name, index) => optionValues.indexOf(name) !== index
    );
    return ERROR_MESSAGES.DUPLICATE_VALUES(duplicateOptionValues);
  }
  return true;
};

const commonValueValidation = [
  (Rule: Rule) => Rule.required(),
  (Rule: Rule) => Rule.min(1).error('A minimum of ONE option value is required.'),
  (Rule: Rule) => Rule.max(30).error('You have reached the cap of 30 values.'),
  (Rule: Rule) => Rule.custom(createDuplicateValuesValidator),
];

const requiredNameField = {
  name: 'name',
  title: 'Option Name',
  type: 'string',
  validation: (Rule: Rule) => Rule.required().error("Option name cannot be empty."),
};

// Option Type Definitions
const dropdownOption = defineField({
  name: 'dropdownOption',
  title: 'Dropdown',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [{ type: 'string' }]
    }
  ]
});

const buttonOption = defineField({
  name: 'buttonOption',
  title: 'Buttons',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [{ type: 'string' }]
    }
  ]
});

const colorOption = defineField({
  name: 'colorOption',
  title: 'Colors',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
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
          prepare({ title, color }: { title: string; color?: { hex: string } | undefined }) {
            return {
              title,
              media: color?.hex
            };
          }
        }
      })]
    }
  ]
});

const imageOption = defineField({
  name: 'imageOption',
  title: 'Images',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
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
});

// Option Type With Media Association
const dropdownOptionWithMedia = defineField({
  name: 'dropdownOptionWithMedia',
  title: 'Dropdown [with Media]',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [{
        type: 'object',
        name: 'dropdownValue',
        fields: [
          {
            name: 'value',
            title: 'Value',
            type: 'string',
            validation: Rule => Rule.required().error('Option value cannot be empty.'),
          },
        ],
        preview: {
          select: {
            title: 'value',
          }
        }
      }]
    },
  ]
});

const buttonOptionWithMedia = defineField({
  name: 'buttonOptionWithMedia',
  title: 'Buttons [with Media]',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [{
        type: 'object',
        name: 'buttonValue',
        fields: [
          {
            name: 'value',
            title: 'Value',
            type: 'string',
            validation: Rule => Rule.required().error('Option value cannot be empty.'),
          },
        ],
        preview: {
          select: {
            title: 'value',
          }
        }
      }]
    },
  ]
});

const colorOptionWithMedia = defineField({
  name: 'colorOptionWithMedia',
  title: 'Colors [with Media]',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [
        defineField({
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
            prepare({ title, color }: { title: string; color?: { hex: string } | undefined }) {
              return {
                title,
                media: color?.hex
              };
            }
          }
        })
      ]
    }
  ]
});

const imageOptionWithMedia = defineField({
  name: 'imageOptionWithMedia',
  title: 'Images [with Media]',
  type: 'object',
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
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

// Main Options Field Export
export const optionsFields = [
  defineField({
    name: 'options',
    title: 'Product Options',
    type: 'array',
    validation: Rule => [
      Rule.required(),
      Rule.max(3).error('Maximum of 3 product options allowed.'),
      Rule.custom((options: Option[] | undefined) => {
        if (!Array.isArray(options)) return 'Options must be an array.';
        
        const optionNames = options.map(option => option.name);
        const uniqueOptionNames = new Set(optionNames);
        
        if (optionNames.length !== uniqueOptionNames.size) {
          const duplicateOptionNames = optionNames.filter(
            (name, index) => optionNames.indexOf(name) !== index
          );
          return ERROR_MESSAGES.DUPLICATE_OPTIONS(duplicateOptionNames);
        }
        return true;
      }),
    ],
    of: [dropdownOption, dropdownOptionWithMedia, buttonOption, buttonOptionWithMedia, colorOption, colorOptionWithMedia, imageOption, imageOptionWithMedia]
  })
];