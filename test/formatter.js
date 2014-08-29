var fs = require('fs')
  , assert = require('assert')
  , formatter = require('../formatter')
  , TRX = require('../trx')
  , TestRun = TRX.TestRun
  , UnitTest = TRX.UnitTest;

describe('formatter', function () {  
  describe('testRun', function () {
    it('should create valid TestRun XML', function() {

      var run, actual, expected;

      run = new TestRun({ 
          id: '4f632f26-97ab-4912-ba43-82f392c9692a',
          name: 'Test TRX',
          runUser: 'Brian Mancini'
        })
        .addResult({ 
          executionId: '441d57e1-9da7-4ad9-9739-2f83fad12c43',
          test: new UnitTest({ 
            id: '0993aa01-baf9-4029-ab69-b3e3f91c29d8',
            name: 'test 1', 
            methodName: 'test1', 
            methodCodeBase: 'codebase', 
            methodClassName: 'classname'
          }),
          computerName: 'Computer',
          outcome: 'Passed',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00'
        });

      actual = formatter.testRun(run);
      expected = fs.readFileSync('test/test.trx', 'ascii')

      assert.equal(expected, actual);
    })
  })
})
