<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## rest-server for nest

rest сервер для нового сайта https://list-site.ru

## Авторизация

**POST /api/auth/register** - регистрация аккаунта (отсылается ссылка на подтверждение).  
body: {"login": "exsample@exsample.ru", "password": "123"}

**GET /api/auth/confirm** - подтверждение регистрации аккаунта и создание пользователя.  
query:  
  token - высланный токен подтверждения.

**POST /api/auth/login** - авториризация и получение jwt токена.  
body: {"login": "exsample@exsample.ru", "password": "123"}

**POST /api/auth/restore** - запрос на востановление пароля.  
body: {"login": "exsample@exsample.ru"}

**GET /api/auth/restore** - страница изменения пароля.  
query:  
token - высланный токен подтверждения.

**POST /api/auth/change** - изменение пароля.  
body: {"token": "3a669ffb-5e8c-4a64-b5be-0c807326551b", "password": "123", "passwordOld": "123"}
## Пользователи

