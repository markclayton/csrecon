var rest = require('restler')
var util = require('util')

function censysSearchIpv4(query, cb) {
  rest.post('https://www.censys.io/api/v1/search/ipv4', {
    username:"<CENSYS_API_ID>",
    password:"<CENSYS_SECRET>",
    data: JSON.stringify({
      query: query
    }),
  }).on('complete', function(data, response) {
    if (response.statusCode !== 200) {
      console.log(response.statusCode);
    } else {
      cb(data)
    }
  });
}

/*
  Performs the Censys View API call on given query, pulls the data censys has on the host.
  Right now it's not in use however it can be easily included by modifying the code a bit :)
  More information can be found here: https://censys.io/api/v1/docs/view
*/
/*
function censysViewIpv4(query, cb){
  rest.get('https://www.censys.io/api/v1/view/ipv4/' + query, {
    username:"<CENSYS_API_ID>",
    password:"<CENSYS_SECRET>",
    // data: JSON.stringify({query: query}),
  }).on('complete', function(data, response){
    if(response.statusCode !== 200){
      console.log('API Error', response.statusCode);
    }else{
      cb(data)
    }
  });
}*/

function shodan(input, cb){
  rest.get('https://api.shodan.io/shodan/host/' + input, {
    query: {key: "<SHODAN_API_KEY>"}
  }).on('complete', function(data, response){
      if(response.statusCode !== 200){
        var err = "Shodan API Error (Status Code): " + response.statusCode
        cb(err)
      }else{
        cb(null, data)
      }
    })
}

function viewShodanJSON(result) {
  result.forEach(function(item) {
      if(item){
        console.log("\n[*] *************************************");
        console.log("[*] Shodan Result Found: %s", item.data[0].ip_str);
        console.log("[*] *************************************");
        console.log(util.inspect(item, false, null));
      }
  })
}

function viewCensys(data) {
  console.log("--------------------------------------");
  console.log("*** Censys found the associated IP ***");
  console.log("--------------------------------------\n");
  data.results.forEach(function(item) {
    console.log("[*] IP: %s \t Ports: %s", item.ip, item.protocols);
  })
}

/*
  This makes a censys search ipv4 api call using the given query, and filters only the IP of each
  finding to an array. Afterwards, each IP is in turn used as the parameter for the shodan API to pull
  it's information.
*/
var query = process.argv[2]
censysSearchIpv4(query, function(data) {
  viewCensys(data);
  var ipArray = data.results.map(function(item) {
    return item.ip
  })
  var shodanResult = []
  var itemsProcessed = 0
  console.log("--------------------------------------");
  console.log("*** HANG ON: Bouncing each IP against Shodan ***");
  console.log("--------------------------------------");
  console.log("As of now the data is JSON, we will leave it up to you to sort through.\nIt's recommended this output is piped to a file for analysis.\n");
  ipArray.forEach(function(ip) {
    shodan(ip, function(err, result) {
      shodanResult.push(result)
      itemsProcessed++
      if (itemsProcessed === ipArray.length) {
        var shodanNoNull = shodanResult.filter(function(item) {
          return JSON.stringify(item) !== '{"matches":[],"facets":{"port":[]},"total":0}'
        })
        viewShodanJSON(shodanNoNull)
      }
    })
  })
})
