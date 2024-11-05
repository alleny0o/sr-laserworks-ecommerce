import { defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const mediaFields = [
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
            if (!Array.isArray(mediaItems)) return true;
            const firstMedia = mediaItems[0];
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
];