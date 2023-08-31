ИНСТРУКЦИЯ ЗАПУСКА
=========================

  	1. исправить .env файл под себя
    2. npm install
    3. npm run db:refresh
    4. npm run start

API
=========================
Регистрация

    POST api/registration 

Авторизация

    POST api/login         
Статьи с возможностью филтрации по тегам (?filter=first,second)

    GET api/article 
Поиск статьи по id

    GET api/article/:id

Создание статьи

    POST api/post

Обновление статьи

    PATCH api/article/:id

Удаление статьи

    DELETE api/article/:id

