# frontodonto — CLAUDE.md

## Visão Geral

SaaS multi-tenant para clínicas odontológicas (**mirandaclin API**). Um tenant representa uma clínica/empresa. Usuários têm papéis: `admin`, `dentist`, `secretary`, `patient`. O backend é uma API REST em Go, documentada em `docs/swagger_backend.json`.

## Stack

- Angular 21 — standalone components, `inject()` para DI
- TypeScript ~5.9
- RxJS ~7.8
- HttpClient (já provisionado em `app.config.ts`)
- Vitest para testes
- SCSS puro (sem biblioteca de UI externa)

## Estrutura de Pastas Alvo

```
src/app/
  core/
    interceptors/
      auth.interceptor.ts       # injeta Bearer token em requisições /v1/api/**
    guards/
      auth.guard.ts             # redireciona para /login se não autenticado
      guest.guard.ts            # redireciona para /dashboard se já autenticado
    services/
      auth.service.ts           # login, register, logout, token
    models/                     # interfaces TypeScript para todos os domínios
      user.model.ts
      clinic.model.ts
      appointment.model.ts
      consultation.model.ts
      invite.model.ts
      address.model.ts
      api-response.model.ts
  features/
    auth/
      login/
      register/
      verify-email/
      accept-invite/
    dashboard/
    clinics/
      list/
      form/
    appointments/
      list/
      form/
    consultations/
      list/
      form/
    users/
      list/
      form/
    invites/
      form/
  shared/
    components/
    pipes/
    directives/
```

## API Backend

- **Base URL:** `http://localhost:8080`
- **Autenticação:** Header `Authorization: Bearer <token>`
- **Envelope de resposta padrão:**
  ```json
  { "success": boolean, "message": string, "data": any }
  ```

### Endpoints

#### Auth (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/api/auth/login` | Login — body: `{ email, password, tenant_id? }` → retorna token |
| POST | `/v1/api/auth/register` | Registrar nova clínica → cria tenant + admin |
| GET | `/v1/api/auth/verify-email?token=` | Verificar email via query param |

#### Clínicas (auth obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/v1/api/clinics` | Listar clínicas do tenant |
| POST | `/v1/api/clinics` | Criar clínica |
| GET | `/v1/api/clinics/:id` | Obter clínica por ID |
| PUT | `/v1/api/clinics/:id` | Atualizar clínica |
| DELETE | `/v1/api/clinics/:id` | Remover clínica |

#### Agendamentos (auth obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/api/appointments` | Criar agendamento |
| GET | `/v1/api/appointments/patient/:patient_id` | Listar agendamentos do paciente |
| PATCH | `/v1/api/appointments/:id/cancel` | Cancelar agendamento |

#### Consultas (auth obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/api/consultations` | Criar relatório de consulta |
| GET | `/v1/api/consultations/patient/:patient_id` | Consultas do paciente |
| GET | `/v1/api/consultations/dentist/:dentist_id` | Consultas do dentista |

#### Usuários (auth obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/api/users` | Criar usuário no tenant |
| GET | `/v1/api/users/:id` | Obter usuário por ID |

#### Convites

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/api/invites` | Gerar convite por email (auth obrigatória) |
| POST | `/v1/api/invites/accept` | Aceitar convite e criar conta (sem auth) |

## Modelos TypeScript

Criar em `src/app/core/models/`:

```typescript
// api-response.model.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// address.model.ts
export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}

// user.model.ts
export type UserRole = 'admin' | 'dentist' | 'secretary' | 'patient';

export interface User {
  id: string;
  full_name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  has_whatsapp: boolean;
  document: string;
  birth_date: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  address: Address;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id?: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  tenant_name?: string;
}

export interface CreateUserRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  has_whatsapp?: boolean;
  document?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface AcceptInviteRequest {
  token: string;
}

// clinic.model.ts
export interface Clinic {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  address: Address;
  open_time: string;
  close_time: string;
  operating_days: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateClinicRequest {
  name: string;
  phone?: string;
  address?: Address;
  open_time?: string;
  close_time?: string;
  operating_days?: string[];
}

export interface UpdateClinicRequest {
  name?: string;
  phone?: string;
  address?: Address;
  open_time?: string;
  close_time?: string;
  operating_days?: string[];
}

// appointment.model.ts
export interface Appointment {
  id: string;
  tenant_id: string;
  clinic_id: string;
  patient_id: string;
  dentist_id: string;
  secretary_id: string;
  scheduled_at: string;
  status: string;
  notes: string;
  canceled_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  clinic_id: string;
  patient_id: string;
  dentist_id: string;
  scheduled_at: string;
  secretary_id?: string;
  notes?: string;
}

// consultation.model.ts
export interface Consultation {
  id: string;
  tenant_id: string;
  appointment_id: string;
  patient_id: string;
  dentist_id: string;
  diagnosis: string;
  treatment: string;
  created_at: string;
}

export interface CreateConsultationRequest {
  appointment_id: string;
  patient_id: string;
  diagnosis: string;
  treatment: string;
}

// invite.model.ts
export interface Invite {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
  token: string;
  event_id: string;
  expires_at: string;
  used_at: string;
  created_at: string;
}

export interface CreateInviteRequest {
  email: string;
  password: string;
  role: UserRole;
}
```

## Rotas Angular

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Públicas
  { path: 'login',         loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),               canActivate: [guestGuard] },
  { path: 'register',      loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),       canActivate: [guestGuard] },
  { path: 'verify-email',  loadComponent: () => import('./features/auth/verify-email/verify-email').then(m => m.VerifyEmailComponent) },
  { path: 'accept-invite', loadComponent: () => import('./features/auth/accept-invite/accept-invite').then(m => m.AcceptInviteComponent) },

  // Privadas
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [authGuard] },

  { path: 'clinics', canActivate: [authGuard], children: [
    { path: '',        loadComponent: () => import('./features/clinics/list/clinic-list').then(m => m.ClinicListComponent) },
    { path: 'new',     loadComponent: () => import('./features/clinics/form/clinic-form').then(m => m.ClinicFormComponent) },
    { path: ':id/edit',loadComponent: () => import('./features/clinics/form/clinic-form').then(m => m.ClinicFormComponent) },
  ]},

  { path: 'appointments', canActivate: [authGuard], children: [
    { path: '',    loadComponent: () => import('./features/appointments/list/appointment-list').then(m => m.AppointmentListComponent) },
    { path: 'new', loadComponent: () => import('./features/appointments/form/appointment-form').then(m => m.AppointmentFormComponent) },
  ]},

  { path: 'consultations', canActivate: [authGuard], children: [
    { path: '',    loadComponent: () => import('./features/consultations/list/consultation-list').then(m => m.ConsultationListComponent) },
    { path: 'new', loadComponent: () => import('./features/consultations/form/consultation-form').then(m => m.ConsultationFormComponent) },
  ]},

  { path: 'users', canActivate: [authGuard], children: [
    { path: '',    loadComponent: () => import('./features/users/list/user-list').then(m => m.UserListComponent) },
    { path: 'new', loadComponent: () => import('./features/users/form/user-form').then(m => m.UserFormComponent) },
  ]},

  { path: 'invites', canActivate: [authGuard], children: [
    { path: 'new', loadComponent: () => import('./features/invites/form/invite-form').then(m => m.InviteFormComponent) },
  ]},

  { path: '**', redirectTo: 'dashboard' },
];
```

## Autenticação e Segurança

- Token JWT armazenado em `localStorage` com chave `token`
- `authInterceptor` (functional): adiciona `Authorization: Bearer <token>` em todas as requisições para `/v1/api/**`
- Ao receber 401, limpar o token e redirecionar para `/login`
- `authGuard`: verifica presença do token; redireciona para `/login` se ausente
- `guestGuard`: se token presente, redireciona para `/dashboard`
- Registrar interceptor via `provideHttpClient(withInterceptors([authInterceptor]))` no `app.config.ts`

### Exemplo de interceptor funcional

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token && req.url.includes('/v1/api/')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem('token');
        inject(Router).navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
```

## Ambiente

Criar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
```

Usar `environment.apiUrl` como prefixo em todos os serviços HTTP.

## Convenções de Código

- Componentes sempre `standalone: true`
- Usar `inject()` — nunca constructor DI
- Serviços com `providedIn: 'root'`
- Nomes de arquivo: `kebab-case`; classes: `PascalCase`
- Templates em `.html` separados; estilos em `.scss` por componente
- `ReactiveFormsModule` para todos os formulários
- Sem comentários desnecessários; nomes auto-descritivos
- Lazy loading em todas as rotas de feature (`loadComponent`)

## Estado Atual do Projeto

| Arquivo | Status |
|---------|--------|
| `src/app/login/` | Implementado — mover para `features/auth/login/` |
| `src/app/auth.service.ts` | Implementado — mover para `core/services/` |
| `src/app/login copy/` | Duplicata — remover |
| `core/`, `features/`, `shared/` | A criar |

**Bug conhecido:** `auth.service.ts` aponta para `/v1/api/login` — corrigir para `/v1/api/auth/login`.

## Papéis de Usuário

| Role | Permissões |
|------|-----------|
| `admin` | Acesso total: clínicas, usuários, convites, agendamentos, consultas |
| `dentist` | Agendamentos, suas próprias consultas |
| `secretary` | Criar e cancelar agendamentos |
| `patient` | Ver seus agendamentos e consultas |
