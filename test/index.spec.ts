import { parse } from 'src/index'
import { trailingLeading, parseParams } from 'src/util'

test('trims leading and trailing slashes', () => {
  expect(trailingLeading('/foo/bar')).toBe('foo/bar')
  expect(trailingLeading('foo/bar/')).toBe('foo/bar')
  expect(trailingLeading('/foo/bar/')).toBe('foo/bar')
})

test('parses param names and properties', () => {
  expect(
    parseParams([ 'foo', 'bar', 'baz' ]),
  ).toEqual([ null, null, null ])

  expect(
    parseParams(
      [ 'foo', ':bar', ':baz?', ':wild*', ':optwild*?', 'foo', ':bar2', ':baz2?', ':wild2*', ':optwild2?*', 'foo' ],
    ),
  ).toEqual([
    null,
    { name: 'bar', optional: false, wild: false },
    { name: 'baz', optional: true, wild: false },
    { name: 'wild', optional: false, wild: true },
    { name: 'optwild', optional: true, wild: true },
    null,
    { name: 'bar2', optional: false, wild: false },
    { name: 'baz2', optional: true, wild: false },
    { name: 'wild2', optional: false, wild: true },
    { name: 'optwild2', optional: true, wild: true },
    null,
  ])
})

test('matches inputs with routes', () => {
  expect(parse('foo')('foo')).toEqual({})
  expect(parse('foo')('bar')).toBe(null)
  expect(parse('foo')('foo/bar')).toBe(null)

  expect(parse(':foo')('foo')).toEqual({ foo: 'foo' })
  expect(parse(':foo')('')).toBe(null)
  expect(parse(':foo')('foo/bar')).toBe(null)

  expect(parse(':foo?')('bar')).toEqual({ foo: 'bar' })
  expect(parse(':foo?')('')).toEqual({ foo: null })
  expect(parse(':foo?')('foo/bar')).toEqual(null)

  expect(parse(':foo*')('bar')).toEqual({ foo: [ 'bar' ] })
  expect(parse(':foo*')('foo/bar')).toEqual({ foo: [ 'foo', 'bar' ] })
  expect(parse(':foo*')('')).toEqual(null)

  expect(parse(':foo*?')('bar')).toEqual({ foo: [ 'bar' ] })
  expect(parse(':foo*?')('foo/bar')).toEqual({ foo: [ 'foo', 'bar' ] })
  expect(parse(':foo*?')('')).toEqual({ foo: [] })

  expect(parse('foo/bar')('foo/bar')).toEqual({})
  expect(parse('foo/bar')('')).toEqual(null)
  expect(parse('foo/bar')('foo')).toEqual(null)
  expect(parse('foo/bar')('bar/bar')).toEqual(null)
  expect(parse('foo/bar')('foo/bar/baz')).toEqual(null)

  expect(parse('foo/:bar')('foo/bar')).toEqual({ bar: 'bar' })
  expect(parse('foo/:bar')('')).toEqual(null)
  expect(parse('foo/:bar')('bar')).toBe(null)
  expect(parse('foo/:bar')('bar/foo')).toBe(null)
  expect(parse('foo/:bar')('foo')).toBe(null)
  expect(parse('foo/:bar')('foo/bar/baz')).toEqual(null)

  expect(parse('foo/:bar?')('foo/bar')).toEqual({ bar: 'bar' })
  expect(parse('foo/:bar?')('')).toEqual(null)
  expect(parse('foo/:bar?')('bar')).toEqual(null)
  expect(parse('foo/:bar?')('bar/foo')).toBe(null)
  expect(parse('foo/:bar?')('foo')).toEqual({ bar: null })
  expect(parse('foo/:bar?')('foo/bar/baz')).toEqual(null)

  expect(parse('foo/:bar*')('foo/bar')).toEqual({ bar: [ 'bar' ] })
  expect(parse('foo/:bar*')('')).toEqual(null)
  expect(parse('foo/:bar*')('bar')).toEqual(null)
  expect(parse('foo/:bar*')('bar/foo')).toEqual(null)
  expect(parse('foo/:bar*')('foo')).toEqual(null)
  expect(parse('foo/:bar*')('foo/bar/baz')).toEqual({ bar: [ 'bar', 'baz' ] })

  expect(parse('foo/:bar*?')('foo/bar')).toEqual({ bar: [ 'bar' ] })
  expect(parse('foo/:bar*?')('')).toEqual(null)
  expect(parse('foo/:bar*?')('bar')).toEqual(null)
  expect(parse('foo/:bar*?')('bar/foo')).toEqual(null)
  expect(parse('foo/:bar*?')('foo')).toEqual({ bar: [] })
  expect(parse('foo/:bar*?')('foo/bar/baz')).toEqual({ bar: [ 'bar', 'baz' ] })

  expect(parse(':foo/bar')('foo/bar')).toEqual({ foo: 'foo' })
  expect(parse(':foo/bar')('')).toEqual(null)
  expect(parse(':foo/bar')('bar')).toEqual(null)
  expect(parse(':foo/bar')('bar/foo')).toEqual(null)
  expect(parse(':foo/bar')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo/:bar')('foo/bar')).toEqual({ foo: 'foo', bar: 'bar' })
  expect(parse(':foo/:bar')('')).toEqual(null)
  expect(parse(':foo/:bar')('foo')).toBe(null)
  expect(parse(':foo/:bar')('foo/bar/baz')).toBe(null)

  expect(parse(':foo/:bar?')('foo/bar')).toEqual({ foo: 'foo', bar: 'bar' })
  expect(parse(':foo/:bar?')('')).toEqual(null)
  expect(parse(':foo/:bar?')('foo')).toEqual({ foo: 'foo', bar: null })
  expect(parse(':foo/:bar?')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo/:bar*')('foo/bar')).toEqual({ foo: 'foo', bar: [ 'bar' ] })
  expect(parse(':foo/:bar*')('')).toEqual(null)
  expect(parse(':foo/:bar*')('foo')).toEqual(null)
  expect(parse(':foo/:bar*')('foo/bar/baz')).toEqual({ foo: 'foo', bar: [ 'bar', 'baz' ] })

  expect(parse(':foo/:bar*?')('foo/bar')).toEqual({ foo: 'foo', bar: [ 'bar' ] })
  expect(parse(':foo/:bar*?')('')).toEqual(null)
  expect(parse(':foo/:bar*?')('foo')).toEqual({ foo: 'foo', bar: [] })
  expect(parse(':foo/:bar*?')('foo/bar/baz')).toEqual({ foo: 'foo', bar: [ 'bar', 'baz' ] })

  expect(parse(':foo?/bar')('foo/bar')).toEqual({ foo: 'foo' })
  expect(parse(':foo?/bar')('')).toEqual(null)
  expect(parse(':foo?/bar')('bar')).toEqual(null)
  expect(parse(':foo?/bar')('bar/foo')).toEqual(null)
  expect(parse(':foo?/bar')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo?/:bar')('foo/bar')).toEqual({ foo: 'foo', bar: 'bar' })
  expect(parse(':foo?/:bar')('')).toEqual(null)
  expect(parse(':foo?/:bar')('foo')).toEqual(null)
  expect(parse(':foo?/:bar')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo?/:bar?')('foo/bar')).toEqual({ foo: 'foo', bar: 'bar' })
  expect(parse(':foo?/:bar?')('')).toEqual({ foo: null, bar: null })
  expect(parse(':foo?/:bar?')('foo')).toEqual({ foo: 'foo', bar: null })
  expect(parse(':foo?/:bar?')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo?/:bar*')('foo/bar')).toEqual({ foo: 'foo', bar: [ 'bar' ] })
  expect(parse(':foo?/:bar*')('')).toEqual(null)
  expect(parse(':foo?/:bar*')('foo')).toEqual(null)
  expect(parse(':foo?/:bar*')('foo/bar/baz')).toEqual({ foo: 'foo', bar: [ 'bar', 'baz' ] })

  expect(parse(':foo?/:bar*?')('foo/bar')).toEqual({ foo: 'foo', bar: [ 'bar' ] })
  expect(parse(':foo?/:bar*?')('')).toEqual({ foo: null, bar: [] })
  expect(parse(':foo?/:bar*?')('foo')).toEqual({ foo: 'foo', bar: [] })
  expect(parse(':foo?/:bar*?')('foo/bar/baz')).toEqual({ foo: 'foo', bar: [ 'bar', 'baz' ] })

  expect(parse(':foo*/bar')('foo/bar')).toEqual({ foo: [ 'foo' ] })
  expect(parse(':foo*/bar')('foo/baz/bar')).toEqual({ foo: [ 'foo', 'baz' ] })
  expect(parse(':foo*/bar')('foo/bar/bar/bar')).toEqual({ foo: [ 'foo', 'bar', 'bar' ] })
  expect(parse(':foo*/bar')('')).toEqual(null)
  expect(parse(':foo*/bar')('bar')).toEqual(null)
  expect(parse(':foo*/bar')('bar/foo')).toEqual(null)
  expect(parse(':foo*/bar')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo*/:bar')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: 'bar' })
  expect(parse(':foo*/:bar')('foo/baz/bar')).toEqual({ foo: [ 'foo', 'baz' ], bar: 'bar' })
  expect(parse(':foo*/:bar')('')).toEqual(null)
  expect(parse(':foo*/:bar')('bar')).toEqual(null)

  expect(parse(':foo*/:bar?')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: 'bar' })
  expect(parse(':foo*/:bar?')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: 'baz' })
  expect(parse(':foo*/:bar?')('')).toEqual(null)
  expect(parse(':foo*/:bar?')('bar')).toEqual({ foo: [ 'bar' ], bar: null })

  expect(parse(':foo*/:bar*')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: [ 'bar' ] })
  expect(parse(':foo*/:bar*')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: [ 'baz' ] })
  expect(parse(':foo*/:bar*')('')).toEqual(null)
  expect(parse(':foo*/:bar*')('bar')).toEqual(null)

  expect(parse(':foo*/:bar*?')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: [ 'bar' ] })
  expect(parse(':foo*/:bar*?')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: [ 'baz' ] })
  expect(parse(':foo*/:bar*?')('')).toEqual(null)
  expect(parse(':foo*/:bar*?')('bar')).toEqual({ foo: [ 'bar' ], bar: [] })

  expect(parse(':foo*?/bar')('foo/bar')).toEqual({ foo: [ 'foo' ] })
  expect(parse(':foo*?/bar')('foo/baz/bar')).toEqual({ foo: [ 'foo', 'baz' ] })
  expect(parse(':foo*?/bar')('foo/bar/bar/bar')).toEqual({ foo: [ 'foo', 'bar', 'bar' ] })
  expect(parse(':foo*?/bar')('')).toEqual(null)
  expect(parse(':foo*?/bar')('bar')).toEqual({ foo: [] })
  expect(parse(':foo*?/bar')('bar/foo')).toEqual(null)
  expect(parse(':foo*?/bar')('foo/bar/baz')).toEqual(null)

  expect(parse(':foo*?/:bar')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: 'bar' })
  expect(parse(':foo*?/:bar')('foo/baz/bar')).toEqual({ foo: [ 'foo', 'baz' ], bar: 'bar' })
  expect(parse(':foo*?/:bar')('')).toEqual(null)
  expect(parse(':foo*?/:bar')('bar')).toEqual(null)

  expect(parse(':foo*?/:bar?')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: 'bar' })
  expect(parse(':foo*?/:bar?')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: 'baz' })
  expect(parse(':foo*?/:bar?')('')).toEqual({ foo: [], bar: null })
  expect(parse(':foo*?/:bar?')('bar')).toEqual({ foo: [ 'bar' ], bar: null })

  expect(parse(':foo*?/:bar*')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: [ 'bar' ] })
  expect(parse(':foo*?/:bar*')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: [ 'baz' ] })
  expect(parse(':foo*?/:bar*')('')).toEqual(null)
  expect(parse(':foo*?/:bar*')('bar')).toEqual(null)

  expect(parse(':foo*?/:bar*?')('foo/bar')).toEqual({ foo: [ 'foo' ], bar: [ 'bar' ] })
  expect(parse(':foo*?/:bar*?')('foo/bar/baz')).toEqual({ foo: [ 'foo', 'bar' ], bar: [ 'baz' ] })
  expect(parse(':foo*?/:bar*?')('')).toEqual({ foo: [], bar: [] })
  expect(parse(':foo*?/:bar*?')('bar')).toEqual({ foo: [ 'bar' ], bar: [] })

  // some complex routes
  expect(parse('foo/:bar/:baz?/:wild*')('foo/bar/baz/wild/wild/wild')).toEqual({ bar: 'bar', baz: 'baz', wild: [ 'wild', 'wild', 'wild' ] })
  expect(parse('foo/:bar/:baz?/:wild*')('')).toEqual(null)
  expect(parse('foo/:bar/:baz?/:wild*')('bar/bar/baz/wild')).toEqual(null)
  expect(parse(':wild*/foo/:bar/:baz?')('wild/wild/wild/foo/bar/baz')).toEqual({ wild: [ 'wild', 'wild', 'wild' ], bar: 'bar', baz: 'baz' })
  expect(parse(':wild*/foo/:bar/:baz?')('wild/foo/bar/baz')).toEqual({ wild: [ 'wild' ], bar: 'bar', baz: 'baz' })
  expect(parse(':wild*/foo/:bar/:baz?')('foo/bar/baz')).toEqual(null)
  expect(parse(':wild*/foo/:bar/:baz?')('wild/wild/foo/bar')).toEqual({ wild: [ 'wild', 'wild' ], bar: 'bar', baz: null })
  expect(parse(':wild*/foo/bar/:baz?')('wild/wild/foo/bar')).toEqual({ wild: [ 'wild', 'wild' ], baz: null })
  expect(parse(':wild*/foo/:bar*')('wild/wild/foo/bar/wild')).toEqual({ wild: [ 'wild', 'wild' ], bar: [ 'bar', 'wild' ] })
  expect(parse(':wild*/:foo/:bar*')('wild/wild/foo/bar/wild')).toEqual({ wild: [ 'wild', 'wild', 'foo' ], foo: 'bar', bar: [ 'wild' ] })
  expect(parse(':wild*/foo/:bar?/static/:baz*')('wild/wild/foo/bar/static/baz/baz')).toEqual({ wild: [ 'wild', 'wild' ], bar: 'bar', baz: [ 'baz', 'baz' ] })
  expect(parse(':wild*/foo/:bar?/static/:baz*')('wild/wild/foo/bar/sttc/baz/baz')).toEqual(null)
  expect(parse(':wild*/foo/:bar?/static/:baz?/:wild2*')('wild/wild/foo/bar/static')).toEqual(null)
  expect(parse(':wild*/foo/:bar*?/static/:baz?/:wild2*?/static2/:wild3*/:last/actuallast')('wild/wild/foo/bar/bar/bar/static/baz/wild2/wild2/static2/wild3/wild3/wild3/last/actuallast')).toEqual({ wild: [ 'wild', 'wild' ], bar: [ 'bar', 'bar', 'bar' ], baz: 'baz', wild2: [ 'wild2', 'wild2' ], wild3: [ 'wild3', 'wild3', 'wild3' ], last: 'last' })
})
