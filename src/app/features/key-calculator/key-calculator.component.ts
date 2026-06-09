import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HistoryService } from '../../core/history.service';
import { KeyGeneratorService } from '../../core/key-generator.service';
import { ProgramOption, SelectOption } from '../../core/models';
import { INSTALL_PLACES, PROGRAMS, TROOPS } from '../../core/options';

@Component({
  selector: 'app-key-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './key-calculator.component.html',
  styleUrl: './key-calculator.component.css'
})
export class KeyCalculatorComponent {
  readonly troops: SelectOption<string>[] = TROOPS;
  readonly programs: ProgramOption[] = PROGRAMS;
  readonly installPlaces: SelectOption<string>[] = INSTALL_PLACES;

  readonly resultKey = signal('');
  readonly prolongationCode = signal('');
  readonly message = signal('');
  readonly today = new Date().toISOString().slice(0, 10);

  readonly form = this.fb.nonNullable.group({
    employeeName: ['Михайлов Сергей Евгеньевич', Validators.required],
    troopsShort: ['', Validators.required],
    programCode: [null as number | null, Validators.required],
    installPlace: ['', Validators.required],
    unitNumber: ['', Validators.required],
    registrationNumber: ['', Validators.required],
    prolongationDate: [this.today]
  });

  readonly unitLabel = computed(() => {
    const place = this.form.controls.installPlace.value;
    if (place === 'ДО или ЗО') return '№ ДО / ЗО';
    if (place === 'ДФО') return 'Аббревиатура';
    return '№ войсковой части';
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly keyGenerator: KeyGeneratorService,
    private readonly history: HistoryService
  ) {}

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  calculateKey(): void {
    this.message.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.set('Заполни обязательные поля');
      return;
    }

    try {
      const value = this.form.getRawValue();
      const program = this.programs.find((item) => item.code === value.programCode)!;
      const troops = this.troops.find((item) => item.value === value.troopsShort)!;
      const registrationKey = this.keyGenerator.generateRegistrationKey(value.registrationNumber, value.programCode!);
      this.resultKey.set(registrationKey);

      this.history.add({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        employeeName: value.employeeName,
        troopsFull: troops.label,
        troopsShort: troops.value,
        programName: program.label,
        programCode: program.code,
        installPlace: value.installPlace,
        unitNumber: value.unitNumber,
        registrationNumber: value.registrationNumber.replace(/\s/g, ''),
        registrationKey
      });

      this.message.set('Ключ рассчитан и сохранён в историю');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Ошибка расчёта');
    }
  }

  calculateProlongationCode(): void {
    this.message.set('');

    const value = this.form.getRawValue();
    if (!value.registrationNumber || value.programCode === null || !value.prolongationDate) {
      this.message.set('Для кода продления нужен продукт, рег. номер и дата');
      return;
    }

    try {
      const code = this.keyGenerator.generateProlongationCode(
        value.registrationNumber,
        value.programCode,
        new Date(value.prolongationDate)
      );
      this.prolongationCode.set(code);
      this.message.set('Код продления рассчитан');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Ошибка расчёта');
    }
  }
}
