import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss'],
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notification = inject(NotificationService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!token) {
      this.notification.set({ text: 'Token de verificação não encontrado.', type: 'error' });
      this.router.navigate(['/login']);
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: (res) => {
        this.notification.set({ text: res.message || 'E-mail verificado com sucesso!', type: 'success' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.set({ text: err?.error?.message ?? 'Token inválido ou expirado.', type: 'error' });
        this.router.navigate(['/login']);
      },
    });
  }
}
