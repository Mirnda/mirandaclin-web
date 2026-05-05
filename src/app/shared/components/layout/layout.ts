import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class LayoutComponent {
  private auth = inject(AuthService);

  get userInitial(): string {
    return this.auth.jwtPayload()?.email?.charAt(0).toUpperCase() ?? 'U';
  }

  get userEmail(): string {
    return this.auth.jwtPayload()?.email ?? '';
  }

  get userRole(): string {
    return this.auth.jwtPayload()?.role ?? '';
  }

  logout(): void {
    this.auth.logout();
  }
}
