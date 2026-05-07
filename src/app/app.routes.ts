import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./features/auth/verify-email/verify-email').then(m => m.VerifyEmailComponent),
  },
  {
    path: 'accept-invite',
    loadComponent: () => import('./features/auth/accept-invite/accept-invite').then(m => m.AcceptInviteComponent),
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'clinics',
        children: [
          { path: '', loadComponent: () => import('./features/clinics/list/clinic-list').then(m => m.ClinicListComponent) },
          { path: 'new', loadComponent: () => import('./features/clinics/form/clinic-form').then(m => m.ClinicFormComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/clinics/form/clinic-form').then(m => m.ClinicFormComponent) },
        ],
      },
      {
        path: 'appointments',
        children: [
          { path: '', loadComponent: () => import('./features/appointments/list/appointment-list').then(m => m.AppointmentListComponent) },
          { path: 'new', loadComponent: () => import('./features/appointments/form/appointment-form').then(m => m.AppointmentFormComponent) },
        ],
      },
      {
        path: 'consultations',
        children: [
          { path: '', loadComponent: () => import('./features/consultations/list/consultation-list').then(m => m.ConsultationListComponent) },
          { path: 'new', loadComponent: () => import('./features/consultations/form/consultation-form').then(m => m.ConsultationFormComponent) },
        ],
      },
      {
        path: 'patients',
        children: [
          { path: '', loadComponent: () => import('./features/patients/list/patient-list').then(m => m.PatientListComponent) },
          { path: 'new', loadComponent: () => import('./features/patients/form/patient-form').then(m => m.PatientFormComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/patients/form/patient-form').then(m => m.PatientFormComponent) },
        ],
      },
      {
        path: 'users',
        children: [
          { path: '', loadComponent: () => import('./features/users/list/user-list').then(m => m.UserListComponent) },
          { path: 'new', loadComponent: () => import('./features/invites/form/invite-form').then(m => m.InviteFormComponent) },
          { path: ':id/edit', loadComponent: () => import('./features/users/form/user-form').then(m => m.UserFormComponent) },
        ],
      },
      {
        path: 'invites',
        children: [
          { path: 'new', loadComponent: () => import('./features/invites/form/invite-form').then(m => m.InviteFormComponent) },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
