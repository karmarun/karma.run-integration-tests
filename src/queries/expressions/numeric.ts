import test from '../_before'

import * as e from '@karma.run/sdk/expression'
import * as d from '@karma.run/sdk/value'

// Addition
// ========

test('addFloat', async t => {
  const response = await t.context.exampleQuery('addFloat_0',
    e.addFloat(
      e.data(d.float(0.5).toDataConstructor()),
      e.data(d.float(0.5).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('addInt8', async t => {
  const response = await t.context.exampleQuery('addInt8_0',
    e.addInt8(
      e.data(d.int8(-128).toDataConstructor()),
      e.data(d.int8(127).toDataConstructor())
    )
  )

  t.is(response, -1)
})

test('addInt16', async t => {
  const response = await t.context.exampleQuery('addInt16_0',
    e.addInt16(
      e.data(d.int16(-32_768).toDataConstructor()),
      e.data(d.int16(32_767).toDataConstructor())
    )
  )

  t.is(response, -1)
})

test('addInt32', async t => {
  const response = await t.context.exampleQuery('addInt32_0',
    e.addInt32(
      e.data(d.int32(-2_147_483_648).toDataConstructor()),
      e.data(d.int32(2_147_483_647).toDataConstructor())
    )
  )

  t.is(response, -1)
})

test('addInt64', async t => {
  const response = await t.context.exampleQuery('addInt64_0',
    e.addInt64(
      e.data(d.int64(Number.MIN_SAFE_INTEGER).toDataConstructor()),
      e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor())
    )
  )

  t.is(response, 0)
})

test('addUint8', async t => {
  const response = await t.context.exampleQuery('addUint8_0',
    e.addUint8(
      e.data(d.uint8(128).toDataConstructor()),
      e.data(d.uint8(127).toDataConstructor())
    )
  )

  t.is(response, 255)
})

test('addUint16', async t => {
  const response = await t.context.exampleQuery('addUint16_0',
    e.addUint16(
      e.data(d.uint16(32_768).toDataConstructor()),
      e.data(d.uint16(32_767).toDataConstructor())
    )
  )

  t.is(response, 65_535)
})

test('addUint32', async t => {
  const response = await t.context.exampleQuery('addUint32_0',
    e.addUint32(
      e.data(d.uint32(2_147_483_648).toDataConstructor()),
      e.data(d.uint32(2_147_483_647).toDataConstructor())
    )
  )

  t.is(response, 4_294_967_295)
})

test('addUint64', async t => {
  const response = await t.context.exampleQuery('addUint64_0',
    e.addUint64(
      e.data(d.uint64(1).toDataConstructor()),
      e.data(d.uint64(Number.MAX_SAFE_INTEGER - 1).toDataConstructor())
    )
  )

  t.is(response, Number.MAX_SAFE_INTEGER)
})

// Substraction
// ============

test('subFloat', async t => {
  const response = await t.context.exampleQuery('subFloat_0',
    e.subFloat(
      e.data(d.float(0.5).toDataConstructor()),
      e.data(d.float(0.5).toDataConstructor())
    )
  )

  t.is(response, 0)
})

test('subInt8', async t => {
  const response = await t.context.exampleQuery('subInt8_0',
    e.subInt8(
      e.data(d.int8(-128).toDataConstructor()),
      e.data(d.int8(127).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('subInt16', async t => {
  const response = await t.context.exampleQuery('subInt16_0',
    e.subInt16(
      e.data(d.int16(-32_768).toDataConstructor()),
      e.data(d.int16(32_767).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('subInt32', async t => {
  const response = await t.context.exampleQuery('subInt32_0',
    e.subInt32(
      e.data(d.int32(-2_147_483_648).toDataConstructor()),
      e.data(d.int32(2_147_483_647).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('subInt64', async t => {
  const response = await t.context.exampleQuery('subInt64_0',
    e.subInt64(
      e.data(d.int64(0).toDataConstructor()),
      e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor())
    )
  )

  t.is(response, -Number.MAX_SAFE_INTEGER)
})

test('subUint8', async t => {
  const response = await t.context.exampleQuery('subUint8_0',
    e.subUint8(
      e.data(d.uint8(128).toDataConstructor()),
      e.data(d.uint8(127).toDataConstructor())
    )
  )

  t.is(response, 1)
})

test('subUint16', async t => {
  const response = await t.context.exampleQuery('subUint16_0',
    e.subUint16(
      e.data(d.uint16(32_768).toDataConstructor()),
      e.data(d.uint16(32_767).toDataConstructor()),
    )
  )

  t.is(response, 1)
})

test('subUint32', async t => {
  const response = await t.context.exampleQuery('subUint32_0',
    e.subUint32(
      e.data(d.uint32(2_147_483_648).toDataConstructor()),
      e.data(d.uint32(2_147_483_647).toDataConstructor()),
    )
  )

  t.is(response, 1)
})

test('subUint64', async t => {
  const response = await t.context.exampleQuery('subUint64_0',
    e.subUint64(
      e.data(d.uint64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
      e.data(d.uint64(Number.MAX_SAFE_INTEGER - 1).toDataConstructor())
    )
  )

  t.is(response, 1)
})

// Multiplication
// ==============

test('divFloat', async t => {
  const response = await t.context.exampleQuery('divFloat_0',
    e.divFloat(
      e.data(d.float(1).toDataConstructor()),
      e.data(d.float(2).toDataConstructor()),
    )
  )

  t.is(response, 0.5)
})

test('divInt8', async t => {
  const response = await t.context.exampleQuery('divInt8_0',
    e.divInt8(
      e.data(d.int8(127).toDataConstructor()),
      e.data(d.int8(2).toDataConstructor()),
    )
  )

  t.is(response, 63)
})

test('divInt16', async t => {
  const response = await t.context.exampleQuery('divInt16_0',
    e.divInt16(
      e.data(d.int16(32_767).toDataConstructor()),
      e.data(d.int16(2).toDataConstructor()),
    )
  )

  t.is(response, 16_383)
})

test('divInt32', async t => {
  const response = await t.context.exampleQuery('divInt32_0',
    e.divInt32(
      e.data(d.int32(2_147_483_647).toDataConstructor()),
      e.data(d.int32(2).toDataConstructor()),
    )
  )

  t.is(response, 1_073_741_823)
})

test('divInt64', async t => {
  const response = await t.context.exampleQuery('divInt64_0',
    e.divInt64(
      e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
      e.data(d.int64(2).toDataConstructor()),
    )
  )

  t.is(response, Math.floor(Number.MAX_SAFE_INTEGER / 2))
})

test('divUint8', async t => {
  const response = await t.context.exampleQuery('divUint8_0',
    e.divUint8(
      e.data(d.uint8(255).toDataConstructor()),
      e.data(d.uint8(2).toDataConstructor()),
    )
  )

  t.is(response, 127)
})

test('divUint16', async t => {
  const response = await t.context.exampleQuery('divUint16_0',
    e.divUint16(
      e.data(d.uint16(65_535).toDataConstructor()),
      e.data(d.uint16(2).toDataConstructor()),
    )
  )

  t.is(response, 32_767)
})

test('divUint32', async t => {
  const response = await t.context.exampleQuery('divUint32_0',
    e.divUint32(
      e.data(d.uint32(4_294_967_295).toDataConstructor()),
      e.data(d.uint32(2).toDataConstructor()),
    )
  )

  t.is(response, 2_147_483_647)
})

test('divUint64', async t => {
  const response = await t.context.exampleQuery('divUint64_0',
    e.divUint64(
      e.data(d.uint64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
      e.data(d.uint64(2).toDataConstructor()),
    )
  )

  t.is(response, Math.floor(Number.MAX_SAFE_INTEGER / 2))
})

// Multiplication
// ==============

test('mulFloat', async t => {
  const response = await t.context.exampleQuery('mulFloat_0',
    e.mulFloat(
      e.data(d.float(0.5).toDataConstructor()),
      e.data(d.float(2).toDataConstructor()),
    )
  )

  t.is(response, 1)
})

test('mulInt8', async t => {
  const response = await t.context.exampleQuery('mulInt8_0',
    e.mulInt8(
      e.data(d.int8(63).toDataConstructor()),
      e.data(d.int8(2).toDataConstructor()),
    )
  )

  t.is(response, 127 - 1)
})

test('mulInt16', async t => {
  const response = await t.context.exampleQuery('mulInt16_0',
    e.mulInt16(
      e.data(d.int16(16_383).toDataConstructor()),
      e.data(d.int16(2).toDataConstructor()),
    )
  )

  t.is(response, 32_767 - 1)
})

test('mulInt32', async t => {
  const response = await t.context.exampleQuery('mulInt32_0',
    e.mulInt32(
      e.data(d.int32(1_073_741_823).toDataConstructor()),
      e.data(d.int32(2).toDataConstructor()),
    )
  )

  t.is(response, 2_147_483_647 - 1)
})

test('mulInt64', async t => {
  const response = await t.context.exampleQuery('mulInt64_0',
    e.mulInt64(
      e.data(d.int64(Math.floor(Number.MAX_SAFE_INTEGER / 2)).toDataConstructor()),
      e.data(d.int64(2).toDataConstructor()),
    )
  )

  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})

test('mulUint8', async t => {
  const response = await t.context.exampleQuery('mulUint8_0',
    e.mulUint8(
      e.data(d.uint8(127).toDataConstructor()),
      e.data(d.uint8(2).toDataConstructor()),
    )
  )

  t.is(response, 255 - 1)
})

test('mulUint16', async t => {
  const response = await t.context.exampleQuery('mulUint16_0',
    e.mulUint16(
      e.data(d.uint16(32_767).toDataConstructor()),
      e.data(d.uint16(2).toDataConstructor()),
    )
  )

  t.is(response, 65_535 - 1)
})

test('mulUint32', async t => {
  const response = await t.context.exampleQuery('mulUint32_0',
    e.mulUint32(
      e.data(d.uint32(2_147_483_647).toDataConstructor()),
      e.data(d.uint32(2).toDataConstructor()),
    )
  )

  t.is(response, 4_294_967_295 - 1)
})

test('mulUint64', async t => {
  const response = await t.context.exampleQuery('mulUint64_0',
    e.mulUint64(
      e.data(d.uint64(Math.floor(Number.MAX_SAFE_INTEGER / 2)).toDataConstructor()),
      e.data(d.uint64(2).toDataConstructor()),
    )
  )
  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})

// Less Than
// =========

test('ltFloat', async t => {
  const response = await t.context.exampleQuery('ltFloat_0',
    e.ltFloat(
      e.data(d.float(Number.MIN_VALUE).toDataConstructor()),
      e.data(d.float(Number.MAX_VALUE).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltInt8', async t => {
  const response = await t.context.exampleQuery('ltInt8_0',
    e.ltInt8(
      e.data(d.int8(-128).toDataConstructor()),
      e.data(d.int8(127).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltInt16', async t => {
  const response = await t.context.exampleQuery('ltInt16_0',
    e.ltInt16(
      e.data(d.int16(-32_768).toDataConstructor()),
      e.data(d.int16(32_767).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltInt32', async t => {
  const response = await t.context.exampleQuery('ltInt32_0',
    e.ltInt32(
      e.data(d.int32(-2_147_483_648).toDataConstructor()),
      e.data(d.int32(2_147_483_647).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltInt64', async t => {
  const response = await t.context.exampleQuery('ltInt64_0',
    e.ltInt64(
      e.data(d.int64(Number.MIN_SAFE_INTEGER).toDataConstructor()),
      e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltUint8', async t => {
  const response = await t.context.exampleQuery('ltUint8_0',
    e.ltUint8(
      e.data(d.uint8(0).toDataConstructor()),
      e.data(d.uint8(255).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltUint16', async t => {
  const response = await t.context.exampleQuery('ltUint16_0',
    e.ltUint16(
      e.data(d.uint16(0).toDataConstructor()),
      e.data(d.uint16(65_535).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltUint32', async t => {
  const response = await t.context.exampleQuery('ltUint32_0',
    e.ltUint32(
      e.data(d.uint32(0).toDataConstructor()),
      e.data(d.uint32(4_294_967_295).toDataConstructor()),
    )
  )

  t.is(response, true)
})

test('ltUint64', async t => {
  const response = await t.context.exampleQuery('ltUint64_0',
    e.ltUint64(
      e.data(d.uint64(0).toDataConstructor()),
      e.data(d.uint64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
    )
  )

  t.is(response, true)
})

// Greater Than
// ============

test('gtFloat', async t => {
  const response = await t.context.exampleQuery('gtFloat_0',
    e.gtFloat(
      e.data(d.float(Number.MIN_VALUE).toDataConstructor()),
      e.data(d.float(Number.MAX_VALUE).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtInt8', async t => {
  const response = await t.context.exampleQuery('gtInt8_0',
    e.gtInt8(
      e.data(d.int8(-128).toDataConstructor()),
      e.data(d.int8(127).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtInt16', async t => {
  const response = await t.context.exampleQuery('gtInt16_0',
    e.gtInt16(
      e.data(d.int16(-32_768).toDataConstructor()),
      e.data(d.int16(32_767).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtInt32', async t => {
  const response = await t.context.exampleQuery('gtInt32_0',
    e.gtInt32(
      e.data(d.int32(-2_147_483_648).toDataConstructor()),
      e.data(d.int32(2_147_483_647).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtInt64', async t => {
  const response = await t.context.exampleQuery('gtInt64_0',
    e.gtInt64(
      e.data(d.int64(Number.MIN_SAFE_INTEGER).toDataConstructor()),
      e.data(d.int64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtUint8', async t => {
  const response = await t.context.exampleQuery('gtUint8_0',
    e.gtUint8(
      e.data(d.uint8(0).toDataConstructor()),
      e.data(d.uint8(255).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtUint16', async t => {
  const response = await t.context.exampleQuery('gtUint16_0',
    e.gtUint16(
      e.data(d.uint16(0).toDataConstructor()),
      e.data(d.uint16(65_535).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtUint32', async t => {
  const response = await t.context.exampleQuery('gtUint32_0',
    e.gtUint32(
      e.data(d.uint32(0).toDataConstructor()),
      e.data(d.uint32(4_294_967_295).toDataConstructor()),
    )
  )

  t.is(response, false)
})

test('gtUint64', async t => {
  const response = await t.context.exampleQuery('gtUint64_0',
    e.gtUint64(
      e.data(d.uint64(0).toDataConstructor()),
      e.data(d.uint64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
    )
  )

  t.is(response, false)
})

// Conversion
// ==========

test('toFloat', async t => {
  const response = await t.context.exampleQuery('toFloat_0',
    e.toFloat(
      e.data(d.uint64(Number.MAX_SAFE_INTEGER).toDataConstructor()),
    )
  )

  t.is(response, Number.MAX_SAFE_INTEGER)
})

test('toInt8', async t => {
  const response = await t.context.exampleQuery('toInt8_0',
    e.toInt8(
      e.data(d.float(127.5).toDataConstructor()),
    )
  )

  t.is(response, 127)
})

test('toInt16', async t => {
  const response = await t.context.exampleQuery('toInt16_0',
    e.toInt16(
      e.data(d.float(32_767.5).toDataConstructor()),
    )
  )

  t.is(response, 32_767)
})

test('toInt32', async t => {
  const response = await t.context.exampleQuery('toInt32_0',
    e.toInt32(
      e.data(d.float(2_147_483_647.5).toDataConstructor()),
    )
  )

  t.is(response, 2_147_483_647)
})

test('toInt64', async t => {
  const response = await t.context.exampleQuery('toInt64_0',
    e.toInt64(
      e.data(d.float(Number.MAX_SAFE_INTEGER - 0.5).toDataConstructor()),
    )
  )

  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})

test('toUint8', async t => {
  const response = await t.context.exampleQuery('toUint8_0',
    e.toUint8(
      e.data(d.float(127.5).toDataConstructor()),
    )
  )

  t.is(response, 127)
})

test('toUint16', async t => {
  const response = await t.context.exampleQuery('toUint16_0',
    e.toUint16(
      e.data(d.float(32_767.5).toDataConstructor()),
    )
  )

  t.is(response, 32_767)
})

test('toUint32', async t => {
  const response = await t.context.exampleQuery('toUint32_0',
    e.toUint32(
      e.data(d.float(2_147_483_647.5).toDataConstructor()),
    )
  )

  t.is(response, 2_147_483_647)
})

test('toUint64', async t => {
  const response = await t.context.exampleQuery('toUint64_0',
    e.toUint64(
      e.data(d.float(Number.MAX_SAFE_INTEGER - 0.5).toDataConstructor()),
    )
  )

  t.is(response, Number.MAX_SAFE_INTEGER - 1)
})
