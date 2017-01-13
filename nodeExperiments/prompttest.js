var prompt = require('prompt');

  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(['value1', 'value2', 'value3'], function (err, result) {
    //

    //compute the results
    var newResult = parseInt(result.value1) + parseInt(result.value2) + parseInt(result.value3);

    // Log the results.
    //
    console.log('Calculated Value equals ');
    console.log(newResult);
    // console.log('  email: ' + result.email);
  });
