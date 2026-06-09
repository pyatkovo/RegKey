import { ProgramOption, SelectOption } from './models';

export const TROOPS: SelectOption<string>[] = [
  { label: 'Вооруженные силы (Министерство обороны)', value: 'МО' },
  { label: 'Внутренние войска', value: 'ВВ' },
  { label: 'Пограничные войска', value: 'ПВ' }
];

export const INSTALL_PLACES: SelectOption<string>[] = [
  { label: 'Войсковая часть', value: 'Войсковая часть' },
  { label: 'ГФЭУ', value: 'ГФЭУ' },
  { label: 'ДО или ЗО', value: 'ДО или ЗО' },
  { label: 'ДФО', value: 'ДФО' }
];

export const PROGRAMS: ProgramOption[] = [
  { label: 'ДД и ЗП до 2014г.', code: 0 },
  { label: 'Финансовый учёт (DFO)', code: 1 },
  { label: 'Свод отчётности', code: 2 },
  { label: 'Назначение и финансирование', code: 3 },
  { label: 'ЗП с 2014г.', code: 4 },
  { label: 'ДД / Служба по контракту', code: 5 },
  { label: 'ДД / Срочная служба', code: 6 },
  { label: 'Пенсионный учёт ОВК', code: 11 },
  { label: 'Пенсионный учёт РВК', code: 12 },
  { label: 'Пенсионный учёт КГБ', code: 13 },
  { label: 'Почтовый клиент', code: 20 },
  { label: 'Складской учёт АХО', code: 30 },
  { label: 'Финансовый учёт (BUCHET)', code: 40 },
  { label: 'Учёт и движение мат.средств (УДМС)', code: 50 },
  { label: 'Учёт мат.средств (УМC)', code: 51 },
  { label: 'Учёт и движение мат.средств (СВОД)', code: 52 }
];
