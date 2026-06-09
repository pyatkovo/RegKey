import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class KeyGeneratorService {
  generateRegistrationKey(reg: string, programCode: number): string {
    const cleanedReg = reg.replace(/\s/g, '');

    if (!/^\d+$/.test(cleanedReg)) {
      throw new Error('Регистрационный номер введён некорректно');
    }

    const half = Math.floor(cleanedReg.length / 2);

    if (half === 0) {
      return '';
    }

    // Повтор Delphi: Copy(reg, 1, res) + Copy(reg, res, Length(reg)).
    // В Delphi строки с позиции 1, поэтому в JS второй substring начинается с half - 1.
    const firstPart = Number(cleanedReg.substring(0, half));
    const secondPart = Number(cleanedReg.substring(half - 1));
    const result = firstPart + secondPart + 281212 * programCode;

    return String(result).split('').reverse().join('');
  }

  generateProlongationCode(reg: string, programCode: number, prolongationDate: Date): string {
    const cleanedReg = reg.replace(/\s/g, '');

    if (!/^\d+$/.test(cleanedReg)) {
      throw new Error('Регистрационный номер введён некорректно');
    }

    const regNum = Number(cleanedReg);
    const now = new Date();
    let dop = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const diff = cleanedReg.length - dop.length;

    if (diff > 0) {
      dop += '9'.repeat(diff);
    }

    const delphiDate = this.toDelphiDate(prolongationDate);
    const code = delphiDate * programCode * 123 + regNum + Number(dop);

    return String(code);
  }

  private toDelphiDate(date: Date): number {
    const dayMs = 24 * 60 * 60 * 1000;
    const delphiZero = Date.UTC(1899, 11, 30);
    const target = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor((target - delphiZero) / dayMs);
  }
}
