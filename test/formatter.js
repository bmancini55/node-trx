var fs = require('fs')
  , assert = require('assert')
  , formatter = require('../formatter')
  , TRX = require('../trx')
  , TestRun = TRX.TestRun
  , UnitTest = TRX.UnitTest;

describe('formatter', function () {
  describe('testRun', function () {
    it('should create valid TestRun XML', function () {

      var run, actual, expected;

      run = new TestRun({
        id: 'da21858f-2c78-442a-8ea6-51fe73762e0e',
        name: 'Sample TRX Import',
        runUser: 'Brian Mancini',
        times: {
          creation: (new Date('2015-08-10T00:00:00.000Z')).toISOString(),
          queuing: (new Date('2015-08-10T00:00:00.000Z')).toISOString(),
          start: (new Date('2015-08-10T00:00:00.000Z')).toISOString(),
          finish: (new Date('2015-08-10T00:00:01.500Z')).toISOString()
        },
        deployment: {
          runDeploymentRoot: 'test_files'
        }
      })
        .addResult({
          executionId: 'd8d6b688-c5e2-44c4-9c5c-a189875bd610',
          test: new UnitTest({
            id: '89f81c68-a210-4e28-90ed-32d6f10d23f8',
            name: 'test 1',
            methodName: 'test1',
            methodCodeBase: 'testing-framework',
            methodClassName: 'test1',
            owners: [{name: 'testOwner'}],
            description: 'This is test 1'
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
            methodClassName: 'test2',
            description: 'This is test 2'
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
            methodClassName: 'test3',
            description: 'This is test 3'
          }),
          computerName: 'bmanci01',
          outcome: 'Failed',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00',
          output: 'This is sample output for the unit test',
          errorMessage: 'This unit test failed for a bad reason',
          errorStacktrace: 'at test3() in c:\\tests\\test3.js:line 1',
          resultFiles: [ 
            { path: 'screenshot.jpg' } 
          ]
        })
        .addResult({
          executionId: 'a2c2aa1f-6ac5-4505-b441-b5927a925a87',
          test: new UnitTest({
            id: '3a9b1c2b-db55-49df-bbc4-2a03b052c981',
            name: 'test 4',
            methodName: 'test4',
            methodCodeBase: 'testing-framework',
            methodClassName: 'test4',
            description: 'This is test 4'
          }),
          computerName: 'bmanci01',
          outcome: 'Timeout',
          duration: '00:00:44.7811567',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:49:16.9694381-08:00',
          output: 'This is sample output for the unit test',
          errorMessage: 'This unit test failed because it timed out',
          errorStacktrace: 'at test4() in c:\\tests\\test4.js:line 1'
        })
        .addResult({
          executionId: '6b8ddc5a-3a36-4d07-8e77-d2f5e1d3f14c',
          test: new UnitTest({
            id: '1c5288a9-26f1-4c44-913a-32024c99415e',
            name: 'test 5',
            methodName: 'test5',
            methodCodeBase: 'testing-framework',
            methodClassName: 'test5',
            description: 'This is test 5'
          }),
          computerName: 'bmanci01',
          outcome: 'Pending',
          duration: '00:00:00.000',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:48:29.9072393-08:00'
        })
        .addResult({
          executionId: 'f9cf5371-3b98-400c-a117-bc495eb50061',
          test: new UnitTest({
            id: '7466d1d9-76a2-4ec3-a9f9-4ff29f066230',
            name: 'test 6',
            methodName: 'test6',
            methodCodeBase: 'testing-framework',
            methodClassName: 'test6',
            description: 'This is test 6'
          }),
          computerName: 'bmanci01',
          outcome: 'NotExecuted',
          duration: '00:00:00.000',
          startTime: '2010-11-16T08:48:29.9072393-08:00',
          endTime: '2010-11-16T08:48:29.9072393-08:00'
        });

      actual = formatter.testRun(run);
      expected = fs.readFileSync('test/test.trx', 'ascii');

      assert.equal(expected, actual);
    });
  });
});
