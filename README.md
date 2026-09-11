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

- Деплой виконується workflow файлом `/home/runner/work/dealX/dealX/.github/workflows/deploy-pages.yml`
- Після push у `main` GitHub Actions збиратиме проєкт і публікуватиме `dist` у GitHub Pages
- У репозиторії увімкни: **Settings → Pages → Source: GitHub Actions**
