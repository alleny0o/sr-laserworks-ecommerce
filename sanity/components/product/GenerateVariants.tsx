import { Stack, Button } from '@sanity/ui';
import { randomKey } from '@sanity/util/content';
import { useCallback } from 'react';
import { ArrayOfObjectsInputProps, set, insert, setIfMissing, useFormValue } from 'sanity';
import { SparklesIcon, ResetIcon } from '@sanity/icons';

// For color options
type Color = {
    label: string;
    value: string;
};

// For image options
type ImageAsset = {
    _type: "reference";
    _ref: string;
};

type Image = {
    _type: "image";
    asset: ImageAsset;
};

// Base value type with common fields
interface BaseOptionValue {
    _key: string;
    _type: string;
    value: string;
}

// Specific value types
interface ColorOptionValue extends BaseOptionValue {
    _type: "colorValue";
    color: Color;
}

interface ImageOptionValue extends BaseOptionValue {
    _type: "imageValue";
    image: Image;
}

interface DropdownOptionValue extends BaseOptionValue {
    _type: "dropdownValue";
}

interface ButtonOptionValue extends BaseOptionValue {
    _type: "buttonValue";
}

// Union type for all possible value types
type OptionValue = ColorOptionValue | ImageOptionValue | DropdownOptionValue | ButtonOptionValue;

// Base option type
interface BaseOption {
    _key: string;
    _type: string;
    name: string;
    values: OptionValue[];
}

// Specific option types
interface ColorOption extends BaseOption {
    _type: "colorOption";
    values: ColorOptionValue[];
}

interface ImageOption extends BaseOption {
    _type: "imageOption";
    values: ImageOptionValue[];
}

interface DropdownOption extends BaseOption {
    _type: "dropdownOption";
    values: DropdownOptionValue[];
}

interface ButtonOption extends BaseOption {
    _type: "buttonOption";
    values: ButtonOptionValue[];
}

// Union type for all possible option types
type Option = ColorOption | ImageOption | DropdownOption | ButtonOption;

interface VariantOption {
    name: string;
    value: string;
    _key: string;
  }
  
  interface Variant {
    _key: string;
    _type: 'variant';
    variantName: string;
    options: VariantOption[];
    quantity: number;
  }


export function GenerateVariants(props: ArrayOfObjectsInputProps) {
    const { onChange } = props;

    const documentId = useFormValue(['_id']) as string;
    const publishedDocumentId = documentId.includes('draft.') ? documentId.replace('draft.', '') : documentId;

    const variantOptions = useFormValue(['options']) as Option[];

    const cartesianProduct = (arr: { name: string; value: string; }[][]): { name: string; value: string; }[][] => {
        return arr.reduce<{ name: string; value: string; }[][]>((a, b) => {
          return a.map(x => b.map(y => x.concat([y]))).reduce((c, d) => c.concat(d), []);
        }, [[]]);
    };

    const generateVariantName = (variantOptions: { name: string; value: string; }[]) => {
        return variantOptions.map(option => `${option.name}: ${option.value}`).join(', ');
    };

    const handleClick = useCallback(() => {
        const generateVariantKey = (variantOptions: { name: string; value: string; }[]) => {
            return variantOptions.map(option => `${option.name}:${option.value}`).join('|') + '+' + publishedDocumentId;
        };

        const optionValues = variantOptions.map(opt => {
            return opt.values.map(v => ({
              name: opt.name,
              value: v.value // Now we access the value property of the OptionValue type
            }));
        });

        // Generate all combinations of option values
        const variants = cartesianProduct(optionValues).map((variant) => {
        const variantKey = generateVariantKey(variant);
        const variantName = generateVariantName(variant);
  
        // Assign a random key to each option in the variant
        const optionsWithKeys = variant.map(option => ({
          ...option,
          _key: randomKey(12)
        }));
  
        return {
          variantName,
          _type: 'variant' as const,
          _key: variantKey,
          options: optionsWithKeys,
          quantity: 0
        } satisfies Variant;
    });

    // Individually insert items to append to the end of the array
    const variantPatches = variants.map((variant) => 
      insert([variant], 'after', [-1])
    );

    // Patch the document with the new variants array
    // First clear out existing variants in case we're regenerating
    onChange(set([]));
    // Then set the new variants
    onChange([setIfMissing([]), ...variantPatches]);

    }, [onChange, publishedDocumentId, variantOptions]);

    // Clear out existing variants
    const handleClear = useCallback(() => {
        onChange(set([]));
    }, [onChange]);

    return (
        <Stack space={3}>
            <Button icon={SparklesIcon} text="Generate Variants" mode="ghost" onClick={handleClick} />
            {props.renderDefault(props)}
            <Button icon={ResetIcon} text="Clear Variants" mode="ghost" onClick={handleClear} />
      </Stack>
    );
};