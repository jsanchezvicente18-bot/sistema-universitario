import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {

  totalAsignaturas = 0;
  totalGrupos = 0;
  totalProfesores = 0;
  totalAperturas = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTotales();
  }

  cargarTotales(): void {

    this.http
      .get<any[]>('http://127.0.0.1:8000/asignaturas')
      .subscribe({
        next: (datos) => {
          this.totalAsignaturas = datos.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar asignaturas:', error);
        }
      });

    this.http
      .get<any[]>('http://127.0.0.1:8000/grupos')
      .subscribe({
        next: (datos) => {
          this.totalGrupos = datos.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar grupos:', error);
        }
      });

    this.http
      .get<any[]>('http://127.0.0.1:8000/profesores')
      .subscribe({
        next: (datos) => {
          this.totalProfesores = datos.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar profesores:', error);
        }
      });

    this.http
      .get<any[]>('http://127.0.0.1:8000/aperturas')
      .subscribe({
        next: (datos) => {
          this.totalAperturas = datos.length;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar aperturas:', error);
        }
      });
  }
}