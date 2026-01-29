# Алгоритм деплоя проекта Laundromat (WordPress)

Пошаговая инструкция для выкладки на хостинг с Plesk (например, PS.kz) или любой хостинг с PHP + MySQL.

---

## Алгоритм деплоя (кратко)

Подставьте свой адрес вместо `https://writecode.kz/laundromat` и домен вместо `writecode.kz`.

| № | Где | Действие |
|---|-----|----------|
| **Локально** |
| 1 | Компьютер | `docker compose up -d` → `./backup-db.sh` |
| 2 | Компьютер | В `database-backup.sql`: заменить `http://localhost:8080` на `https://writecode.kz/laundromat` |
| **Сервер: WordPress (бэкенд)** |
| 3 | Plesk | Установить WordPress в папку `/laundromat` (если ещё не установлен) |
| 4 | Plesk | Создать БД MySQL, сохранить имя, логин, пароль |
| 5 | phpMyAdmin | Импортировать `database-backup.sql` в эту БД |
| 6 | Сервер | В `wp-config.php`: прописать DB_NAME, DB_USER, DB_PASSWORD, DB_HOST; `$table_prefix = 'wp_';` |
| 7 | Сервер | Залить папку `wp-content/themes/laundromat/` в `.../laundromat/wp-content/themes/` |
| 8 | Сервер | Залить плагины (папки `akismet`, `polylang`) в `.../laundromat/wp-content/plugins/` — без дублирования Hello Dolly (только один: либо `hello.php`, либо папка `hello-dolly/`) |
| 9 | Браузер | Открыть `https://writecode.kz/laundromat/wp-admin` → Внешний вид → Темы → Активировать Laundromat |
| 10 | Браузер | Настройки → Постоянные ссылки → Сохранить |
| **Сервер: фронт (сайт для посетителей)** |
| 11 | Компьютер | Выполнить **`npm run build`** — соберётся `assets/css/output.css` (Tailwind). Без этого на хостинге стилей не будет. |
| 12 | Сервер | В **корень домена** (httpdocs для writecode.kz, не в папку laundromat) залить: все `.html`, папку **`assets/`** (включая **`assets/css/output.css`**), папку `el/` (если нужна), `favicon.ico` |
| 13 | Браузер | Открыть `https://writecode.kz` — должна открыться главная (index.html); API уже указывает на `/laundromat/wp-json` |

**Итог:** `https://writecode.kz` — сайт; `https://writecode.kz/laundromat` — админка и API.

---

## Вариант B: WordPress в корне, статика в приоритете (рекомендуется для laundromat.bymoroz.com)

В **корне домена** (public_html) лежат и статика, и WordPress; приоритет у статических файлов за счёт `.htaccess`. API и админка — в корне: `https://laundromat.bymoroz.com/wp-json`, `https://laundromat.bymoroz.com/wp-admin`.

**Структура на сервере:**

```
public_html/
├── .htaccess          ← из корня проекта (уже настроен под вариант B)
├── index.html
├── faq.html
├── contact.html
├── ... (остальные .html)
├── assets/
│   ├── css/
│   │   ├── output.css
│   │   └── animations.css
│   ├── js/
│   └── images/
├── el/                 (если нужна греческая версия)
├── favicon.ico
├── wp-admin/
├── wp-content/
├── wp-includes/
├── wp-config.php
├── index.php           (WordPress)
└── ... (остальные файлы WordPress)
```

**Шаги:**

1. Скачать [WordPress](https://wordpress.org/latest.zip), распаковать в **public_html** (в корень, не в подпапку).
2. Создать БД, импортировать `database-backup.sql`. В дампе заменить (или в БД после импорта) адрес на `https://laundromat.bymoroz.com`.
3. В **public_html** прописать в `wp-config.php` данные БД и **`$table_prefix = 'wp_';`**.
4. Залить тему **laundromat** в `public_html/wp-content/themes/laundromat/`, плагины — в `wp-content/plugins/`.
5. Локально выполнить **`npm run build`**, затем залить в **public_html** все **.html**, папку **assets/** (с `output.css`), при необходимости **el/**, **favicon.ico**.
6. Залить в корень **public_html** файл **`.htaccess`** из корня проекта (в нём уже прописаны правила варианта B).
7. В админке: **Settings → General** — WordPress Address и Site Address: `https://laundromat.bymoroz.com`. Сохранить. **Внешний вид → Темы** → активировать Laundromat. **Настройки → Постоянные ссылки** → Сохранить.

**Результат:** главная и статика — по своим путям; `/wp-admin` и `/wp-json` обрабатывает WordPress. Фронт в **api.js** по умолчанию обращается к `origin + '/wp-json'` (вариант B).

### Если /wp-json даёт 404 (Server Error / Page Not Found)

Сообщение вида «Page Not Found / Reload Page / Back to Previous Page / Home Page» обычно означает, что запрос **не доходит до WordPress** — 404 отдаёт веб‑сервер, а не PHP.

**1. Apache и .htaccess**

- Убедитесь, что файл **`.htaccess`** лежит в **корне** public_html (рядом с `index.php` и `index.html`).
- На хостинге должен быть включён **mod_rewrite** и **AllowOverride** для .htaccess (часто уже включено в Plesk для домена).

**2. Если хостинг использует nginx (Plesk и др.)**

Nginx **не читает .htaccess**. Тогда либо:

- **Включить Apache (proxy mode):** в Plesk: **Домены → laundromat.bymoroz.com → Apache и nginx** → в настройках nginx включить **Proxy mode** / использование Apache для PHP, чтобы .htaccess применялся.

- **Либо прописать правила в nginx:** в Plesk: **Домены → сайт → Apache и nginx → Дополнительные директивы nginx** и вставить (подставьте свой путь к корню и PHP, если отличается):

```nginx
location ~ ^/wp-json {
    try_files $uri $uri/ /index.php?$args;
}
location ~ ^/wp-admin {
    try_files $uri $uri/ /index.php?$args;
}
location ~ ^/wp-login\.php {
    try_files $uri =404;
    fastcgi_pass unix:/var/www/vhosts/system/laundromat.bymoroz.com/php-fpm.sock;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
location ~ \.php$ {
    try_files $uri =404;
    fastcgi_pass unix:/var/www/vhosts/system/laundromat.bymoroz.com/php-fpm.sock;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

(Точный путь к `php-fpm.sock` смотрите в Plesk для этого домена.)

**3. WordPress: постоянные ссылки**

В админке: **Настройки → Постоянные ссылки**. Выберите любой вариант **кроме** «Простые» (Plain), нажмите **Сохранить**. Это регистрирует маршруты для `/wp-json`.

После этого снова откройте `https://laundromat.bymoroz.com/wp-json/laundromat/v1/categories` — должен вернуться JSON, а не 404.

---

## Подготовка (локально)

### 1. Бэкап базы данных

```bash
./backup-db.sh
```

Файл `database-backup.sql` появится в корне проекта. Убедитесь, что контейнеры Docker запущены (`docker compose up -d`).

### 2. Замена URL в дампе (обязательно перед импортом на сервере)

В дампе сохранены адреса `http://localhost:8080`. Их нужно заменить на боевой домен.

**Вариант A — замена в файле до загрузки:**

- Откройте `database-backup.sql` в редакторе.
- Поиск и замена (все вхождения):
  - **Было:** `http://localhost:8080`
  - **Стало:** `https://ваш-домен.kz` (или `https://ваш-домен.com`)

**Вариант B — замена в БД после импорта (через phpMyAdmin):**

- Таблица `wp_options`: найти строки с `option_name` = `siteurl` и `home`, в `option_value` прописать новый URL.
- Либо выполнить SQL:
  ```sql
  UPDATE wp_options SET option_value = 'https://ваш-домен.kz' WHERE option_name IN ('siteurl', 'home');
  UPDATE wp_posts SET guid = REPLACE(guid, 'http://localhost:8080', 'https://ваш-домен.kz');
  UPDATE wp_users SET user_url = REPLACE(user_url, 'http://localhost:8080', 'https://ваш-домен.kz');
  ```

### 3. Что нужно для загрузки на сервер

- Папка **темы:** `wp-content/themes/laundromat/` (вся целиком).
- Папки **плагинов** (если используете): `wp-content/plugins/`, `wp-content/mu-plugins/`.
- Файл дампа: `database-backup.sql` (после замены URL).

На сервере должна быть установлена **полная WordPress** (ядро). У вас в репозитории только тема и плагины; ядро WordPress при локальной разработке идёт из Docker-образа.

---

## На сервере (Plesk / хостинг)

### 4. Домен и корень сайта

- В Plesk: **Domains** → ваш домен (или добавьте новый).
- Корневая папка сайта — обычно `httpdocs` или `public_html`. Запомните путь.

### 5. Установка WordPress (если ещё не установлен)

- **Вариант A:** В Plesk: **Applications** → установить WordPress в один клик в корень домена.
- **Вариант B:** Скачать [wordpress.org](https://wordpress.org/latest.zip), распаковать в `httpdocs`. Не трогать папки `wp-content/themes` и `wp-content/plugins`, если будете заливать свои.

После установки не обязательно проходить мастер настройки — вы замените БД и тему.

### 6. База данных MySQL

- В Plesk: **Databases** → **Add Database**.
- Имя БД, пользователь и пароль — придумайте и **сохраните** (нужны для `wp-config.php`).
- Откройте эту БД через **phpMyAdmin** (кнопка в Plesk).

### 7. Импорт дампа

- В phpMyAdmin выберите созданную БД.
- Вкладка **Импорт** → **Выберите файл** → `database-backup.sql` (уже с заменённым URL).
- **Вперёд**. Дождитесь окончания импорта.

Если в дампе есть `CREATE DATABASE` и он не совпадает с именем БД на хостинге — откройте `database-backup.sql`, удалите строки с `CREATE DATABASE` и `USE wordpress;`, замените `USE wordpress;` на `USE ваша_имя_бд;` при необходимости.

### 8. Настройка wp-config.php

На сервере в корне сайта (`httpdocs`) отредактируйте `wp-config.php`:

```php
define('DB_NAME', 'ваша_имя_бд');
define('DB_USER', 'ваш_пользователь_бд');
define('DB_PASSWORD', 'ваш_пароль_бд');
define('DB_HOST', 'localhost');   // или укажите хост из Plesk (часто localhost)
```

Для продакшена отключите отладку:

```php
define('WP_DEBUG', false);
```

Префикс таблиц: если в дампе таблицы с префиксом `wp_`, в `wp-config.php` должно быть `$table_prefix = 'wp_';` (по умолчанию так и есть).

### 9. Загрузка темы и плагинов

**Через FTP или Файловый менеджер (рекомендуется):**

- Залить папку `wp-content/themes/laundromat/` целиком в `httpdocs/wp-content/themes/laundromat/`
- При необходимости: содержимое `wp-content/plugins/` и `wp-content/mu-plugins/` в соответствующие папки на сервере.

**Если загружаете тему через «Внешний вид → Темы → Добавить → Загрузить тему» (ZIP):**

- В архиве должна быть **одна корневая папка** с именем темы, внутри неё — `style.css` и остальные файлы.
- Правильно: в ZIP корень — папка `laundromat`, в ней файлы `style.css`, `functions.php`, `index.php`, папки `inc/`, `assets/` и т.д.
- Неправильно: в корне ZIP сразу лежат `style.css`, `functions.php` без папки — тогда WordPress не найдёт имя темы и выдаст ошибку «не указано имя в метаданных».
- Как сделать: в проводнике выделить папку `laundromat` (а не её содержимое) → ПКМ → «Сжать» / «Отправить → Сжатая папка». Или из терминала: `cd wp-content/themes && zip -r laundromat.zip laundromat/`

Не удаляйте стандартные темы (Twenty Twenty-Four и т.д.) — WordPress может использовать их как fallback.

### 10. Активация темы

- В браузере: `https://ваш-домен.kz/wp-admin`
- Логин/пароль — те же, что в локальной БД (из дампа).
- **Внешний вид** → **Темы** → активировать **Laundromat**.

### 11. PHP

- В Plesk: **Domains** → ваш домен → **PHP Settings**.
- Версия PHP **8.0** или выше (рекомендуется 8.1/8.2).
- При необходимости включите нужные расширения (часто уже включены).

### 12. SSL (HTTPS)

- В Plesk: **Domains** → ваш домен → **SSL/TLS**.
- Включите **Let's Encrypt** (бесплатный сертификат), если доступно.
- После этого везде используйте `https://ваш-домен.kz` (уже должно быть заменено в дампе).

### 13. Проверка

- Откройте главную, страницы Услуги, Контакты, FAQ, Локации и т.д.
- Проверьте меню, ссылки, изображения.
- Зайдите в админку, сохраните **Настройки** → **Постоянные ссылки** (просто нажмите «Сохранить») — так обновятся правила rewrite.

---

## Краткий чеклист

| Шаг | Действие |
|-----|----------|
| 1 | Локально: `./backup-db.sh` |
| 2 | В `database-backup.sql` заменить `http://localhost:8080` на `https://ваш-домен` |
| 3 | На сервере: домен, при необходимости установить WordPress в корень |
| 4 | Создать БД и пользователя MySQL в Plesk |
| 5 | Импортировать `database-backup.sql` через phpMyAdmin |
| 6 | В `wp-config.php` прописать DB_NAME, DB_USER, DB_PASSWORD, DB_HOST |
| 7 | Залить тему `laundromat` в `wp-content/themes/` |
| 8 | В админке активировать тему Laundromat |
| 9 | Выставить PHP 8.0+ и при необходимости SSL |
| 10 | Проверить сайт и постоянные ссылки |

---

## Откат при проблемах

- Имейте резервную копию БД и папки `httpdocs` до деплоя.
- При «белом экране» включите в `wp-config.php`: `define('WP_DEBUG', true);` и смотрите лог ошибок.
- Если ссылки ведут на localhost — повторить замену URL в БД (шаг 2, вариант B).
