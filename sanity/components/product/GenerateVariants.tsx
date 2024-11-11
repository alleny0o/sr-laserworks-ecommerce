import { Stack, Button } from '@sanity/ui';
import { randomKey } from '@sanity/util/content';
import { useCallback } from 'react';
import { ArrayOfObjectsInputProps, set, insert, setIfMissing, useFormValue } from 'sanity';

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


export function GenerateVariants(props: ArrayOfObjectsInputProps) {
    const { onChange } = props;

};