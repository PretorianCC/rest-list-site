<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## rest-server for nest

rest сервер для нового сайта https://list-site.ru

## Авторизация

**POST /api/auth/register** - регистрация аккаунта (отсылается ссылка на подтверждение).
body: {"login": "email", "password": "xxxx"}

**GET /api/auth/confirm** - подтверждение регистрации аккаунта и создание пользователя.
query:
  token - высланный токен подтверждения.

**POST /api/auth/login** - авториризация и получение jwt токена.
body: {"login": "email", "password": "xxxx"}

**POST /api/auth/restore** - запрос на востановление пароля.
body: {"login": "email"}

**GET /api/auth/restore** - страница изменения пароля.
query:
  token - высланный токен подтверждения.

## Пользователи

