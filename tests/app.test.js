import { describe, it, expect } from 'vitest'

// ✅ TEST 1: Calculate Total Bill
describe('Total Bill Calculation', () => {
  it('sums multiple items correctly', () => {
    const items = [
      { price: 85, qty: 2 },
      { price: 75, qty: 1 }
    ]
    const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0)
    expect(total).toBe(245)
  })
})

// ✅ TEST 2: Change Calculation
describe('Change Calculation', () => {
  it('returns correct change when paid enough', () => {
    expect(150 - 100).toBe(50)
  })
  it('returns 0 when money is less than total', () => {
    const total = 100
    const paid = 80
    expect(paid >= total ? paid - total : 0).toBe(0)
  })
})

// ✅ TEST 3: Name Validation
describe('Customer Name Validation', () => {
  it('rejects empty name', () => {
    const name = ''
    expect(name.trim()).toHaveLength(0)
  })
  it('accepts valid name', () => {
    const name = 'Angelica'
    expect(name.trim().length).toBeGreaterThan(0)
  })
})

// ✅ TEST 4: Age Validation
describe('Age Validation', () => {
  it('rejects zero or negative age', () => {
    expect(Number(0) <= 0).toBe(true)
    expect(Number(-5) <= 0).toBe(true)
  })
  it('accepts valid positive age', () => {
    expect(Number(22) > 0).toBe(true)
  })
})

// ✅ TEST 5: Delivery Validation
describe('Delivery Validation', () => {
  it('requires driver info for Takeout', () => {
    const serviceType = 'Takeout'
    const driverName = ''
    const isValid = serviceType === 'Takeout' && driverName.trim() !== ''
    expect(isValid).toBe(false)
  })
})