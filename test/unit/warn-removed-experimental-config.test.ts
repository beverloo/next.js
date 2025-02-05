import { warnOptionHasBeenMovedOutOfExperimental } from 'next/dist/server/config'

describe('warnOptionHasBeenMovedOutOfExperimental', () => {
  let spy: jest.SpyInstance
  beforeAll(() => {
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should not log warning message without experimental config', () => {
    warnOptionHasBeenMovedOutOfExperimental(
      {},
      'skipTrailingSlashRedirect',
      'skipTrailingSlashRedirect',
      'next.config.js'
    )

    warnOptionHasBeenMovedOutOfExperimental(
      {
        experimental: {},
      },
      'skipTrailingSlashRedirect',
      'skipTrailingSlashRedirect',
      'next.config.js'
    )

    expect(spy).not.toBeCalled()
  })

  it('should log warning message with removed experimental config', () => {
    warnOptionHasBeenMovedOutOfExperimental(
      {
        experimental: {
          skipTrailingSlashRedirect: true,
        },
      } as any,
      'skipTrailingSlashRedirect',
      'skipTrailingSlashRedirect',
      'next.config.js'
    )

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('⚠'),
      '`skipTrailingSlashRedirect` has been moved out of `experimental`. Please update your next.config.js file accordingly.'
    )
  })

  it('should log warning message with removed experimental config - complex key', () => {
    warnOptionHasBeenMovedOutOfExperimental(
      {
        experimental: {
          relay: true,
        },
      } as any,
      'relay',
      'compiler.relay',
      'next.config.js'
    )

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('⚠'),
      '`relay` has been moved out of `experimental` and into `compiler.relay`. Please update your next.config.js file accordingly.'
    )
  })

  it('should update removed experimental config into new config', () => {
    const config = {
      experimental: {
        skipTrailingSlashRedirect: true,
      },
    } as any
    warnOptionHasBeenMovedOutOfExperimental(
      config,
      'skipTrailingSlashRedirect',
      'skipTrailingSlashRedirect',
      'next.config.js'
    )

    expect(config.experimental.skipTrailingSlashRedirect).toBe(true)
    expect(config.skipTrailingSlashRedirect).toBe(true)
  })

  it('should update removed experimental config into new config - complex key', () => {
    const config = {
      experimental: {
        foo: 'bar',
      },
    } as any
    warnOptionHasBeenMovedOutOfExperimental(
      config,
      'foo',
      'deep.prop.baz',
      'next.config.js'
    )

    expect(config.experimental.foo).toBe('bar')
    expect(config.deep.prop.baz).toBe('bar')
  })
})
