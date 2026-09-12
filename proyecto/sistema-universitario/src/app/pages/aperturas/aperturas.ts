import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aperturas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './aperturas.html',
  styleUrl: './aperturas.scss'
})
export class Aperturas implements OnInit {

  aperturas: any[] = [];

  editando = false;

  claveOriginal = {
    clave_asig: '',
    num_g: ''
  };

  nuevaApertura = {
    clave_asig: '',
    num_g: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAperturas();
  }

  cargarAperturas(): void {
    this.http
      .get<any[]>('http://127.0.0.1:8000/aperturas')
      .subscribe({
        next: (datos) => {
          this.aperturas = datos;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            'Error al cargar aperturas:',
            error
          );
        }
      });
  }

  guardarApertura(): void {

    if (
      !this.nuevaApertura.clave_asig ||
      !this.nuevaApertura.num_g
    ) {
      alert(
        'La asignatura y el grupo son obligatorios'
      );

      return;
    }

    if (this.editando) {

      const url =
        `http://127.0.0.1:8000/aperturas/` +
        `${this.claveOriginal.clave_asig}/` +
        `${this.claveOriginal.num_g}`;

      this.http
        .put(url, this.nuevaApertura)
        .subscribe({
          next: () => {
            alert(
              'Apertura actualizada correctamente'
            );

            this.cancelarEdicion();
            this.cargarAperturas();
          },
          error: (error) => {
            console.error(error);

            alert(
              error.error?.detail ||
              'Error al actualizar la apertura'
            );
          }
        });

    } else {

      this.http
        .post(
          'http://127.0.0.1:8000/aperturas',
          this.nuevaApertura
        )
        .subscribe({
          next: () => {
            alert(
              'Apertura agregada correctamente'
            );

            this.limpiarFormulario();
            this.cargarAperturas();
          },
          error: (error) => {
            console.error(error);

            alert(
              error.error?.detail ||
              'Error al agregar la apertura'
            );
          }
        });
    }
  }

  editarApertura(apertura: any): void {

    this.editando = true;

    this.claveOriginal = {
      clave_asig: apertura.clave_asig,
      num_g: apertura.num_g
    };

    this.nuevaApertura = {
      clave_asig: apertura.clave_asig,
      num_g: apertura.num_g
    };
  }

  eliminarApertura(apertura: any): void {

    if (
      !confirm(
        '¿Seguro que deseas eliminar esta apertura?'
      )
    ) {
      return;
    }

    const url =
      `http://127.0.0.1:8000/aperturas/` +
      `${apertura.clave_asig}/` +
      `${apertura.num_g}`;

    this.http
      .delete(url)
      .subscribe({
        next: () => {
          alert(
            'Apertura eliminada correctamente'
          );

          this.cargarAperturas();
        },
        error: (error) => {
          console.error(error);

          alert(
            error.error?.detail ||
            'No se pudo eliminar la apertura'
          );
        }
      });
  }

  cancelarEdicion(): void {

    this.editando = false;

    this.claveOriginal = {
      clave_asig: '',
      num_g: ''
    };

    this.limpiarFormulario();
  }

  limpiarFormulario(): void {

    this.nuevaApertura = {
      clave_asig: '',
      num_g: ''
    };
  }
}