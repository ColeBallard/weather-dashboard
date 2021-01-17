function search(location) {

  let weatherQueryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&appid=' +  API_KEY;
  let oneCallQueryURL;

  $.ajax({
    url: weatherQueryURL,
    method: 'GET'
  }).then((response) => {
    if (response == null) return;

    $('#todays-date').text(moment().format('LL'));

    $('#city-name').text(response.name + ', ' + response.sys.country);

    $('#todays-weather').attr('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
    $('#todays-weather').attr('alt', response.weather[0].description);

    $('#todays-temperature').text(response.main.temp + String.fromCharCode(176) + 'F');

    $('#todays-humidity').text(response.main.humidity + '%');

    $('#todays-wind-speed').text(response.wind.speed + ' MPH');

    oneCallQueryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&units=imperial&appid=' + API_KEY;

    $.ajax({
      url: oneCallQueryURL,
      method: 'GET'
    }).then((response) => {
      setUVElement($('#todays-uv'), response.current.uvi);

      $('#forecast-row .card').each((dayIndex, card) => {
        $(card).find('.forecast-date').text(moment().add(dayIndex + 1, 'days').format('LL'));

        $(card).find('.forecast-weather-icon').attr('src', 'http://openweathermap.org/img/wn/' + response.daily[dayIndex + 1].weather[0].icon + '@2x.png');
        $(card).find('.forecast-weather-icon').attr('alt', response.daily[dayIndex + 1].weather[0].description);

        $(card).find('.forecast-temperature').text(response.daily[dayIndex + 1].temp.day + String.fromCharCode(176) + 'F');

        setUVElement($(card).find('.forecast-uv'), response.daily[dayIndex + 1].uvi);

        showDisplay();
      });
    });

  });
}

function setUVElement(element, uv) {
  if (0 <= uv && uv < 3) 
    element.css({ 'background-color' : 'green', 'color' : 'white' });
  else if (3 <= uv && uv < 6) 
    element.css({ 'background-color' : 'yellow', 'color' : 'black' });
  else if (6 <= uv && uv < 8) 
    element.css({ 'background-color' : 'orange', 'color' : 'white' });
  else if (8 <= uv && uv < 11) 
    element.css({ 'background-color' : 'red', 'color' : 'white' });
  else if (11 <= uv) 
    element.css({ 'background-color' : 'purple', 'color' : 'white' });
  else
    console.log('ERROR: uv out of range');

  element.text(uv);
}

function showDisplay() {
  $('#todays-info').show();
  $('#todays-stats-col').show();
  $('#forecast-row-title').show();
  $('#forecast-row').show();
}

$(document).ready(() =>  {
  $('#search-bar').on('keydown', (event) => {
    if (event.keyCode == KeyEvent.DOM_VK_RETURN) 
      $('#search-btn').click();
  });

  $('#search-btn').on('click', (event) => {
    event.preventDefault();
    search($('#search-bar').val());
  });

  $('#pin-btn').on('click', (event) => {
    event.preventDefault();

    let currentCity = $('#city-name').text();

    if (!currentCity)
      return;

    let existsFlag = false;
    
    if ($('#dropdown-pins .dropdown-menu').children().length != 0) {
      $('#dropdown-pins .dropdown-menu li').each((index, pinnedCity) => {
        if (currentCity.localeCompare($(pinnedCity).text()) == 0) {
          existsFlag = true;
          return;
        }
      });

      if (existsFlag) return;
    }



    $('#dropdown-pins .dropdown-menu').append(
      $('<li/>').append(
        $('<a/>', {'class' : 'dropdown-item', 'href' : '#'})
      )
    );

    let currentCityListItem = $('#dropdown-pins .dropdown-menu li').last();

    currentCityListItem.find('a').text(currentCity);
    currentCityListItem.on('click', (event) => {
      event.preventDefault();
      search(currentCity);
    })
  });
});