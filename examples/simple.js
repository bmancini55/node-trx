var fs = require('fs')
  , TRX = require('../trx')
  , TestRun = TRX.TestRun
  , UnitTest = TRX.UnitTest
  , computerName = 'bmanci01'
  , run;


run = new TestRun({
  name: 'Sample TRX Import',
  runUser: 'Brian Mancini',
  times: {
    creation: '2015-08-10T00:00:00.000Z',
    queuing: '2015-08-10T00:00:00.000Z',
    start: '2015-08-10T00:00:00.000Z',
    finish: '2015-08-10T00:00:01.500Z'
  }
})
  .addResult({
    test: new UnitTest({
      name: 'test 1',
      methodName: 'test1',
      methodCodeBase: 'testing-framework',
      methodClassName: 'test1',
      owners: [{name: 'testOwner1'}, {name: 'testOwner2'}],
      description: 'This is test 1'
    }),
    computerName: computerName,
    outcome: 'Passed',
    duration: '00:00:44.7811567',
    startTime: '2010-11-16T08:48:29.9072393-08:00',
    endTime: '2010-11-16T08:49:16.9694381-08:00'
  })
  .addResult({
    test: new UnitTest({
      name: 'test 2',
      methodName: 'test2',
      methodCodeBase: 'testing-framework',
      methodClassName: 'test2',
      description: 'This is test 2'
    }),
    computerName: computerName,
    outcome: 'Inconclusive',
    duration: '00:00:44.7811567',
    startTime: '2010-11-16T08:48:29.9072393-08:00',
    endTime: '2010-11-16T08:49:16.9694381-08:00'
  })
  .addResult({
    test: new UnitTest({
      name: 'test 3',
      methodName: 'test3',
      methodCodeBase: 'testing-framework',
      methodClassName: 'test3',
      description: 'This is test 3'
    }),
    computerName: computerName,
    outcome: 'Failed',
    duration: '00:00:44.7811567',
    startTime: '2010-11-16T08:48:29.9072393-08:00',
    endTime: '2010-11-16T08:49:16.9694381-08:00',
    output: 'This is sample output for the unit test',
    errorMessage: 'This unit test failed for a bad reason',
    errorStacktrace: 'at test3() in c:\\tests\\test3.js:line 1'
  });


// output the json to the screen
console.log(run);

// write the output to exmample.trx
fs.writeFileSync('example.trx', run.toXml());