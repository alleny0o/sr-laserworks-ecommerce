import { defineField, Rule } from "sanity";
import {ColorWheelIcon, ImagesIcon, ThListIcon, PlayIcon, UlistIcon} from '@sanity/icons';
import { IoIosColorFill } from "react-icons/io";


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

// Constants
const MAX_OPTIONS = 3;
const MAX_VALUES = 30;
const MIN_VALUES = 0;

// Error Messages
const ERROR_MESSAGES = {
  REQUIRED_COLOR: 'Color is required for all values when using Color Swatch.',
  REQUIRED_IMAGE: 'Image is required for all values when using Images.',
  REQUIRED_ARRAY: 'Option values must be an array.',
  REQUIRED_NAME: 'Option name cannot be empty.',
  REQUIRED_VALUE: 'Option value cannot be empty.',
  MIN_VALUES: `A minimum of ${MIN_VALUES} option value is required.`,
  MAX_VALUES: `You have reached the cap of ${MAX_VALUES} values.`,
  MAX_OPTIONS: `Maximum of ${MAX_OPTIONS} product options allowed.`,
  DUPLICATE_OPTIONS: (duplicates: string[]) => 
    `Option Names must be unique. Duplicates: ${duplicates.join(', ')}.`,
  DUPLICATE_VALUES: (duplicates: string[]) => 
    `Option Values must be unique. Duplicates: ${duplicates.join(', ')}.`,
} as const;

// Common Validation Rules
const checkDuplicates = <T>(items: T[], getValue: (item: T) => string): string[] | null => {
  const values = items.map(getValue);
  const uniqueValues = new Set(values);
  
  if (values.length !== uniqueValues.size) {
    return values.filter((val, index) => values.indexOf(val) !== index);
  }
  return null;
};

const createDuplicateValuesValidator = (values: OptionValue[] | undefined) => {
  if (!Array.isArray(values)) return ERROR_MESSAGES.REQUIRED_ARRAY;
  
  const duplicates = checkDuplicates(values, option => option.value);
  return duplicates ? ERROR_MESSAGES.DUPLICATE_VALUES(duplicates) : true;
};

const commonValueValidation = [
  (Rule: Rule) => Rule.required(),
  (Rule: Rule) => Rule.min(MIN_VALUES).error(ERROR_MESSAGES.MIN_VALUES),
  (Rule: Rule) => Rule.max(MAX_VALUES).error(ERROR_MESSAGES.MAX_VALUES),
  (Rule: Rule) => Rule.custom(createDuplicateValuesValidator),
];

const requiredNameField = {
  name: 'name',
  title: 'Option Name',
  type: 'string',
  validation: (Rule: Rule) => Rule.required().error(ERROR_MESSAGES.REQUIRED_NAME),
};

const requiredValueField = {
  name: 'value',
  title: 'Value',
  type: 'string',
  validation: (Rule: Rule) => Rule.required().error(ERROR_MESSAGES.REQUIRED_VALUE),
};

// Option Type Definitions
const dropdownOption = defineField({
  name: 'dropdownOption',
  title: 'Dropdown',
  type: 'object',
  icon: ThListIcon,
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      icon: UlistIcon,
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [defineField({
        type: 'object',
        name: 'dropdownValue',
        fields: [
          requiredValueField
        ],
        preview: {
          select: {
            title: 'value'
          }
        }
      })]
    }
  ]
});

const buttonOption = defineField({
  name: 'buttonOption',
  title: 'Buttons',
  type: 'object',
  icon: PlayIcon,
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      icon: UlistIcon,
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [defineField({
        type: 'object',
        name: 'buttonValue',
        fields: [
          requiredValueField
        ],
        preview: {
          select: {
            title: 'value'
          }
        }
      })]
    }
  ]
});

const colorOption = defineField({
  name: 'colorOption',
  title: 'Colors',
  type: 'object',
  icon: ColorWheelIcon,
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      icon: UlistIcon,
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [defineField({
        type: 'object',
        name: 'colorValue',
        fields: [
          requiredValueField,
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
            subtitle: 'color.value',
          },
          prepare({ title, subtitle }) {
            return {
              title,
              subtitle: subtitle ? `Color: ${subtitle}` : 'No color selected',
              media: IoIosColorFill, 
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
  icon: ImagesIcon,
  fields: [
    requiredNameField,
    {
      name: 'values',
      title: 'Option Values',
      type: 'array',
      icon: UlistIcon,
      validation: Rule => commonValueValidation.map(validate => validate(Rule)),
      of: [{
        type: 'object',
        name: 'imageValue',
        fields: [
          requiredValueField,
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

// Main Options Field Export
export const optionsFields = [
  defineField({
    name: 'options',
    title: 'Product Options',
    type: 'array',
    validation: Rule => [
      Rule.max(MAX_OPTIONS).error(ERROR_MESSAGES.MAX_OPTIONS),
      Rule.custom((options: Option[] | undefined) => {
        if (!Array.isArray(options)) return true;
        const duplicates = checkDuplicates(options, option => option.name);
        return duplicates ? ERROR_MESSAGES.DUPLICATE_OPTIONS(duplicates) : true;
      }),
    ],
    of: [dropdownOption, buttonOption, colorOption, imageOption]
  })
];