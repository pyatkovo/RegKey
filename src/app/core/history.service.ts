import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeyHistoryItem } from './models';

const STORAGE_KEY = 'reg-key-history';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly itemsSubject = new BehaviorSubject<KeyHistoryItem[]>(this.read());
  readonly items$ = this.itemsSubject.asObservable();

  get items(): KeyHistoryItem[] {
    return this.itemsSubject.value;
  }

  add(item: KeyHistoryItem): void {
    const next = [item, ...this.items];
    this.save(next);
  }

  clear(): void {
    this.save([]);
  }

  remove(id: string): void {
    this.save(this.items.filter((item) => item.id !== id));
  }

  exportXml(): string {
    const escapeAttr = (value = '') => value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const rows = this.items.map((item, index) => {
      const nodeName = this.buildNodeName(item.employeeName, index + 1);
      return `  <${nodeName} Дата="${escapeAttr(this.formatRuDate(item.createdAt))}" ФИО_сотрудника="${escapeAttr(item.employeeName)}" Род_войск="${escapeAttr(item.troopsShort)}" Программный_продукт="${escapeAttr(item.programName)}" Место_установки="${escapeAttr(item.installPlace)}" Номер_ВЧ_ДО_ЗО_ДФО="${escapeAttr(item.unitNumber)}" Рег_номер="${escapeAttr(item.registrationNumber)}" Рег_ключ="${escapeAttr(item.registrationKey)}" />`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>\n<User_Login>\n${rows.join('\n')}\n</User_Login>`;
  }

  importXml(xmlText: string): number {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    const parseError = doc.querySelector('parsererror');

    if (parseError) {
      throw new Error('XML-файл не удалось прочитать');
    }

    const nodes = Array.from(doc.documentElement.children);
    const imported: KeyHistoryItem[] = nodes.map((node) => ({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      employeeName: node.getAttribute('ФИО_сотрудника') ?? '',
      troopsFull: node.getAttribute('Род_войск') ?? '',
      troopsShort: node.getAttribute('Род_войск') ?? '',
      programName: node.getAttribute('Программный_продукт') ?? '',
      programCode: 0,
      installPlace: node.getAttribute('Место_установки') ?? '',
      unitNumber: node.getAttribute('Номер_ВЧ_ДО_ЗО_ДФО') ?? '',
      registrationNumber: node.getAttribute('Рег_номер') ?? '',
      registrationKey: node.getAttribute('Рег_ключ') ?? ''
    }));

    const existingKeys = new Set(this.items.map((x) => `${x.registrationNumber}|${x.registrationKey}`));
    const unique = imported.filter((x) => !existingKeys.has(`${x.registrationNumber}|${x.registrationKey}`));
    this.save([...unique, ...this.items]);

    return unique.length;
  }

  private read(): KeyHistoryItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as KeyHistoryItem[];
    } catch {
      return [];
    }
  }

  private save(items: KeyHistoryItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  private buildNodeName(name: string, number: number): string {
    const initials = name
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .map((part) => part[0] ?? '')
      .join('') || 'U';

    return `${initials}_${number}`.replace(/[^A-Za-zА-Яа-яЁё0-9_]/g, '');
  }

  private formatRuDate(iso: string): string {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    }).format(date).replace(',', '');
  }
}
