import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { PasswordReset } from './auth/password-reset/password-reset';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { EmailVerificationNotification } from './auth/email-verification-notification/email-verification-notification';
import { Logout } from './auth/logout/logout';
import { Dashboard } from './dashboard/dashboard';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'password-reset/:token', component: PasswordReset },
  { path: 'verify-email/:id/:hash', component: VerifyEmail },
  { path: 'email/verification-notification', component: EmailVerificationNotification },
  { path: 'logout', component: Logout },
  { path: '', component: Dashboard, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];