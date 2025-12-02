const routes: Routes = [
  { path: '', redirectTo: 'portal', pathMatch: 'full' },
  {
    path: 'portal',
    children: [
      { path: '', redirectTo: 'mis-reservas', pathMatch: 'full' },
      { path: 'mis-reservas', component: MisReservasComponent },
      { path: 'nueva-reserva', component: NuevaReservaComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  },
  // otras rutas...
];
