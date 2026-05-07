import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserWithProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  form!: FormGroup;
  isLoading = signal(false);
  isEditMode = signal(false);
  showPassword = false;
  errorMessage = signal('');
  editId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!id);
    this.editId.set(id);

    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode() ? [] : [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      phone: [''],
      document: [''],
      has_whatsapp: [false],
      emergency_contact_name: [''],
      emergency_contact_phone: [''],
    });

    if (id) {
      this.isLoading.set(true);
      this.userService.getById(id).subscribe({
        next: (res) => {
          const u: UserWithProfile | undefined = res.data;
          if (u) {
            this.form.patchValue({
              full_name: u.full_name,
              email: u.email,
              role: u.role ?? '',
              phone: u.phone,
              document: u.document,
              has_whatsapp: u.has_whatsapp,
              emergency_contact_name: u.emergency_contact_name,
              emergency_contact_phone: u.emergency_contact_phone,
            });
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Erro ao carregar usuário.');
          this.isLoading.set(false);
        },
      });
    }
  }

  get fullName() { return this.form.get('full_name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get role() { return this.form.get('role'); }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const id = this.editId();
    if (id) {
      const value = { ...this.form.value };
      if (!value.password) delete value.password;

      this.userService.update(id, value).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao atualizar usuário.');
          this.isLoading.set(false);
        },
      });
    } else {
      this.userService.create(this.form.value).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message ?? 'Erro ao criar usuário.');
          this.isLoading.set(false);
        },
      });
    }
  }
}
