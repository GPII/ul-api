This directory contains a simple design document that will enable lucene integration with the Unified Listing.

All code follows the "couchapp" conventions and is meant to be deployed with that tool:

https://github.com/couchapp/couchapp

To push this design document to a couchdb instance, run a command like the following from this directory:

    couchapp push http://username:password@localhost:5984/ul

This will create a design document called /ul/_design/lucene.

You will also need to set up couchdb-lucene and configure couch to proxy requests per the instructions here:

    https://github.com/rnewson/couchdb-lucene

For the terminally lazy and incautious, you can set up the integration using the futon interface by adding a new
configuration entry.  Use the following settings:

|Field|Setting|
| --- | --- |
| section: | httpd_global_handlers |
| option: | \_fti |
| value: | {couch_httpd_proxy, handle_proxy_req, <<"http://127.0.0.1:5985">>} |


Assuming that you have proxied requests using the prefix "_fti", you will be able to see if Lucene integration is working using a URL like the following:

    http://localhost:5984/_fti/local/ul/_design/lucene/by_content?q=jaws&order=uid

You should see a list of records where any field matches "jaws" (the full search syntax is documented on the couchdb-lucene site).
