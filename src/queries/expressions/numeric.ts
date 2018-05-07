import { build } from 'karma.run'
import test from '../_before'

// Addition
// ========

test('addFloat', async t => {
  const response = await t.context.exampleQuery('addFloat_0',
    build(e => e.addFloat(0.5, 0.5))
  )

  t.is(response, 1)
})

test('addInt8', async t => {
  const response = await t.context.exampleQuery('addInt8_0',
    build(e => e.addInt8(-128, 127))
  )

  t.is(response, -1)
})

test('addInt16', async t => {
  const response = await t.context.exampleQuery('addInt16_0',
    build(e => e.addInt16(-32_768, 32_767))
  )

  t.is(response, -1)
})

test('addInt32', async t => {
  const response = await t.context.exampleQuery('addInt32_0',
    build(e => e.addInt32(-2_147_483_648, 2_147_483_647))
  )

  t.is(response, -1)
})

test('addInt64', async t => {
  const response = await t.context.exampleQuery('addInt64_0',
    build(e => e.addInt64(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
  )

  t.is(response, 0)
})

test('addUint8', async t => {
  const response = await t.context.exampleQuery('addUint8_0',
    build(e => e.addUint8(e.uint8(128), e.uint8(127)))
  )

  t.is(response, 255)
})

test('addUint16', async t => {
  const response = await t.context.exampleQuery('addUint16_0',
    build(e => e.addUint16(e.uint16(32_768), e.uint16(32_767)))
  )

  t.is(response, 65_535)
})

test('addUint32', async t => {
  const response = await t.context.exampleQuery('addUint32_0',
    build(e => e.addUint32(e.uint32(2_147_483_648), e.uint32(2_147_483_647)))
  )

  t.is(response, 4_294_967_295)
})

test('addUint64', async t => {
  const response = await t.context.exampleQuery('addUint64_0',
    build(e => e.addUint64(e.uint64(1), e.uint64(Number.MAX_SAFE_INTEGER - 1)))
  )

  t.is(response, Number.MAX_SAFE_INTEGER)
})

// Substraction
// ============

test('subFloat', async t => {
  const response = await t.context.exampleQuery('subFloat_0',
    build(e => e.subFloat(e.float(0.5), e.float(0.5)))
  )

  t.is(response, 0)
})

test('subInt8', async t => {
  const response = await t.context.exampleQuery('subInt8_0',
    build(e => e.subInt8(-128, 127))
  )

  t.is(response, 1)
})

test('subInt16', async t => {
  const response = await t.context.exampleQuery('subInt16_0',
    build(e => e.subInt16(-32_768, 32_767))
  )

  t.is(response, 1)
})

test('subInt32', async t => {
  const response = await t.context.exampleQuery('subInt32_0',
    build(e => e.subInt32(-2_147_483_648, 2_147_483_647))
  )

  t.is(response, 1)
})

test('subInt64', async t => {
  const response = await t.context.exampleQuery('subInt64_0',
    build(e => e.subInt64(0, Number.MAX_SAFE_INTEGER))
  )

  t.is(response, -Number.MAX_SAFE_INTEGER)
})

test('subUint8', async t => {
  const response = await t.context.exampleQuery('subUint8_0',
    build(e => e.subUint8(e.uint8(128), e.uint8(127)))
  )

  t.is(response, 1)
})

test('subUint16', async t => {
  const response = await t.context.exampleQuery('subUint16_0',
    build(e => e.subUint16(e.uint16(32_768), e.uint16(32_767)))
  )

  t.is(response, 1)
})

test('subUint32', async t => {
  const response = await t.context.exampleQuery('subUint32_0',
    build(e => e.subUint32(e.uint32(2_147_483_648), e.uint32(2_147_483_647)))
  )

  t.is(response, 1)
})

test('subUint64', async t => {
  const response = await t.context.exampleQuery('subUint64_0',
    build(e => e.subUint64(e.uint64(Number.MAX_SAFE_INTEGER), e.uint64(Number.MAX_SAFE_INTEGER - 1)))
  )

  t.is(response, 1)
})

// Multiplication
// ==============

test('divFloat', async t => {
  const response = await t.context.exampleQuery('divFloat_0',
    build(e => e.divFloat(e.float(1), e.float(2)))
  )

  t.is(response, 0.5)
})

test('divInt8', async t => {
  const response = await t.context.exampleQuery('divInt8_0',
    build(e => e.divInt8(127, 2))
  )

  t.is(response, 63)
})

test('divInt16', async t => {
  const response = await t.context.exampleQuery('divInt16_0',
    build(e => e.divInt16(32_767, 2))
  )

  t.is(response, 16_383)
})

test('divInt32', async t => {
  const response = await t.context.exampleQuery('divInt32_0',
    build(e => e.divInt32(2_147_483_647, 2))
  )

  t.is(response, 1_073_741_823)
})

test('divInt64', async t => {
  const response = await t.context.exampleQuery('divInt64_0',
    build(e => e.divInt64(Number.MAX_SAFE_INTEGER, 2))
  )

  t.is(response, Math.floor(Number.MAX_SAFE_INTEGER / 2))
})

test('divUint8', async t => {
  const response = await t.context.exampleQuery('divUint8_0',
    build(e => e.divUint8(e.uint8(255), e.uint8(2)))
  )

  t.is(response, 127)
})

test('divUint16', async t => {
  const response = await t.context.exampleQuery('divUint16_0',
    build(e => e.divUint16(e.uint16(65_535), e.uint16(2)))
  )

  t.is(response, 32_767)
})

test('divUint32', async t => {
  const response = await t.context.exampleQuery('divUint32_0',
    build(e => e.divUint32(e.uint32(4_294_967_295), e.uint32(2)))
  )

  t.is(response, 2_147_483_647)
})

test('divUint64', async t => {
  const response = await t.context.exampleQuery('divUint64_0',
    build(e => e.divUint64(e.uint64(Number.MAX_SAFE_INTEGER), e.uint64(2)))
  )

  t.is(response, Math.floor(Number.MAX_SAFE_INTEGER / 2))
})

// Multiplication
// ==============

test('mulFloat', async t => {
  const response = await t.context.exampleQuery('mulFloat_0',
    build(e => e.mulFloat(e.float(0.5), e.float(2)))
  )

  t.is(response, 1)
})

test('mulInt8', async t => {
  const response = await t.context.exampleQuery('mulInt8_0',
    build(e => e.mulInt8(63, 2))
  )

  t.is(response, 127 - 1)
})

test('mulInt16', async t => {
  const response = await t.context.exampleQuery('mulInt16_0',
    build(e => e.mulInt16(16_383, 2))
  )

  t.is(response, 32_767 - 1)
})

test('mulInt32', async t => {
  const response = await t.context.exampleQuery('mulInt32_0',
    build(e => e.mulInt32(1_073_741_823, 2))
  )

  t.is(response, 2_147_483_647 - 1)
})

test('mulInt64', async t => {
  const response = await t.context.exampleQuery('mulInt64_0',
    build(e => e.mulInt64(Math.floor(Number.MAX_SAFE_INTEGER / 2), 2))
  )

  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})

test('mulUint8', async t => {
  const response = await t.context.exampleQuery('mulUint8_0',
    build(e => e.mulUint8(e.uint8(127), e.uint8(2)))
  )

  t.is(response, 255 - 1)
})

test('mulUint16', async t => {
  const response = await t.context.exampleQuery('mulUint16_0',
    build(e => e.mulUint16(e.uint16(32_767), e.uint16(2)))
  )

  t.is(response, 65_535 - 1)
})

test('mulUint32', async t => {
  const response = await t.context.exampleQuery('mulUint32_0',
    build(e => e.mulUint32(e.uint32(2_147_483_647), e.uint32(2)))
  )

  t.is(response, 4_294_967_295 - 1)
})

test('mulUint64', async t => {
  const response = await t.context.exampleQuery('mulUint64_0',
    build(e => e.mulUint64(e.uint64(Math.floor(Number.MAX_SAFE_INTEGER / 2)), e.uint64(2)))
  )

  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})

// Less Than
// =========

test('ltFloat', async t => {
  const response = await t.context.exampleQuery('ltFloat_0',
    build(e => e.ltFloat(e.float(Number.MIN_VALUE), e.float(Number.MAX_VALUE)))
  )

  t.is(response, true)
})

test('ltInt8', async t => {
  const response = await t.context.exampleQuery('ltInt8_0',
    build(e => e.ltInt8(-128, 127))
  )

  t.is(response, true)
})

test('ltInt16', async t => {
  const response = await t.context.exampleQuery('ltInt16_0',
    build(e => e.ltInt16(-32_768, 32_767))
  )

  t.is(response, true)
})

test('ltInt32', async t => {
  const response = await t.context.exampleQuery('ltInt32_0',
    build(e => e.ltInt32(-2_147_483_648, 2_147_483_647))
  )

  t.is(response, true)
})

test('ltInt64', async t => {
  const response = await t.context.exampleQuery('ltInt64_0',
    build(e => e.ltInt64(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
  )

  t.is(response, true)
})

test('ltUint8', async t => {
  const response = await t.context.exampleQuery('ltUint8_0',
    build(e => e.ltUint8(e.uint8(0), e.uint8(255)))
  )

  t.is(response, true)
})

test('ltUint16', async t => {
  const response = await t.context.exampleQuery('ltUint16_0',
    build(e => e.ltUint16(e.uint16(0), e.uint16(65_535)))
  )

  t.is(response, true)
})

test('ltUint32', async t => {
  const response = await t.context.exampleQuery('ltUint32_0',
    build(e => e.ltUint32(e.uint32(0), e.uint32(4_294_967_295)))
  )

  t.is(response, true)
})

test('ltUint64', async t => {
  const response = await t.context.exampleQuery('ltUint64_0',
    build(e => e.ltUint64(e.uint64(0), e.uint64(Number.MAX_SAFE_INTEGER)))
  )

  t.is(response, true)
})

// Greater Than
// ============

test('gtFloat', async t => {
  const response = await t.context.exampleQuery('gtFloat_0',
    build(e => e.gtFloat(e.float(Number.MIN_VALUE), e.float(Number.MAX_VALUE)))
  )

  t.is(response, false)
})

test('gtInt8', async t => {
  const response = await t.context.exampleQuery('gtInt8_0',
    build(e => e.gtInt8(-128, 127))
  )

  t.is(response, false)
})

test('gtInt16', async t => {
  const response = await t.context.exampleQuery('gtInt16_0',
    build(e => e.gtInt16(-32_768, 32_767))
  )

  t.is(response, false)
})

test('gtInt32', async t => {
  const response = await t.context.exampleQuery('gtInt32_0',
    build(e => e.gtInt32(-2_147_483_648, 2_147_483_647))
  )

  t.is(response, false)
})

test('gtInt64', async t => {
  const response = await t.context.exampleQuery('gtInt64_0',
    build(e => e.gtInt64(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
  )

  t.is(response, false)
})

test('gtUint8', async t => {
  const response = await t.context.exampleQuery('gtUint8_0',
    build(e => e.gtUint8(e.uint8(0), e.uint8(255)))
  )

  t.is(response, false)
})

test('gtUint16', async t => {
  const response = await t.context.exampleQuery('gtUint16_0',
    build(e => e.gtUint16(e.uint16(0), e.uint16(65_535)))
  )

  t.is(response, false)
})

test('gtUint32', async t => {
  const response = await t.context.exampleQuery('gtUint32_0',
    build(e => e.gtUint32(e.uint32(0), e.uint32(4_294_967_295)))
  )

  t.is(response, false)
})

test('gtUint64', async t => {
  const response = await t.context.exampleQuery('gtUint64_0',
    build(e => e.gtUint64(e.uint64(0), e.uint64(Number.MAX_SAFE_INTEGER)))
  )

  t.is(response, false)
})

// Conversion
// ==========

test('floatToInt', async t => {
  const response = await t.context.exampleQuery('floatToInt_0',
    build(e => e.addInt8(0, e.floatToInt(e.float(0.5))))
  )

  t.is(response, 0)
})

test('intToFloat', async t => {
  const response = await t.context.exampleQuery('intToFloat_0',
    build(e => e.addFloat(0.5, e.floatToInt(e.int8(1))))
  )

  t.is(response, 1.5)
})
