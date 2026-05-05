import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InviteService } from '../../../core/services/invite.service';

@Component({
  selector: 'app-accept-invite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './accept-invite.html',
  styleUrls: ['./accept-invite.scss'],
})
export class AcceptInviteComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  success = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inviteService = inject(InviteService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.form = this.fb.group({
      token: [token, Validators.required],
    });
  }

  get token() { return this.form.get('token'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.inviteService.accept(this.form.value).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Token inválido ou expirado.';
        this.isLoading = false;
      },
    });
  }
}
