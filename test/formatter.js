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
          id: 'da21858f-2c78-442a-8ea6-51fe73762e0e',
          name: 'Sample TRX Import',
          runUser: 'Brian Mancini'
        })
        .addResult({ 
          executionId: 'd8d6b688-c5e2-44c4-9c5c-a189875bd610',
          test: new UnitTest({ 
            id: '89f81c68-a210-4e28-90ed-32d6f10d23f8',
            name: 'test 1', 
            methodName: 'test1', 
            methodCodeBase: 'testing-framework', 
            methodClassName: 'test1'
          }),
          computerName: 'bmanci01',
          outcome: 'Passed',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00'
        })
        .addResult({
          executionId: '71d40c44-01da-4b35-9f21-bf1cfff97e40',
          test: new UnitTest({ 
            id: '9ce212d1-e8c7-45d0-934f-e95d04c14dcb',
            name: 'test 2', 
            methodName: 'test2', 
            methodCodeBase: 'testing-framework', 
            methodClassName: 'test2'
          }),
          computerName: 'bmanci01',
          outcome: 'Inconclusive',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00'
        })
        .addResult({
          executionId: '9d9b5fdc-f1fe-465b-bca6-49d50eeaf574',
          test: new UnitTest({ 
            id: 'e458c13d-bf3d-44b3-9177-495d16ef73b8',
            name: 'test 3', 
            methodName: 'test3', 
            methodCodeBase: 'testing-framework', 
            methodClassName: 'test3' 
          }),
          computerName: 'bmanci01',
          outcome: 'Failed',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00',
          output: 'This is sample output for the unit test',
          errorMessage: 'This unit test failed for a bad reason',
          errorStacktrace: 'at test3() in c:\\tests\\test3.js:line 1'
        });

      actual = formatter.testRun(run);
      fs.writeFileSync('test/derp.trx', actual);
      expected = fs.readFileSync('test/test.trx', 'ascii')

      assert.equal(expected, actual);
    });
  });
});
