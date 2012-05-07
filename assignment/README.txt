*************************************************************
STUDENT INFO

Name - Fergal Tobin
Student No - 01026038
Module - Mobile Web Development Assignment 2 - Cow Record App

************************************************************
SUMMARY

Cow Record Application allows you to
1. Login using facebook or twitter
2. Add a cow to the database. Entering importand details regarding calfing and breeding season 
3. View cow details
4. Delete a cow
5. Add a calf
6. Delete a calf
7. Mark calf as sold

************************************************************
GITHUB LOCATION

git git@github.com:fergaltobin/assignment2.git
heroku http://simple-journey-9386.herokuapp.com/

************************************************************
INSTALLATION

Configuration:

node.js -> /assignment2/node lib/db-server.js

Install nginx - http://nginx.org
Install node - http://nodejs.org

************************************************************
CONFIGURATION
nginx:
Config file: assignment2/conf/nginx.conf
c:/nginx
Start: nginx
Stop: nginx -s stop

node:
Directory >>  C:/Assignment2

Start: node node/lib/db-server.js
Stop: Ctrl C

Mongo:
MongoHQ: mongohq.com
Mongo Console: mongo flame.mongohq.com:27102/admin -u admin -p 

************************************************************
APP FEATURES
Cow Record App: 
Implemented using Backbone, jQuery, jQuery Mobile, mongodb and Underscore.

Add Cow/Calf:	
	The user can add a cow by tapping the Add Button top right-hand corner, this will enable a text boxes in which
	data can be entered and two additional buttons, Save & Cancel.
	The user can enter text, and hit Save to save player details to the team list.
	If the user taps cancel, the item is not saved, and then text boxes slides-up out of view.

Delete Cow/Calf
	If the user swipes right on any of the cows in the list then the Delete Button becomes active, which enables the user
	to Delete a cow/calf by tapping on the Delete Button. 
	If a user swipe left then the Delete buttin is hidden again. 			

Remote storage:
	Implemented using remote Mongo database on mongohq.com, configuration is set in node/lib/db-server.js


************************************************************
ISSUES 
Lots of issues completing assignment 2.
Time: Lack of time due to work commitments to implement all planned features
Very limited access to a iphone or android phones.


