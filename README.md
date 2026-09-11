# dealX

## Local запуск

```bash
npm ci
npm run dev
```

## Продакшн збірка

```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages

- Деплой виконується workflow файлом `.github/workflows/deploy-pages.yml`
- У `vite.config.js` встановлено `base: '/dealX/'`, щоб статичні файли коректно відкривались у GitHub Pages
- Після push у `main` GitHub Actions збиратиме проєкт і публікуватиме `dist` у GitHub Pages
- У репозиторії увімкни: **Settings → Pages → Source: GitHub Actions**
