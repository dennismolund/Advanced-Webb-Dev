You must first dowload docker desktop, if problems, guide available in course material.

"Docker-compose up" will run the latest build of the image (webbapp & database). If you make changes to an image, 
you need to rebuild it before using docker-compose up, or simply use the command docker-compose up --build.

Nodemon is fully functional for changes in app.js Changes outside of app.js will only be seen after restarting with: docker-compose up -V 
