import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss'],
})
export class VerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!token) {
      this.status = 'error';
      this.message = 'Token de verificação não encontrado.';
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: (res) => {
        this.status = 'success';
        this.message = res.message || 'E-mail verificado com sucesso!';
      },
      error: (err) => {
        this.status = 'error';
        this.message = err?.error?.message ?? 'Token inválido ou expirado.';
      },
    });
  }
}
