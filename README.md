node-trx
========

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]


This is a Node utility for generating test results files in the [Visual Studio Test Results File (TRX)](https://msdn.microsoft.com/en-us/library/jj155800(v=vs.120).aspx) format.

The TRX file format is compliant with the namespace http://microsoft.com/schemas/VisualStudio/TeamTest/2010, found in full spec in `%VSINSTALLDIR%\xml\Schemas\vstst.xsd`.

This libary is a partial implementation of the XSD.

This library was designed to reduce domain knowledge needed to create TRX files via a simple, fluent interface.

```javascript
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
      owners: [{name: 'testOwner'}],
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
```

Error information can be provided by including `errorMessage` and `errorStacktrace` properties in the result. Stacktrace must conform to the syntax `at [method signature] in [file path]:[line number]` or it will be picked up by Visual Studio.

Standard output information can be included in the `output` property.

### Unit tests

Run `npm run test`.

### Releases

0.8.0 - Added support for Owners, update UUID to 3.0.0

0.7.0 - Added support for Attachments

0.6.0 - Added support for NotExecuted outcome.

0.5.0 - Added support for Pending and Timeout outcomes.

0.4.0 - Added support for configuring Times tag.

0.3.0 - Added support for configuring TestSetting and provides a default if not supplied.

0.2.0 - Added support for Unit Test description

0.1.2 - Added support for errors and stacktrace info

0.1.1 - Initial development release


[travis-image]: https://travis-ci.org/bmancini55/node-trx.svg?branch=master
[travis-url]: https://travis-ci.org/bmancini55/node-trx
[coveralls-image]: https://coveralls.io/repos/github/bmancini55/node-trx/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/bmancini55/node-trx?branch=master
