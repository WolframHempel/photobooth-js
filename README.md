photobooth-js
=============

A html5 widget that allows users to take their avatar pictures on your site.

For demos and documentation please see [https://wolframhempel.github.com/photobooth-js/](https://wolframhempel.github.com/photobooth-js/)

Now it can be installed with Bower:
bower install photobooth-js

To test over https:
$ npm install http-server
$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
$ http-server -C cert.pem -S
