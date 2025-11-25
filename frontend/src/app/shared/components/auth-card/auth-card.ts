import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './auth-card.html',
  styleUrls: ['./auth-card.css']
})
export class AuthCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() backLink = true;
}
