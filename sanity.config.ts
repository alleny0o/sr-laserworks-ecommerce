'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Import the muxInput plugin
import { muxInput } from 'sanity-plugin-mux-input';

// Import simplerColorInput plugin
import { simplerColorInput } from 'sanity-plugin-simpler-color-input';


// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    muxInput(),
    simplerColorInput({
      defaultColorFormat: 'rgba',
      defaultColorList: [
        {label: 'Red', value: 'rgba(255, 0, 0, 1)'},
        {label: 'Green', value: 'rgba(0, 255, 0, 1)'},
        {label: 'Blue', value: 'rgba(0, 0, 255, 1)'},
        {label: 'Black', value: 'rgba(0, 0, 0, 1)'},
        {label: 'White', value: 'rgba(255, 255, 255, 1)'},
        {label: 'Custom...', value: 'custom'},
      ],
      enableSearch: true,
    }),
  ],
})
