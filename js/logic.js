$(document).ready(function(){


  var zipcode = "";
  var eventType = "";
  var dollar = "";
  var date = "";
  var newEndDate = "";
  var newStartDate;
  var catogoryID;

//Adding Spinner for 5 seconds while loading API
function spining() {

  var opts = {
    lines: 11, // The number of lines to draw
    length: 25, // The length of each line
    width: 9, // The line thickness
    radius: 25, // The radius of the inner circle
    scale: 1.5, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#ef6c57', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 0.7, // Rounds per second
    rotate: 19, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '99%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };
  var target = document.getElementById('spinnerContainer');
  var spinner = new Spinner(opts).spin(target);
  setTimeout(function(){
  $('#spinnerContainer').css('display', 'none')
 }, 3000);
}


  function getJSON(eventType, catogoryID, zipcode, dollar, date, newendDate, sortID){
    $('.tdArticle').empty();
    var queryURL = "https://www.eventbriteapi.com/v3/events/search/?q="+eventType+"&sort_by="+sortID+"&location.address="+zipcode+"&location.within=100mi&expand=organizer,venue,ticket_classes&categories="+catogoryID+"&price="+dollar+"&start_date.range_start="+date+"T00%3A00%3A00&start_date.range_end="+newEndDate+"T11%3A59%3A00&token=RRNZXROPSLKJ26CN7LW2"
    $.ajax({
      url: queryURL,
      method: "GET"
      }).then(function(response) {
          console.log(response)
          console.log(queryURL)
        //  console.log(response.events[0].ticket_classes[1].cost.display)
          for (var i=0; i < 10; i++){
            console.log("Event Name: "+response.events[i].name.text)
            eventName = response.events[i].name.text;
            // console.log("Event Description: "+response.events[i].description.text)
            // console.log("Event Logo URL -->" +response.events[i].logo.url)
            eventLogo = response.events[i].logo.url
            console.log("Event Logo URL -->" +eventLogo )
            // console.log("Event Start Time: "+response.events[i].start.local)
            eventStart_unformated = response.events[i].start.local
            eventStartTime = moment(eventStart_unformated).format("YYYY-MM-DD HH:mm:ss");
            // console.log("Event Number"+ i+ "End Time"+response.events[i].end.local)
            eventEnd_unformated = response.events[i].end.local;
            eventEndTime = moment(eventEnd_unformated).format("YYYY-MM-DD HH:mm:ss");
            ticket_class = response.events[i].ticket_classes
            ticket_class_length = ticket_class.length
            if (ticket_class_length == 0){
              // console.log("Event : "+response.events[i].name.text+" is Free");
              var ticket_Price = "FREE"

            } else {
              for (var j = 0 ; j < ticket_class_length; j++) {
                if (ticket_class[j] != undefined) {
                  if (ticket_class[j].cost != undefined) {
                    if (ticket_class[j].cost.display != undefined) {
                      var ticket_Price = ticket_class[j].cost.display
                      console.log("Ticket Price: "+ticket_Price)
                    } else{
                      var ticket_Price = "FREE"
                    }
                } else {
                  var ticket_Price = "FREE"
                }
              }else {
                var ticket_Price = "FREE"
              }
            }
          }
        localized_multi_line_address_display = response.events[i].venue.address.localized_multi_line_address_display
        venueName = response.events[i].venue.name
        if(venueName){
        venueAddr = venueName+" , "+localized_multi_line_address_display;
        console.log("address array --> "+venueName+" , "+localized_multi_line_address_display)
        } else {
        venueAddr = localized_multi_line_address_display;
        }
        bookTicketURL = response.events[i].url

        generateHTML(eventName, eventLogo, eventStartTime, venueAddr, ticket_Price, bookTicketURL)
        }
    });
  }

  function generateHTML(eventName, eventLogo, eventStartTime, venueAddr, ticket_Price, bookTicketURL){
    // $('#resultBlock').empty();
    // cardHTML = "<div class='card' style='width: 400px;'><img class='card-img-top' src=\""+eventLogo+"\" alt='Card image' style='width: 400px; height: 200px;'><div class='card-body'><h4 class='card-title'> "+eventName+"</h4><p>Start Time : "+eventStartTime+"<br>End Time: "+eventEndTime+"<br>"+ticket_Price+"</p></div></div></div>"
    cardHTML = "<div class='card'><div class='row'><div class='col-md-6'><div class='card-block'><h4 class='card-title' style='margin-left: 30px;'>"+eventName+"</h4><p class='card-text' style='margin-left: 30px;'>Start Time : "+eventStartTime+"<br>Venue Address: <br>&nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp"+venueAddr+"<br>Ticket Price Starts : "+ticket_Price+"</p><a href=\""+bookTicketURL+"\" style='margin-left: 30px;'  target='_blank' class='btn btn-primary'>Book Tickets</a></div></div><div class='col-md-6'><img style='color: #fff; height: 15rem; background-size: cover;' src=\""+eventLogo+"\"></div></div></div>"
    $('#resultBlock').append(cardHTML);
  }


  // window.onscroll = function() {scrollFunction()};

  // function scrollFunction() {
  //   if (document.documentElement.scrollTop > 20) {
  //     $("#gotop").css('display', 'block');
  //   } else {
  //     $("#gotop").css('display', 'none');
  //   }
  // }
  // function topFunction() {window.location.reload();}
  $("#gotop").on('click', function(){
    location.reload();
  })

  $("#eventType").on("change" ,function(){
    // catogoryID = $('#eventType').attr('data-catogory');
    catogoryID = $("#eventType option:selected").attr('data-catogory');
    // console.log(catogoryID)
    if ($('#eventType').val() == "other") {$('#refinedDiv').css('display', 'block');} else { $('#refinedDiv').css('display', 'none');}
  })
  $('#submit').on('click', function () {
    if ($('#eventType').val() == "other") {
      eventType = $('#refinedSearch').val().trim() }
        else {
      eventType = $('#eventType').val();
    }

    //  catogoryID = $('#eventType').attr('data-catogory');
    //  console.log(catogoryID)
     zipcode = $("#zip").val()
     dollar = $('#dollar').val()
     date = $('#date').val()
     sortID = $("#sortID").val()
     newStartDate = moment(date).format('YYYY-MM-DD')

    var endDate = moment(date).add(1, 'days');
    newEndDate = endDate.format('YYYY-MM-DD')
    $('#mainBlock').empty();
    spining();
    $("#gotop").css('display', 'block');

    // console.log(eventType)
    // console.log(catogoryID)
    // console.log(zipcode)
    // console.log(dollar)
    // console.log(newStartDate)
    // console.log(newEndDate)
    getJSON(eventType, catogoryID, zipcode, dollar, newStartDate, newEndDate, sortID)
    // generateHTML(eventName, eventLogo, eventStartTime, eventEndTime, ticket_Price)

  })



  });
