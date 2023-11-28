# QT GLOBAL SOFTWARE TASK MANAGER

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Notable security features](#notable-security-features)
- [Authors](#authors)

## Description

This web-based application is designed to be user-friendly, allowing its users to effortlessly create, read, update, and delete tasks. Additionally, the user can assign their colleagues to the task and associate it with any of the projects they own. Furthermore, the user can attach files to the task for their colleagues' reference.

## Getting Started

```bash
git clone https://github.com/nishimweprince/qtglobal-taskmanager-fn.git
cd qtglobal-taskmanager-bn
```
- Install the dependencies using;
``` bash
npm install
```
- Check the `.env.example` file to find all required environment variables
- Run `npm run dev` to start the application

## Workflow

- You will automatically be redirected to the login page upon opening the application.
- Click on `Register here` to create an account. After that you will be logged into the application automatically.
- Click on `Create Task` to add a new task.
- On the create task page, fill in the task details and click on `Create Task` to create the task.
- Click on `Tasks` to view all tasks.
- Click on `Export Report` to print all tasks in a PDF file.

## Notable security features

- Passwords are hashed using bcrypt
- All pages are protected from unauthenticated users except the login and register pages.

## Authors

- [NISHIMWE Elysee Prince](https://www.linkedin.com/in/nishimweprince/)