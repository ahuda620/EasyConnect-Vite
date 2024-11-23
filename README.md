# [Easy Connect](https://easy-connect-vite.vercel.app/)

<img src="/images/image-1.png" alt="Homepage Screenshot" width="400"> <img src="/images/image-2.png" alt="Jobsearch Screenshot" width="400">  
<img src="/images/image-3.png" alt="Jobsearch mobile Screenshot" width="175">

## Description 
Easy Connect is a full-stack job board website that I developed to gain experience with web development. The project idea is inspired from a group project I worked on during university, where I was primarily responsible for the backend. However, I wanted to gain more knowledge about full stack development so I decided to make a website with a similar idea on my own. This project allowed me to work on my skills both in frontend and backend development as well as gain experience with integrating different technologies and deploying a full stack website that is also mobile responsive. Easy Connect is a fictional company that I came up with to fit the theme of the website.

## Technologies Used
* Frontend:
    * Javascript (Language)
    * Vite (Frontend build tool)
    * React (UI Framework)
    * React Router (Routing)
    * TanStack Query (State Management)
    * Axios (API Requests)
* Backend:
    * Node.js (Runtime Enviorment)
    * Express (Web Server)
    * MySQL (Database)
* Authethentication:
    * Clerk (User Authentication and Management)
* Deployment:
    * Vercel (Frontend hosting)
    * Railway (Backend hosting)
## APIs Used
* [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
## User Data
The only personal user information stored in the MySQL database is the user's first name or username, along with their unique Clerk user ID. The other user related data consists of job-related skills and saved job listings. This information is automatically deleted from the MySQL database when the user deletes their account through Clerk's profile panel.
