# Taras Social Gallery
Final project for the course. Full stack app, based on Django framework, written in python backend, with React frontend.

<h2>Brief:</h2>
Website, which can people to browse through a gallery of posts, containing text with pictures optionally attached to it. There is a possibility to browse thorugh gallery as a guest, but as soon as you register and login, you can create your own posts, leave comments under existing ones, delete and edit posts and comments, if you created them and save posts to your favourites.  

<h2>Key features:</h2>
Gallery website, with CRUD functionality, saved favourites, commenting.

<h2>Deployed project:</h2>
<a href="https://taras-social-gallery.herokuapp.com/">Taras social gallery
</a>

<h2>Tech used:</h2>
<li>React Library - frontend.</li>
<li>Node.js, Django rest framework, PostgreSQL - backend.</li>
<li>Custom CSS - styling.</li>

<h2>Sample screenshots:</h2>

<img width="1400" alt="Screenshot 2021-08-17 at 11 54 55" src="https://user-images.githubusercontent.com/81250034/129695613-2c872467-f792-4364-b907-9db0b91d609a.png">
<br>
<img width="1369" alt="Screenshot 2021-08-17 at 12 07 27" src="https://user-images.githubusercontent.com/81250034/129697474-f7058ef2-33fa-4685-be0f-13df5de84ac2.png">
<img width="1367" alt="Screenshot 2021-08-17 at 12 08 47" src="https://user-images.githubusercontent.com/81250034/129697680-5a42af13-b495-4ecc-95ca-982a62099c81.png">
<br>
<h2>Build:</h2>
<li>Create Django project, start PostgreSQL, create database, migrate and run your server, create superuser. Then using "startapp" create your apps and make your models, import and register them, migrate. Add REST framework. Make sure it is listed in installed apps. Create serializers and views, make kind-of "router", using "path" and "urlpatterns", define engpoints in your project urls.py file. Define CRUD requests to your api and add seeds files. Repeat that for all models: create, register, migrate, serialize.</li>
<li>Start working on authentication. Add user model to settings, spicifying which one will be used. I used AbstractUser here, love prebuilds. Migrate, resolve migrations issues (if you do AUTH not as first thing) by creating seeds, dropping DB and deleting migrations. Create DB again, create superuser again, seed. I was using JWT, setting token decoding and ability to check DB for existing users based on "sub" part of token and comparing it with Primary key which is essentially user Id. Now you can handle access levels, using permission classes.</li>
<li>Make password validation, checking it againt DB stored password and hashing it, without inclusion in JSON. Create views for users, register and login, checking data agaisnt user model, if it mactches the requirements. When logging in, give user a token in order to grant particular permissions. Add owner fields to your models (in this case "posts" and "comments").</li>
<li>Start working on frontend, create Rreact app, add axios for requests, change api endpoints with '/api/' prefix, run frontend from client folder. Add react-router-dom, use Router, Switch and Route to establish the connection between components. Start developing the frontend functionality of the project.</li>
<li>Build your components, handling the requests and errors, storing data at state instances and using one for rendering. Use token set from backend as authentication piece allowing certain functionality on conditional ternaries, dependant on id match of current user and one, who added and information piece, ex. "post"</li>
<br>
(for more detailed examples see "sample code")
    
<h2>Sample code:</h2>
<li>Post model, super simple, set alike to post in twitter:</li>
<br>
<img src="https://user-images.githubusercontent.com/81250034/129712500-515a5929-14e0-46d8-83e3-f8625accb15f.png" alt="[Screenshot 2021-08-17 at 13 43 37]"/>
Only one field of all is optional - image. Created_at - automated. Hashtags - many to many, (refers to hashtag model). Owner field, many to one (referring to user model). 
<br>
<br>
<hr>
<li>All posts have 2 views, ListView and DetailView, both have functions working as requests to them:</li>
<br>
<img src="https://user-images.githubusercontent.com/81250034/129714169-d5b86660-5203-4fe7-83e7-eb52e1894b68.png" alt ="[Screenshot 2021-08-17 at 13 55 58]"/>
ListView "get" brings you back all posts as tesponse, "post" check new one against model criteria and if it has all needed, saves it to DB. 
<br>
<br>
DetailView allows us to delete and modify posts, also checking if edited post fits criteria. PK here - automatically applied sort of ID, used for request handling.
<br>
<br>
<hr>
<li>Little bit about authentication, lets have a look at password handling:</li>
<br>
<img src="https://user-images.githubusercontent.com/81250034/129717552-11899828-181b-48fc-ba44-b382ee63d474.png" alt="[Screenshot 2021-08-17 at 14 21 59]"/>
I won't save our password and its confirmation as they come, just use them for validation, check if they match, and then store password encrypted way. 
<br>
<br>
I will use other fields from class Meta in front-end building, that is why not all fields are returning as data.
<br>
<br>
<hr>
<li>Looking at the frontend, first thing I would like to pay attention to is sensitive information. I do need it for authentication, but I dont want to display it:</li>
<br>
<img src="https://user-images.githubusercontent.com/81250034/129725003-1076f353-cc8b-4914-80cb-a651f0382434.png" alt ="[Screenshot 2021-08-17 at 15 23 37]"/>
First thing I do here - email deletion, and only then any sort of logic.
<br>
<br>
<hr>
<li>I had an issue with my favourites, as it was saving only data at particular moment of time, not including any updates or added comments. Solution:</li>
<br>
<img src="https://user-images.githubusercontent.com/81250034/129726020-de40a50d-61be-48a8-96fb-026d772243ba.png" alt="[Screenshot 2021-08-17 at 15 32 11]"/>
My favourites are based in local storage, so I get them using JSON.parse. If that array is present (longer than 0), I am making sure, that savedPosts (favourites) are empty.
<br>
<br>
Using "for" loop, I am matching the id's if posts stored locally against ids of ones that are stored in DB, (meaning, updated, edited or untouched), and pushing them into "favourites".
<br>
<br>
Final thing - set right data to state of posts to be rendered correctly. Probably not too elegant, but works well.
<br>
<br>
<hr>
<li>Demo of responsiveness.</li>

https://user-images.githubusercontent.com/81250034/129736270-17e42b95-c26b-4ced-8af2-afedccc27f78.mov

<br>
This is because all custom CSS is based on VH and VW as dimensions.
<br>
<br>
<h2>Wins and challenges:</h2>
<h4>Wins</h4>
<li>Great possibility to develop both side of MERN APP, where I was concentrating on Authentiaction at the backend and Event section at the frontend.</li>
<li>Perfect opportunity to practice MongoDB, solidifying knowledge about relationships and modelling.</li>
<li>Lovely occasion of group programming, using GitHub collectively, practising version control and branch adjustments. Fantastic experience working as a part of great team, probably one of the most important experiences during the course. </li>

<h4>Challenges</h4>
<li>There was quite difficult way to manage error handling on contact form I created, I used default methods, that is still a point to improve.</li>
<li>Time-management, where we had to adjust our group work to 3 different time zones, balancing with self-development and healthy life.</li>
<li>Version control was quite challenging. I had to throw our development branch back once and restore data to needed condition, trying to resolve unnecessary node modules being pushed to it. Great fun!</li>

<h2>Potential improvements:</h2>
<li>Make server send emails when registering.</li>
<li>Shopping cart functionality, with potential booking slots available.</li>
<li>Functionality for the map definitely needs imporvements, all markers on it displayed simultaneously for now.</li>
<li>I would love to implement pin on map in order to set up location for workspace, rather than typing it in when trying to register new one.</li>

<h2>My colleagues, who also worked on this project:</h2>
<a href="https://github.com/emilesherrott">Emile Sherrot</a> | <a href="https://github.com/sarandis10">Sarantis Atonakas</a> | <a href="https://github.com/crigrande">Cristina Grande</a>
