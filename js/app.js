angular.module('challengeFrameworkApp', [])
  .controller('mainController', ['$scope', function($scope) {
    $scope.results = [];
    $scope.resultsStats = '';
    $scope.canRunTests = true;
    // This following line is for demonstration purposes only
    $scope.tests = [ { "type":"must-contain", "structexp":"for.*if|if.*for", "success":"You used a for loop and an if statement.", "failure":"You must use a for loop and an if statement." }, { "type":"must-not-contain", "structexp":"while", "success":"You didn't use a while loop.", "failure":"You may not use a while loop." }, { "type":"must-match", "structexp":".*(for .*(if.*).*).*", "success":"You used a for loop containing an if statement.", "failure":"You must use a for loop, inside of which should be an if statement." } ];
    $scope.testTypeToString = function(s) {
      // Converts raw test type (e.g. "must-contain") to human-readable string
      return (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-/g, ' ');
    }
    $scope.runTests = function() {
      $scope.canRunTests = false;
      $scope.results = [];
      $('#error').empty();
      var testsPassed = 0;
      var testsRun = 0;
      for (var i = 0; i < $scope.tests.length; i++) {
        var test = $scope.tests[i];
        try {
          var passed = fungus.test(test.type, test.structexp, $('#code-input').val());
          var result = {'passed': passed, 'message': passed ? test.success : test.failure};
          $scope.results.push(result);
          if (passed) {
            testsPassed++;
          }
          testsRun++;
        } catch (err) {
          console.log(err);
          $scope.results = [];
          $('#error').append('<span class="animated shake">Parsing failed. Please check your code for errors.</span>');
          break;
        }
      }
      $scope.resultsStats = 'Ran ' + testsRun + ' test' + (testsRun === 1 ? '' : 's') + '; ' + testsPassed + ' passed.';
      $scope.canRunTests = true;
    };
    $scope.addTest = function() {
      var test = {};
      test.type = $('#select-type').find(':selected').text();
      test.structexp = $('#input-structexp').val();
      test.success = $('#input-success').val();
      test.failure = $('#input-failure').val();
      $scope.tests.push(test);
      $('#input-structexp').val(' ');
      $('#input-success').val(' ');
      $('#input-failure').val(' ');
    }
  }]);