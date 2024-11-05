import { defineType } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

// mini-schemas
import { generalFields } from "../schemas/product/general";
import { pricingFields } from "../schemas/product/pricing";
import { mediaFields } from "../schemas/product/media";
import { optionsFields } from "../schemas/product/options";




export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TrolleyIcon,
  preview: {
    select: {
      title: 'name',
      media: 'mediaGroups.0.mediaItems.0',
      mediaType: 'mediaGroups.0.mediaItems.0._type'
    },
    prepare(selection) {
      const { title, media } = selection;
      
      return {
        title,
        media,
      }
    }
  },
  fields: [
    ...generalFields,
    ...pricingFields,
    ...mediaFields,
    ...optionsFields,
  ],
});