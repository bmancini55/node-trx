var builder = require('xmlbuilder');

/**
 * Formats a `TestRun` into xml
 *
 * @param {TestRun} testRun - the `TestRun` instance to format
 * @return {string} xml
 */
exports.testRun = function (testRun) {
  var xml = builder.create('TestRun')
    , el;

  xml.att('xmlns', 'http://microsoft.com/schemas/VisualStudio/TeamTest/2010');
  xml.att('id', testRun.id);
  xml.att('name', testRun.name);

  if (testRun.runUser) {
    xml.att('runUser', testRun.runUser);
  }

  if (testRun.times) {
    el = xml.ele('Times')
      .att('creation', testRun.times.creation)
      .att('queuing', testRun.times.queuing)
      .att('start', testRun.times.start)
      .att('finish', testRun.times.finish);
  }


  el = xml.ele('TestSettings')
    .att('name', testRun.testSettings.name)
    .att('id', testRun.testSettings.id);

  if(testRun.testSettings.deployment !== null && testRun.testSettings.deployment !== undefined) {
    buildDeployment(el, testRun.testSettings.deployment)
  }

  // TODO: add Output > StdOut tags in result summary
  el = xml.ele('ResultSummary')
    .att('outcome', testRun.counters.failed > 0 ? 'Failed' : 'Completed')
    .ele('Counters')
    .att('total', testRun.counters.total)
    .att('executed', testRun.counters.executed)
    .att('passed', testRun.counters.passed)
    .att('error', testRun.counters.error)
    .att('failed', testRun.counters.failed)
    .att('timeout', testRun.counters.timeout)
    .att('aborted', testRun.counters.aborted)
    .att('inconclusive', testRun.counters.inconclusive)
    .att('passedButRunAborted', testRun.counters.passedButRunAborted)
    .att('notRunnable', testRun.counters.notRunnable)
    .att('notExecuted', testRun.counters.notExecuted)
    .att('disconnected', testRun.counters.disconnected)
    .att('warning', testRun.counters.warning)
    .att('completed', testRun.counters.completed)
    .att('inProgress', testRun.counters.inProgress)
    .att('pending', testRun.counters.pending);

  el = xml.ele('TestDefinitions');
  buildArray(testRun.testDefinitions, el, buildTestDefinition);

  el = xml.ele('TestLists');
  buildArray(testRun.testLists, el, buildTestList);

  el = xml.ele('TestEntries');
  buildArray(testRun.testEntries, el, buildTestEntry);

  el = xml.ele('Results');
  buildArray(testRun.testResults, el, buildTestResult);

  return xml.end({pretty: true});
}

function buildArray(items, element, builder) {
  items.forEach(function (item) {
    builder(element, item);
  });
}

function buildDeployment(parent, deploymentDefinition) {
  var ele = parent.ele('Deployment');
  
  if(deploymentDefinition.runDeploymentRoot !== undefined) {
    ele.att('runDeploymentRoot', deploymentDefinition.runDeploymentRoot);
  }
}

function buildTestDefinition(parent, testDefinition) {
  var xml = parent.ele('UnitTest')
    .att('id', testDefinition.id)
    .att('name', testDefinition.name);

  if (testDefinition.description) {
    xml.ele('Description', testDefinition.description);
  }

  if(testDefinition.owners) {
    var owners = xml.ele('Owners');
    buildArray(testDefinition.owners, owners, buildTestOwners);
  }
   
  xml.ele('Execution', {id: testDefinition.executionId}, null);
  xml.ele('TestMethod')
    .att('codeBase', testDefinition.methodCodeBase)
    .att('className', testDefinition.methodClassName)
    .att('name', testDefinition.methodName)
}

function buildTestList(parent, testList) {
  var xml = parent.ele('TestList')
    .att('id', testList.id)
    .att('name', testList.name);
}

function buildTestEntry(parent, testEntry) {
  var xml = parent.ele('TestEntry')
    .att('testId', testEntry.testId)
    .att('executionId', testEntry.executionId)
    .att('testListId', testEntry.testListId);
}

function buildTestOwners(parent, owner) {
  var xml = parent.ele('Owner', owner)
    .att('name', owner.name);
}

function buildTestResult(parent, result) {
  var xml = parent.ele('UnitTestResult')
    .att('testId', result.testId)
    .att('testName', result.testName)
    .att('testType', result.testType)
    .att('testListId', result.testListId)
    .att('computerName', result.computerName);

  if (result.outcome) {
    xml.att('outcome', result.outcome);
  }

  if (result.startTime) {
    xml.att('startTime', result.startTime);
  }

  if (result.endTime) {
    xml.att('endTime', result.endTime);
  }

  if (result.duration) {
    xml.att('duration', result.duration);
  }

  if (result.executionId) {
    xml.att('executionId', result.executionId);
  }

  if (result.relativeResultsDirectory) { 
    xml.att('relativeResultsDirectory', result.relativeResultsDirectory);
  }

  if(result.resultFiles && result.resultFiles.length > 0) {
	  buildArray(result.resultFiles, xml.ele('ResultFiles'), buildResultFileEntry);
  }

  if (result.output || result.errorMessage || result.errorStacktrace) {
    var output = xml.ele('Output');
    output.ele('StdOut', result.output || '');

    if (result.errorMessage || result.errorStacktrace) {
      var error = output.ele('ErrorInfo');
      error.ele('Message', result.errorMessage || '');
      error.ele('StackTrace', result.errorStacktrace || '');
    }
  }
}

function buildResultFileEntry(parent, result) {
  var xml = parent.ele('ResultFile').att('path', result.path);
}

