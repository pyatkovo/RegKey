import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HistoryService } from '../../core/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  readonly items$ = this.history.items$;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly history: HistoryService
  ) {}

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  remove(id: string): void { this.history.remove(id); }
  clear(): void { this.history.clear(); }

  exportXml(): void {
    const blob = new Blob([this.history.exportXml()], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `User_Login_${new Date().getFullYear()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  openImport(): void { this.fileInput?.nativeElement.click(); }

  async importXml(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    this.history.importXml(text);
    input.value = '';
  }
}
