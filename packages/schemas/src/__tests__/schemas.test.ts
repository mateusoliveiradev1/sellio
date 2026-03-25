import { describe, it, expect } from 'vitest'
import {
    sellerSchema,
    sellerCreateInput,
    productSchema,
    productCreateInput,
    productStatusSchema,
    mlListingSchema,
    listingTypeSchema,
    orderSchema,
    orderStatusSchema,
    questionSchema,
    billingSchema,
    billingTypeSchema,
} from '../index'

// ─── Seller Schema ───────────────────────────────────────

describe('sellerSchema', () => {
    it('accepts valid seller data', () => {
        const result = sellerSchema.safeParse({
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'seller@example.com',
            name: 'João Silva',
            plan: 'free',
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
        const result = sellerCreateInput.safeParse({
            email: 'not-an-email',
            name: 'Test',
        })
        expect(result.success).toBe(false)
    })

    it('rejects empty name', () => {
        const result = sellerCreateInput.safeParse({
            email: 'ok@test.com',
            name: '',
        })
        expect(result.success).toBe(false)
    })

    it('defaults plan to free', () => {
        const result = sellerSchema.safeParse({
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'a@b.com',
            name: 'Test',
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.plan).toBe('free')
        }
    })

    it('rejects invalid plan', () => {
        const result = sellerSchema.safeParse({
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'a@b.com',
            name: 'Test',
            plan: 'invalid_plan',
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        expect(result.success).toBe(false)
    })
})

// ─── Product Schema ──────────────────────────────────────

describe('productSchema', () => {
    const validProduct = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        sellerId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Fone Bluetooth JBL',
        description: 'Fone Bluetooth JBL original com garantia.',
        images: ['https://cdn.example.com/img1.jpg'],
        price: 149.9,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    it('accepts valid product', () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
    })

    it('defaults status to draft', () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.status).toBe('draft')
        }
    })

    it('rejects title longer than 60 chars', () => {
        const result = productCreateInput.safeParse({
            ...validProduct,
            title: 'A'.repeat(61),
        })
        expect(result.success).toBe(false)
    })

    it('rejects empty images array', () => {
        const result = productCreateInput.safeParse({
            ...validProduct,
            images: [],
        })
        expect(result.success).toBe(false)
    })

    it('rejects negative price', () => {
        const result = productCreateInput.safeParse({
            ...validProduct,
            price: -10,
        })
        expect(result.success).toBe(false)
    })

    it('rejects negative stock', () => {
        const result = productCreateInput.safeParse({
            ...validProduct,
            stock: -1,
        })
        expect(result.success).toBe(false)
    })

    it('accepts all valid product statuses', () => {
        const statuses = ['draft', 'ready', 'publishing', 'published', 'error', 'paused']
        for (const status of statuses) {
            expect(productStatusSchema.safeParse(status).success).toBe(true)
        }
    })
})

// ─── ML Listing Schema ──────────────────────────────────

describe('mlListingSchema', () => {
    it('accepts all listing types', () => {
        const types = ['gold_special', 'gold_pro', 'gold', 'silver', 'bronze', 'free']
        for (const type of types) {
            expect(listingTypeSchema.safeParse(type).success).toBe(true)
        }
    })

    it('rejects invalid listing type', () => {
        expect(listingTypeSchema.safeParse('platinum').success).toBe(false)
    })
})

// ─── Order Schema ────────────────────────────────────────

describe('orderSchema', () => {
    it('accepts all order statuses', () => {
        const statuses = ['paid', 'shipped', 'delivered', 'cancelled']
        for (const status of statuses) {
            expect(orderStatusSchema.safeParse(status).success).toBe(true)
        }
    })

    it('accepts valid order with negative netProfit', () => {
        const result = orderSchema.safeParse({
            id: '550e8400-e29b-41d4-a716-446655440000',
            sellerId: '550e8400-e29b-41d4-a716-446655440001',
            listingId: '550e8400-e29b-41d4-a716-446655440002',
            mlOrderId: 123456789,
            status: 'paid',
            totalAmount: 100,
            commission: 14,
            shippingCost: 20,
            netProfit: -5, // can be negative (loss)
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        expect(result.success).toBe(true)
    })
})

// ─── Question Schema ─────────────────────────────────────

describe('questionSchema', () => {
    it('accepts pending question without answer', () => {
        const result = questionSchema.safeParse({
            id: '550e8400-e29b-41d4-a716-446655440000',
            sellerId: '550e8400-e29b-41d4-a716-446655440001',
            listingId: '550e8400-e29b-41d4-a716-446655440002',
            mlQuestionId: 999,
            text: 'Produto tem garantia?',
            status: 'pending',
            createdAt: new Date(),
        })
        expect(result.success).toBe(true)
    })
})

// ─── Billing Schema ──────────────────────────────────────

describe('billingSchema', () => {
    it('accepts all billing types', () => {
        const types = ['commission', 'shipping_fee', 'fixed_fee', 'refund']
        for (const type of types) {
            expect(billingTypeSchema.safeParse(type).success).toBe(true)
        }
    })

    it('rejects invalid billing type', () => {
        expect(billingTypeSchema.safeParse('discount').success).toBe(false)
    })
})
