// '37ab91009a2220ffa4e15238bfa32cdf'

const TOAST_MSG = {
  INVALID_SEARCH : 'Please enter a valid city or US state.',
  MAX_REQUESTS : 'We have reached the maximum number of requests for weather data, please try again in a minute. If the problem persists, you can DM me on twitter @colebdev0.',
  BAD_API_KEY : 'Bad API key.'
}

if (typeof KeyEvent == 'undefined') 
  var KeyEvent = { DOM_VK_RETURN: 13 }; 