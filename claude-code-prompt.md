# Claude Code Prompt: WordPress Theme для Laundromat

## Контекст проекта

Конвертируем статический HTML сайт прачечной в WordPress тему с билингвальной поддержкой (EN/GR).

**Исходный сайт:** https://laundromat-alpha.vercel.app/en
**Исходный код:** Статический HTML + Tailwind CSS + Vanilla JS (в папке `laundromat-wp-main/`)

## Задача

Создать WordPress тему, которая:
1. Полностью воспроизводит дизайн и анимации оригинального сайта
2. Позволяет управлять контентом через WordPress админку
3. Поддерживает два языка: English и Greek (через Polylang)
4. Использует ACF Pro для кастомных полей

## Структура проекта

Создай следующую структуру:

```
laundromat-theme/
├── docker-compose.yml          # Локальная разработка
├── .env.example
├── wp-content/
│   └── themes/
│       └── laundromat/
│           ├── style.css
│           ├── functions.php
│           ├── screenshot.png
│           ├── index.php
│           ├── front-page.php      # Главная страница
│           ├── page-services.php   # Услуги
│           ├── page-locations.php  # Локации  
│           ├── page-contact.php    # Контакты
│           ├── page-faq.php        # FAQ
│           ├── archive-instructions.php  # Инструкции (список)
│           ├── single-instructions.php   # Инструкция (детали)
│           ├── archive-tips.php    # Tips (список)
│           ├── single-tips.php     # Tip (детали)
│           ├── page-privacy.php    # Privacy Policy
│           ├── 404.php
│           ├── header.php
│           ├── footer.php
│           ├── inc/
│           │   ├── cpt.php              # Custom Post Types
│           │   ├── acf-fields.php       # ACF field groups (PHP)
│           │   ├── theme-setup.php      # Theme supports, menus
│           │   ├── enqueue.php          # Scripts & styles
│           │   ├── polylang.php         # Polylang integration
│           │   └── helpers.php          # Helper functions
│           ├── template-parts/
│           │   ├── hero-section.php
│           │   ├── services-section.php
│           │   ├── locations-section.php
│           │   ├── faq-section.php
│           │   ├── reviews-section.php
│           │   ├── tips-section.php
│           │   ├── contact-form.php
│           │   └── preloader.php
│           ├── acf-json/               # ACF sync folder
│           │   └── .gitkeep
│           └── assets/
│               ├── css/
│               │   ├── output.css      # Скопировать из оригинала
│               │   └── animations.css
│               ├── js/
│               │   ├── main.js
│               │   ├── header.js
│               │   ├── services-section.js
│               │   ├── location-section.js
│               │   ├── faq-section.js
│               │   ├── reviews-section.js
│               │   ├── tips-section.js
│               │   └── utils/
│               │       ├── spring.js
│               │       ├── scroll-utils.js
│               │       └── breakpoint.js
│               ├── images/
│               └── videos/
│                   └── preloader-speed.mp4
└── README.md
```

## Custom Post Types (в inc/cpt.php)

```php
// Services (Услуги)
'services' => [
    'public' => true,
    'has_archive' => false,
    'supports' => ['title', 'editor', 'thumbnail'],
    'menu_icon' => 'dashicons-archive',
    'show_in_rest' => true,
]

// Locations (Локации)
'locations' => [
    'public' => true,
    'has_archive' => false,
    'supports' => ['title', 'thumbnail'],
    'menu_icon' => 'dashicons-location',
    'show_in_rest' => true,
]

// Instructions (Инструкции)
'instructions' => [
    'public' => true,
    'has_archive' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'menu_icon' => 'dashicons-book',
    'show_in_rest' => true,
    'taxonomies' => ['instruction_category'],
]

// Tips (Советы)
'tips' => [
    'public' => true,
    'has_archive' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'menu_icon' => 'dashicons-lightbulb',
    'show_in_rest' => true,
    'taxonomies' => ['tip_category'],
]

// FAQs
'faqs' => [
    'public' => false,
    'publicly_queryable' => false,
    'supports' => ['title', 'editor'],
    'menu_icon' => 'dashicons-editor-help',
    'show_in_rest' => true,
]

// Reviews (Отзывы)
'reviews' => [
    'public' => false,
    'publicly_queryable' => false,
    'supports' => ['title', 'editor'],
    'menu_icon' => 'dashicons-star-filled',
    'show_in_rest' => true,
]
```

## ACF Field Groups

### Services Fields:
- `price_from` (number) — Цена от
- `time_from` (number) — Время от (минуты)
- `service_image_3d` (image) — 3D изображение услуги
- `learn_more_link` (url) — Ссылка "Learn more"

### Locations Fields:
- `address` (text) — Полный адрес
- `latitude` (number) — Широта
- `longitude` (number) — Долгота
- `store_hours` (text) — Часы работы
- `google_maps_link` (url) — Ссылка на Google Maps
- `map_position_mobile` (group: top, left) — Позиция на мобильной карте
- `map_position_desktop` (group: top, left) — Позиция на десктопной карте

### Reviews Fields:
- `reviewer_name` (text) — Имя
- `rating` (number, 1-5) — Рейтинг

### Contact Settings (ACF Options Page):
- `phone` (text)
- `email` (email)
- `address` (textarea)
- `working_hours` (textarea)
- `facebook_url` (url)
- `instagram_url` (url)
- `tiktok_url` (url)

### Hero Settings (ACF Options Page):
- `hero_title` (text)
- `hero_subtitle` (text)
- `hero_background` (image)

## Данные из оригинального сайта

### Services (из services.html):
1. **Laundry service** — from €15, from 30 min
2. **Self-service** — from €5, from 45 min  
3. **Dry cleaning** — from €20, from 24 hours

### Locations (из location-section.js):
1. Ethniki Palaiokastritsas, Kerkira 491 00, Greece — Mon-Sun 7am-11pm
2. Emergency Assistance of Kyklades S.A — Mon-Sun 7am-11pm
3. Ethniki Palaiokastritsas, Kerkira 491 00, Greece — Mon-Sun 7am-11pm

### FAQs (из faq-section на главной):
Извлеки все FAQ вопросы и ответы из index.html

### Categories:
- Tips and tricks
- Useful resources
- Company news

## Важные требования

### 1. Сохранить все анимации
Все JS файлы из `assets/js/` должны работать идентично оригиналу:
- Spring-based анимации
- Scroll-triggered эффекты
- Keen Slider для карусели локаций
- FAQ accordion
- Preloader

### 2. Tailwind CSS
- Скопировать `output.css` из оригинала
- Сохранить все кастомные классы и переменные

### 3. Polylang интеграция
```php
// В functions.php или inc/polylang.php
// Регистрация строк для перевода
if (function_exists('pll_register_string')) {
    pll_register_string('theme', 'Our location', 'laundromat');
    pll_register_string('theme', 'Services', 'laundromat');
    pll_register_string('theme', 'Instructions', 'laundromat');
    // ... все UI строки
}

// Хелпер для получения переведённых строк
function __t($string) {
    return function_exists('pll__') ? pll__($string) : $string;
}
```

### 4. Меню
Зарегистрировать два меню:
- `primary` — Основная навигация
- `footer` — Футер навигация

### 5. Docker для разработки

```yaml
# docker-compose.yml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DEBUG: 1
    volumes:
      - ./wp-content/themes/laundromat:/var/www/html/wp-content/themes/laundromat
      - wordpress_data:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db

volumes:
  wordpress_data:
  db_data:
```

## Конвертация HTML → PHP шаблонов

### Принцип:
1. Взять HTML из оригинального файла
2. Заменить захардкоженные данные на WordPress функции
3. Сохранить ВСЮ разметку и классы без изменений

### Пример (services section):

**Оригинал (HTML):**
```html
<div class="service-card" data-service-card>
  <h3>Laundry service</h3>
  <p>from €15</p>
  <p>from 30 min</p>
</div>
```

**WordPress (PHP):**
```php
<?php
$services = new WP_Query(['post_type' => 'services', 'posts_per_page' => -1]);
while ($services->have_posts()) : $services->the_post();
?>
<div class="service-card" data-service-card>
  <h3><?php the_title(); ?></h3>
  <p>from €<?php echo get_field('price_from'); ?></p>
  <p>from <?php echo get_field('time_from'); ?> min</p>
</div>
<?php endwhile; wp_reset_postdata(); ?>
```

## Шаги выполнения

1. **Создай структуру проекта** с docker-compose.yml
2. **Скопируй assets** (CSS, JS, images, videos) из оригинала
3. **Создай functions.php** с подключением всех inc/ файлов
4. **Реализуй CPT и ACF** в inc/cpt.php и inc/acf-fields.php
5. **Конвертируй каждую страницу** HTML → PHP:
   - index.html → front-page.php
   - services.html → page-services.php
   - location.html → page-locations.php
   - contact.html → page-contact.php
   - faq.html → page-faq.php
   - instructions.html → archive-instructions.php
   - tips.html → archive-tips.php
   - tips-details.html → single-tips.php (и single-instructions.php)
6. **Выдели общие части** в header.php, footer.php, template-parts/
7. **Адаптируй JS** для работы с динамическими данными (передавай данные через wp_localize_script)
8. **Протестируй все анимации**
9. **Добавь README** с инструкциями по установке

## Критически важно

1. **НЕ МЕНЯЙ** HTML структуру и CSS классы — они завязаны на анимации
2. **СОХРАНИ** все data-атрибуты (data-service-card, data-location-index и т.д.)
3. **ИСПОЛЬЗУЙ** wp_localize_script для передачи данных в JS вместо хардкода
4. **ПРОВЕРЬ** что Keen Slider и все Spring анимации работают

## Передача данных в JavaScript

```php
// В inc/enqueue.php
wp_localize_script('laundromat-location', 'laundromatLocations', [
    'items' => array_map(function($post) {
        return [
            'id' => $post->ID,
            'title' => get_the_title($post),
            'storeHours' => get_field('store_hours', $post->ID),
            'position' => [
                'mobile' => get_field('map_position_mobile', $post->ID),
                'desktop' => get_field('map_position_desktop', $post->ID),
            ],
        ];
    }, get_posts(['post_type' => 'locations', 'numberposts' => -1])),
]);
```

## Финальный чеклист

- [ ] Docker окружение запускается
- [ ] Тема активируется без ошибок
- [ ] Все CPT созданы и видны в админке
- [ ] ACF поля работают
- [ ] Главная страница отображается корректно
- [ ] Все анимации работают (preloader, scroll, accordion)
- [ ] Услуги загружаются из WordPress
- [ ] Локации отображаются на карте
- [ ] FAQ accordion работает
- [ ] Форма контактов работает
- [ ] Instructions/Tips архивы работают
- [ ] Polylang переключатель языков работает

---

## Запуск

```bash
# Клонировать и запустить
cd laundromat-theme
docker-compose up -d

# Открыть
# WordPress: http://localhost:8080
# phpMyAdmin: http://localhost:8081
```

После первого запуска:
1. Завершить установку WordPress
2. Активировать тему Laundromat
3. Установить и активировать ACF Pro, Polylang
4. Создать тестовый контент
