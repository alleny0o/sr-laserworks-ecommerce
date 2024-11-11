// MediaReferenceInput.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { Box, Stack, Select } from '@sanity/ui';
import { StringInputProps, set, unset, useFormValue } from 'sanity';

interface MediaItem {
  _type: 'image' | 'mux.video';
  _key: string;
  alt?: string;
}

interface MediaGroup {
  _key: string;
  name?: string
  mediaItems: MediaItem[];
}

export function MediaReferenceInput(props: StringInputProps) {

  const { onChange, value } = props;
  
  // Get all media groups
  const mediaGroups = useFormValue(['mediaGroups']) as MediaGroup[] | undefined;

  // Memoize the options to prevent unnecessary rerenders
  const options = useMemo(() => {
    if (!mediaGroups?.length) {
      return [];
    }

    // If there's more than one media group, create options for groups
    if (mediaGroups.length > 1) {
      return mediaGroups.map((group) => ({
        value: `${group._key}`,
        title: `Media Group (Name: ${group.name || 'Unnamed'})`
      }));
    }

    // If there's exactly one group, create options for individual media items
    if (mediaGroups.length === 1) {
      return mediaGroups[0].mediaItems.map((item, index) => ({
        value: `${item._key}`,
        title: `Media ${index + 1} - ${item._type === 'image' ? 'Image' : 'Video'}`
      }));
    }

    return [];
  }, [mediaGroups]);

  // Handle media structure changes
  useEffect(() => {
    if (!mediaGroups) return;

    // If the selected value no longer exists in the options, clear it
    const valueExists = options.some(option => option.value === value);
    if (value && !valueExists) {
      onChange(unset());
    }
  }, [mediaGroups, value, onChange, options]);

  // Handle selection change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    if (newValue) {
      onChange(set(newValue));
    } else {
      onChange(unset());
    }
  }, [onChange]);

  if (!mediaGroups?.length) {
    return (
      <Box padding={3}>
        <em>No media groups available. Please add media first.</em>
      </Box>
    );
  }

  return (
    <Stack space={3}>
      <Select
        value={value || ''}
        onChange={handleChange}
      >
        <option value="">Select media association...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.title}
          </option>
        ))}
      </Select>
    </Stack>
  );
}