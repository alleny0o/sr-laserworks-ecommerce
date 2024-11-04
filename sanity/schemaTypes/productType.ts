/* eslint-disable import/no-anonymous-default-export */
import { TrolleyIcon, ImagesIcon } from "@sanity/icons";  // Import ImagesIcon for batch preview
import { defineField } from "sanity";

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TrolleyIcon,
  preview: {
    select: {
      title: 'name',
      media: 'images.0'
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
      title: 'Description',
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
      title: 'Compare-At-Price',
      type: 'number',
      validation: Rule => Rule.positive()
    }),
    defineField({
      name: 'mediaBatches',
      title: 'Media Batches',
      type: 'array',
      validation: Rule => Rule.required().min(1),
      of: [{
        type: 'object',
        title: 'Media Batch',
        icon: ImagesIcon,  // Added icon for batch
        preview: {
          select: {
            media: 'mediaItems'
          },
          prepare({ media }) {
            return {
              title: `Batch with ${media?.length || 0} items`,
              media: ImagesIcon
            }
          }
        },
        fields: [
          {
            name: 'mediaItems',
            title: 'Media Items',
            type: 'array',
            options: {
              layout: 'grid'
            },
            validation: Rule => Rule.required().min(1).max(10),
            of: [
              {
                type: 'object',
                fields: [
                  {
                    name: 'mediaType',
                    title: 'Media Type',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Image', value: 'image'},
                        {title: 'Video', value: 'video'}
                      ],
                      layout: 'radio'
                    },
                    initialValue: 'image'
                  },
                  {
                    name: 'media',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    hidden: ({parent}) => parent?.mediaType === 'video'
                  },
                  {
                    name: 'video',
                    title: 'Video',
                    type: 'file',
                    options: { 
                      accept: 'video/*',
                      storeOriginalFilename: true,
                      // This enables video thumbnails
                      metadata: ['thumbnail']
                    },
                    hidden: ({parent}) => parent?.mediaType === 'image'
                  },
                  {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                    validation: Rule => Rule.required()
                  }
                ],
                preview: {
                  select: {
                    media: 'media',
                    video: 'video',
                    type: 'mediaType',
                    title: 'alt'
                  },
                  prepare({ media, video, type, title }) {
                    const mediaPreview = type === 'video' ? video : media;
                    const icon = type === 'video' ? '🎥' : '📸';
                    return {
                      media: mediaPreview,
                      title: `${title}`,
                      // This adds the icon overlay
                      subtitle: icon,
                    }
                  }
                }
              }
            ]
          }
        ]
      }]
    }),
  ]
}