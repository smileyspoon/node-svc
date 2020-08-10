Several versions of a server, from a simple text request-response server to a more sophisticated API server. 

server-a - simple request/reply that will report back what you submit via a curl POST. 
Runs on port 8081, 8082 etc. 

server-b - more ambitious microservice API server, intended to call others. 
Runs on port 8500-8999. 

