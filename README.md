# Reg Key Angular 17

Angular 17 standalone-приложение для расчёта регистрационных ключей по логике старого Delphi-приложения.

## Запуск

```bash
npm install
npm start
```

Открыть: http://localhost:4200

## Закрытый вход

- логин и пароль задаются в `src/app/core/auth-config.ts`;
- текущие значения: `favitor` / `favitor123`;
- после входа сессия хранится в `localStorage`;
- для выхода есть кнопка `Выйти`.

Важно: если приложение размещено на GitHub Pages, логин и пароль всё равно находятся внутри браузерной сборки. Это защита только от случайного доступа, а не от человека, который посмотрит исходники JavaScript.

## Что есть

- расчёт регистрационного ключа;
- расчёт кода продления;
- история в localStorage;
- импорт/экспорт XML;
- простой экран входа;
- адаптивная верстка под телефон;
- standalone components, Angular 17 control flow `@for/@if`.

## GitHub Pages

- роутинг переведён на hash-URL, поэтому страницы работают на GitHub Pages без серверной настройки;
- для сборки под репозиторий Pages укажи base href, например: `npx ng build --configuration production --base-href /имя-репозитория/`;
- потом содержимое `dist/reg-key-angular17/browser` можно публиковать в ветку `gh-pages`.
- добавлен workflow `.github/workflows/deploy-pages.yml`: после пуша в `main` он соберёт и опубликует сайт через GitHub Actions.
