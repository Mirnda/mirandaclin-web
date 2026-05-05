import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  private auth = inject(AuthService);

  get greeting(): string {
    const email = this.auth.jwtPayload()?.email ?? 'usuário';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  get role(): string {
    return this.auth.jwtPayload()?.role ?? '';
  }
}
