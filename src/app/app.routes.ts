import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { KeyCalculatorComponent } from './features/key-calculator/key-calculator.component';
import { HistoryComponent } from './features/history/history.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: KeyCalculatorComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
