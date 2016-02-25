##  CSRecon - Censys and Shodan Reconnasiance Tool

_Censys + Shodan = A Good Time :)_

[Shodan](https://www.shodan.io/) and [Censys](https://censys.io/) are two services that are known to provide a wealth of information about a specific target. This is a useful passive reconnaissance tool that leverages both of their APIs to grab useful network-related information about a target. Of course both of these APIs are capable of much more, however this is a fairly specific use case. As of now it retrieves the following without ever touching the actual network:

- IP addresses that were found to have an association with target 
- open ports and protocols per IP (Saves some nmap time) 
- os detection (if possible)
- geolocation of each IP
- hostnames and domains associated with IP
- related ISP
- banner grabbing (if possible)
- Hosting (Rackspace? Amazon?)

It's pretty useful because all of this information can be discovered, in about 15 seconds, by simply providing the target/organization name. 

### Prerequisites
It should work on any Linux/Unix/OSX platform with [node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. 

Also, you'll beed to **get API keys from both Censys and Shodan.** Include these into the following appropriate fields. 

```
/* inside censysSearchIpv4() function */
    username: "<CENSYS_API_ID>",
    password: "<CENSYS_SECRET>",
    
/* inside shodan() function */
    query: {key: "<SHODAN_API_KEY>"}
```

### Usage
Clone this repository && cd into project directory
```
git clone https://github.com/markclayton/csrecon
cd recon
```
Install dependency packages
```
npm install
```
CSRecon takes one parameter, which is the target name. It should be the same value you would use via the Censys website. It's often a good idea to try it out there first to see the results you would initially get. Run the following command:
```
node . [target-name]
```
or 
```
node index.js [target-name] | tee output.txt
```
It's recommended this be piped to a file (shown above) to analyze the details. Also, since this tool makes several API request to Shodan, you may bounce against the API limits and get some error codes (502 Bad Gateway). If this happens give it a few minutes and try again. 

### Additional
- There is a function called censysViewSearch() provided that will pull more detailed information that Censys gathered about each IP. You can uncomment and work into the code if you'd like.
