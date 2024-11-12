import { defineType } from "sanity";
import { TrolleyIcon } from "@sanity/icons";

// mini-schemas
import { generalFields } from "../schemas/product/general";
import { pricingFields } from "../schemas/product/pricing";
import { mediaFields } from "../schemas/product/media";
import { optionsFields } from "../schemas/product/options";
import { variantsFields } from "../schemas/product/variants";
import { shippingFields } from "../schemas/product/shipping";
import { formFields } from "../schemas/product/customizationForm";
import { seoFields } from "../schemas/product/seo";

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
    ...shippingFields,
    ...mediaFields,
    ...optionsFields,
    ...variantsFields,
    ...formFields,
    ...seoFields,
  ],
});