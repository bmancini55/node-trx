var uuid = require('uuid')
  , formatter = require('./formatter');

/**
 * Represents a test run as defined in the XSD `TestRunType`
 *
 * @param {object} params
 * @config {string} name
 * @config {string} [id]
 * @config {string} [runUser]
 */
function TestRun(params) {
  this.id = params.id || uuid.v4();
  this.name = params.name;

  if (params.runUser) {
    this.runUser = params.runUser;
  }

  if (params.times) {
    this.times = new Times(params.times);
  }

  if (params.testSettings) {
    this.testSettings = new TestSettings(params.testSettings);
  } else {
    this.testSettings = new TestSettings({
        id: 'ce1a4cfb-64fa-4d63-8815-e9984737a62c',
        name: 'Default Test Settings'
    });
  }

  if(params.deployment) {
    // support for attachments. If the reporter wants to attach files (like screenshots), 
    // it should specify the folder like this: 
    //  params.deployment = { runDeploymentRoot : 'attachmentsFolderName' }
    // the folder should have the following hierarchy
    //  * myreport.trx 
    //  -> attachmentsFolderName
    //    -> In    (i still dont know how to get this out of the way)
    //      -> executionId_Or_RelativeResultsDirectoryName
    //        * file.png
    //
    this.testSettings.deployment = new Deployment(params.deployment); 
  }

  this.testDefinitions = [];
  this.testLists = [
    TestList.ResultsNotInAList,
    TestList.AllLoadedResults
  ];
  this.testEntries = [];
  this.testResults = [];

  this.counters = new Counter();
}


TestRun.prototype.toXml = function () {
  return formatter.testRun(this);
}


/**
 * Adds a test result to the run
 *
 * @param {object} params
 * @config {GenericTest} test
 * @config {string} [computerName]
 * @config {TestList} [testList]
 * @config {string} [outcome]
 * @config {date} [startTime]
 * @config {date} [endTime]
 * @config {number} [duration]
 * @config {string} [executionId]
 */
TestRun.prototype.addResult = function (params) {

  // generate a new executionId for this test
  var executionId = params.executionId || uuid.v4()
    , test = params.test
    , computerName = params.computerName || this.computerName
    , testList = params.testList || TestList.ResultsNotInAList
    , outcome = params.outcome
    , startTime = params.startTime
    , endTime = params.endTime
    , duration = params.duration
    , output = params.output
    , errorMessage = params.errorMessage
    , errorStacktrace = params.errorStacktrace;

  // add test definition
  test.executionId = executionId;
  this.testDefinitions.push(test);

  // add a test entry
  var testEntry = new TestEntry({
    testId: test.id,
    executionId: executionId,
    testListId: testList.id
  });
  this.testEntries.push(testEntry);

  // add a test result
  var testResult = new UnitTestResult({
    testName: test.name,
    testType: test.type,
    testId: test.id,
    testListId: testList.id,
    computerName: computerName,
    outcome: outcome,
    startTime: startTime,
    endTime: endTime,
    duration: duration,
    output: output,
    errorMessage: errorMessage,
    errorStacktrace: errorStacktrace,
    // visual studio usually uses the executionId as the relativeResultsDirectory
    relativeResultsDirectory: params.relativeResultsDirectory || executionId 
  });
  testResult.executionId = executionId;

  // support for attachments. Useful for tests with Selenium or CodedUI
  testResult.resultFiles = params.resultFiles || [];
  this.testResults.push(testResult);

  // increment the counter
  this.counters.increment(outcome);

  return this;
}


/**
 * Counter is defined by the XSD
 */
function Counter() {
  this.total = 0;
  this.executed = 0;
  this.passed = 0;
  this.error = 0;
  this.failed = 0;
  this.timeout = 0;
  this.aborted = 0;
  this.inconclusive = 0;
  this.passedButRunAborted = 0;
  this.notRunnable = 0;
  this.notExecuted = 0;
  this.disconnected = 0;
  this.warning = 0;
  this.completed = 0;
  this.inProgress = 0;
  this.pending = 0;
}

/**
 * Increments the counter object values based on the outcome
 *
 * @param {string} outcome - outcome 'Passed', 'Failed', 'Inconclusive', 'Timeout', 'Pending', 'NotExecuted'
 */
Counter.prototype.increment = function (outcome) {
  this.total += 1;

  switch (outcome) {
    case 'Passed':
      this.executed += 1;
      this.passed += 1;
      break;
    case 'Failed':
      this.executed += 1;
      this.failed += 1;
      break;
    case 'Inconclusive':
      this.executed += 1;
      this.inconclusive += 1;
      break;
    case 'Timeout':
      this.executed += 1;
      this.timeout += 1;
      break;
    case 'Pending':
      this.pending += 1;
      break;
    case 'NotExecuted':
      this.notExecuted += 1;
      break;
  }
}

/**
 * A Times as defined by the XSD type `Times`
 *
 * @param {object} params
 * @config creation
 * @config queuing
 * @config start
 * @config finish
 */
function Times(params) {
  this.creation = params.creation;
  this.queuing = params.queuing;
  this.start = params.start;
  this.finish = params.finish;
}

/**
 * A TestSetting as defined by the XSD type `TestSettingsType`
 *
 * @param {object} params
 * @config {string} name - name of the test settings
 * @config {string} id - guid identifier
 */
function TestSettings(params) {
  this.id = params.id;
  this.name = params.name;
}

/**
 * A Deployment element as defined by the XSD type `Deployment`
 *
 * @param  {object} params
 * @config {string} [runDeploymentRoot] - name of the folder where any files generated by the tests will be located
 * @config {string} [userDeploymentRoot]
 * @config {string} [deploySatelliteAssemblies]
 * @config {string} [ignoredDependentAssemblies]
 * @config {string} [enabled]
 */
function Deployment(params) {
  this.runDeploymentRoot = params.runDeploymentRoot
  this.userDeploymentRoot = params.userDeploymentRoot
  this.deploySatelliteAssemblies = params.deploySatelliteAssemblies
  this.ignoredDependentAssemblies = params.ignoredDependentAssemblies
  this.enabled = params.enabled
}

/**
 * A TestList as defined by the XSD type `TestListType`
 *
 * @param {object} params
 * @config {string} name - name of the test list
 * @config {string} [id] - optional guid identifier that is generated if not supplied
 */
function TestList(params) {
  this.id = params.id || uuid.v4();
  this.name = params.name;
}


/**
 * An Owner as defined by the XSD type `OwnerType`
 *
 * @param {object} params
 * @config {string} name - name of the owner
 */
function Owner(params) {
  this.name = params.name;
}


/**
 * System list for 'Results Not in a List'
 */
TestList.ResultsNotInAList = new TestList({id: '8c84fa94-04c1-424b-9868-57a2d4851a1d', name: 'Results Not in a List'});

/**
 * System list for 'All Loaded Results'
 */
TestList.AllLoadedResults = new TestList({id: '19431567-8539-422a-85d7-44ee4e166bda', name: 'All Loaded Results'});


/**
 * Represents a generic test definition and maps to the XSD type `GenericTestType`
 *
 * @param {object} params
 * @config {string} name
 * @config {string} methodName
 * @config {string} methodCodeBase
 * @config {string} methodClassName
 * @config {string} [id]
 * @config {Owner[]} owners
 */
function UnitTest(params) {
  this.id = params.id || uuid.v4();
  this.name = params.name;
  this.type = '13cdc9d9-ddb5-4fa4-a97d-d965ccfc6d4b';
  this.methodName = params.methodName;
  this.methodCodeBase = params.methodCodeBase;
  this.methodClassName = params.methodClassName;
  this.owners = params.owners;
  this.description = params.description;
}


/**
 * Represents a Test Result definition of the XSD type `UnitTestResultType`
 * which is used in the XSD type `ResultsType` collection.
 *
 * @param {object} params
 * @config {string} testName
 * @config {string} testType
 * @config {string} testId
 * @config {string} testListId
 * @config {string} computerName
 * @config {string} [outcome]
 * @config {string} [startTime]
 * @config {string} [endTime]
 * @config {string} [duration]
 * @config {string} [executionId]
 * @config {string} [relativeResultsDirectory]
 */
function UnitTestResult(params) {
  this.testName = params.testName;
  this.testType = params.testType;
  this.testId = params.testId;
  this.testListId = params.testListId;
  this.computerName = params.computerName;
  this.outcome = params.outcome;
  this.startTime = params.startTime;
  this.endTime = params.endTime;
  this.duration = params.duration;
  this.executionId = params.executionId;
  this.output = params.output;
  this.errorMessage = params.errorMessage;
  this.errorStacktrace = params.errorStacktrace;
  this.relativeResultsDirectory = params.relativeResultsDirectory; 
}


/**
 * Represents a Test Entry definition of the XSD type `TestEntryType`
 *
 * @param {object} params
 * @config {String} testID
 * @config {String} executionId
 * @config {String} testListId
 */
function TestEntry(params) {
  this.testId = params.testId;
  this.executionId = params.executionId;
  this.testListId = params.testListId;
}


/**
 * Represents a ResultFile definition of the XSD type `ResultFileType`
 * which is used in the XSD type `ResultFilesType` collection.
 *
 * @param {object} params
 * @config {string} path
 */
function ResultFile(params) {
  this.path = params.path;
}

/**
 * Exports
 */

module.exports = {
  TestRun: TestRun,
  UnitTest: UnitTest,
  TestList: TestList
};
