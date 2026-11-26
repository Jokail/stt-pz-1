describe('Test suite for testing lib.js', () => {
  describe('Test suite for testing sum function', () => {
    it('should return sum of two numbers', () => {
      assert.equal(sum(1, 2), 3)
      assert.equal(sum(-10, 5), -5)
      assert.equal(sum(-10, 10), 0)
    });

    it('should return NaN if one parameter is skipped', () => {
      assert.isNaN(sum(1))
      assert.isNaN(sum())
    });

    it('should convert string to number if input parameters is string', () => {
      assert.equal(sum('5', '1'), 6)
      assert.equal(sum(10, '1'), 11)
      assert.equal(sum('25', 5), 30)
    });

    it('should return NaN if parameter is not a numeric string', () => {
      assert.isNaN(sum('abc', 1))
      assert.isNaN(sum(1, {}))
    });

    it('should work with floating point numbers', () => {
      assert.equal(sum(1.5, 2.5), 4)
      assert.equal(sum('0.1', '0.2').toFixed(1), '0.3')
    });
  });

  describe('Test suite for testing pow function', () => {
    it('should raising x to the n power', () => {
      assert.equal(pow(2, 3), 8)
      assert.equal(pow(3, 2), 9)
      assert.equal(pow(5, 1), 5)
      assert.equal(pow(10, 4), 10000)
    });

    it('should return 1 when power is zero', () => {
      assert.equal(pow(2, 0), 1)
      assert.equal(pow(0, 0), 1)
    });

    it('should return 0 when base is zero and power is positive', () => {
      assert.equal(pow(0, 5), 0)
    });

    it('should keep the sign rules for negative base', () => {
      assert.equal(pow(-2, 2), 4)
      assert.equal(pow(-2, 3), -8)
    });

    it('should return 1 for negative power because the loop is never executed', () => {
      assert.equal(pow(2, -1), 1)
      assert.equal(pow(2, -10), 1)
    });

    it('should return a number type', () => {
      assert.isNumber(pow(2, 3))
    });
  });

  describe('Test suite for testing factorial function', () => {
    it('should return 1 for 0 and 1', () => {
      assert.equal(factorial(0), 1)
      assert.equal(factorial(1), 1)
    });

    it('should calculate factorial of a positive number', () => {
      assert.equal(factorial(3), 6)
      assert.equal(factorial(5), 120)
      assert.equal(factorial(10), 3628800)
    });

    it('should grow as n * factorial(n - 1)', () => {
      assert.equal(factorial(6), 6 * factorial(5))
    });
  });

  describe('Test suite for testing fibonacci function', () => {
    it('should return 1 for the first two members of the sequence', () => {
      assert.equal(fibonacci(1), 1)
      assert.equal(fibonacci(2), 1)
    });

    it('should calculate the n-th member of the sequence', () => {
      assert.equal(fibonacci(3), 2)
      assert.equal(fibonacci(4), 3)
      assert.equal(fibonacci(5), 5)
      assert.equal(fibonacci(6), 8)
      assert.equal(fibonacci(10), 55)
    });

    it('should satisfy the fibonacci rule f(n) = f(n-1) + f(n-2)', () => {
      assert.equal(fibonacci(9), fibonacci(8) + fibonacci(7))
    });
  });

  describe('Test suite for testing removeByName function', () => {
    it('should remove some element from array', () => {
      assert.deepEqual(removeByName(['Alice', 'Bob', 'Carol'], 'Bob'), ['Alice', 'Carol'])
      assert.deepEqual(removeByName(['Alice'], 'Alice'), [])
    });

    it('should not remove element from array', () => {
      assert.deepEqual(removeByName(['Alice', 'Bob'], 'Dave'), ['Alice', 'Bob'])
      assert.deepEqual(removeByName([], 'Dave'), [])
    });

    it('should remove only the first occurrence of the name', () => {
      assert.deepEqual(removeByName(['Bob', 'Alice', 'Bob'], 'Bob'), ['Alice', 'Bob'])
    });

    it('should not mutate the source array', () => {
      const list = ['Alice', 'Bob'];
      const result = removeByName(list, 'Bob');

      assert.deepEqual(list, ['Alice', 'Bob'])
      assert.notStrictEqual(result, list)
    });

    it('should be case sensitive', () => {
      assert.deepEqual(removeByName(['Alice', 'Bob'], 'bob'), ['Alice', 'Bob'])
    });
  });

  describe('Test suite for testing makeCounter function', () => {
    it('should return a function', () => {
      assert.isFunction(makeCounter(0))
    });

    it('should return the start value on the first call', () => {
      const counter = makeCounter(5);

      assert.equal(counter(), 5)
    });

    it('should increase the value by one on every next call', () => {
      const counter = makeCounter(0);

      assert.equal(counter(), 0)
      assert.equal(counter(), 1)
      assert.equal(counter(), 2)
    });

    it('should keep independent state for every created counter', () => {
      const first = makeCounter(0);
      const second = makeCounter(100);

      assert.equal(first(), 0)
      assert.equal(second(), 100)
      assert.equal(first(), 1)
      assert.equal(second(), 101)
    });
  });

  describe('Test suite for testing getAsyncTimerId function', () => {
    it('should return undefined because the id is assigned asynchronously', () => {
      assert.isUndefined(getAsyncTimerId(10))
    });

    it('should not throw for a zero delay', () => {
      assert.doesNotThrow(() => getAsyncTimerId(0))
    });
  });

  describe('Test suite for testing asyncMultiply function', () => {
    it('should return a promise', () => {
      assert.instanceOf(asyncMultiply(1), Promise)
    });

    it('should resolve with the doubled argument', async function () {
      this.timeout(5000);

      assert.equal(await asyncMultiply(2), 4)
    });

    it('should resolve with 0 for 0', async function () {
      this.timeout(5000);

      assert.equal(await asyncMultiply(0), 0)
    });

    it('should resolve with a negative value for a negative argument', async function () {
      this.timeout(5000);

      assert.equal(await asyncMultiply(-3), -6)
    });
  });

  describe('Test suite for testing httpGet function', () => {
    const originalXMLHttpRequest = window.XMLHttpRequest;

    // A minimal XMLHttpRequest stub, so that the tests stay fast
    // and do not depend on a real network connection
    function createXHRStub(options) {
      return function FakeXMLHttpRequest() {
        this.open = function (method, url) {
          this.method = method;
          this.url = url;
        };

        this.send = function () {
          if (options.networkError) {
            this.onerror();
            return;
          }

          this.status = options.status;
          this.statusText = options.statusText;
          this.response = options.response;
          this.onload();
        };
      };
    }

    afterEach(() => {
      window.XMLHttpRequest = originalXMLHttpRequest;
    });

    it('should return a promise', () => {
      window.XMLHttpRequest = createXHRStub({status: 200, response: 'ok'});

      assert.instanceOf(httpGet('/api'), Promise)
    });

    it('should resolve with the response body on status 200', async () => {
      window.XMLHttpRequest = createXHRStub({status: 200, response: '{"name":"Jon Snow"}'});

      assert.equal(await httpGet('/api/characters/1'), '{"name":"Jon Snow"}')
    });

    it('should reject with an error containing the status code when status is not 200', async () => {
      window.XMLHttpRequest = createXHRStub({status: 404, statusText: 'Not Found'});

      try {
        await httpGet('/api/unknown');
        assert.fail('httpGet should have been rejected')
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Not Found')
        assert.equal(error.code, 404)
      }
    });

    it('should reject with a network error', async () => {
      window.XMLHttpRequest = createXHRStub({networkError: true});

      try {
        await httpGet('/api/characters/1');
        assert.fail('httpGet should have been rejected')
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Network Error')
      }
    });
  });
});
