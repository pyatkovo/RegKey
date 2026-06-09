// Для GitHub Pages логин и пароль неизбежно попадают в клиентскую сборку.
// Это подходит только как простой экран входа, а не как полноценная защита.
export const AUTH_CONFIG = {
  username: 'favitor',
  password: 'favitor123',
  sessionStorageKey: 'reg-key-authenticated'
} as const;
