import { BasketIcon } from '@sanity/icons';
import { defineType, defineField, defineArrayMember } from 'sanity';

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    readOnly: true,
    icon: BasketIcon,
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'stripeCheckoutSessionId',
            title: 'Stripe Checkout Session ID',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'stripeCustomerId',
            title: 'Stripe Customer ID',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'clerkUserId',
            title: 'Store User ID',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'stripePaymentIntentId',
            title: 'Stripe Payment Intent ID',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),  
        defineField({
            name: 'products',
            title: 'Products',
            type: 'array',
            readOnly: true,
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'product',
                            title: 'Product Bought',
                            type: 'reference',
                            to: [{ type: 'product' }],
                        }),
                        defineField({
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                            readOnly: true,
                            validation: Rule => Rule.required().min(1),
                        }),
                    ],
                    preview: {
                        select: {
                            product: 'product.name',
                            quantity: 'quantity',
                            image: 'product.mediaGroups.0.mediaItems.0',
                            price: 'product.price',
                        },
                        prepare(select) {
                            return {
                                title: `${select.product} x ${select.quantity}`,
                                subtitle: `$${select.price * select.quantity}`,
                                media: select.image,
                            }
                        }
                    },
                })
            ]
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'currency',
            title: 'Currency',
            type: 'string',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'amountDiscounted',
            title: 'Amount Discounted',
            type: 'number',
            readOnly: true,
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Processing', value: 'processing' },
                    { title: 'Paid', value: 'paid' },  
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
            },
        }),
        defineField({
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
            readOnly: true,
            validation: Rule => Rule.required(),
        })
    ],
    preview: {
        select: {
            name: 'customerName',
            amount: 'totalPrice',
            orderId: 'orderNumber',
            email: 'email',
        },
        prepare(select) {
            const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
            return {
                title: `${select.name} (${orderIdSnippet})`,
                subtitle: `$${select.amount}, ${select.email}`,
                media: BasketIcon,
            }
        },
    }
});