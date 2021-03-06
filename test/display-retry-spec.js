const execa = require('execa')
const expect = require('chai').expect
const debug = require('debug')('test')
const isCI = require('is-ci')

describe('environment with invalid DISPLAY', () => {
  it('retries cypress verify', () => {
    return execa
      .shell('$(npm bin)/cypress verify', {
        env: {
          DEBUG: 'cypress:cli',
          DISPLAY: 'wrong-display-value'
        }
      })
      .then(({ stdout, code, stderr }) => {
        debug('exit code %d', code)
        debug('stderr\n%s', stderr)
        debug('stdout\n%s', stdout)

        expect(code, 'finished with 0').to.equal(0)
        expect(stderr, 'no error output').to.equal('')
        expect(stdout, 'includes warning').to.include(
          'Warning: Cypress failed to start'
        )
        expect(stdout, 'includes incorrect display').to.include(
          'wrong-display-value'
        )
        if (!isCI) {
          // we are displaying user message if NOT in CI mode
          expect(stdout, 'includes verified message').to.include(
            'Verified Cypress!'
          )
        }
      })
  })

  it('retries cypress run', () => {
    return execa
      .shell('$(npm bin)/cypress run', {
        env: {
          DEBUG: 'cypress:cli',
          DISPLAY: 'wrong-display-value'
        }
      })
      .then(({ stdout, code, stderr }) => {
        debug('exit code %d', code)
        debug('stderr\n%s', stderr)
        debug('stdout\n%s', stdout)

        expect(code, 'finished with 0').to.equal(0)
        expect(stdout, 'includes warning').to.include(
          'Warning: Cypress failed to start'
        )
        expect(stdout, 'includes incorrect display').to.include(
          'wrong-display-value'
        )
        expect(stdout, 'includes verified message').to.include(
          'Cypress will attempt to fix the problem and rerun'
        )
      })
  })
})
