import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PersonaUsuario } from "../../models/personaUsuario";
import { cedula, fechaActual, idCaja, idEmpresa } from 'src/environments/environment';
import { idRol } from 'src/environments/environment';
import { idSucursal } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { CajaService } from 'src/app/services/caja.service';
import Swal from 'sweetalert2';
import { CajaRequest } from 'src/app/models/caja';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  showFiller = false;
  panelOpenState = false;
  persona: PersonaUsuario = new PersonaUsuario();
  aperturaListaGuardar: CajaRequest = new CajaRequest();


  constructor(private router: Router,
    private _snackBar: MatSnackBar,
    private titulo: Title,
    private cajaService: CajaService,

  ) { titulo.setTitle('MEGA SYSTEM') }


  ngOnInit(): void {

    this.capturafechaActual();
    try {
      JSON.parse(sessionStorage['personausuario']);
      if (JSON.parse(sessionStorage['personausuario']) == '') {
        this.router.navigate(['auth/iniciosesion']).then(() => {
          this._snackBar.open('ERROR NO HA INCIADO SESION', 'ACEPTAR');
        });
      } else {
        this.persona = JSON.parse(sessionStorage['personausuario']);
        if (this.persona.idRol == 1) {
          this.persona.rol = "Estudiante"
        }
        if (this.persona.idRol == 2) {
          this.persona.rol = "Profesor"
        }
        if (this.persona.idRol == 3) {
          this.persona.rol = "INCRIPCION Y USO"
        }
        if (this.persona.idRol == 4) {
          this.persona.rol = "REPORTES"
        }
        this._snackBar.open('Bienvenido/a ' + this.persona.nombres, 'ACEPTAR');
        cedula.setcedula = this.persona.cedula;
        idRol.setidRol = this.persona.idRol;
        idSucursal.setIdSucursal = this.persona.idSucursal;
        idEmpresa.setIdEmpresa = this.persona.idEmpresa;
        idCaja.setIdCaja = this.persona.idCaja;

        var fecha = new Date(fechaActual.getFechaActual);

        this.consultaApertura(cedula.getCedula, fecha);
      }
    } catch (e) {
      this.router.navigate(['auth/iniciosesion']).then(() => {
        this._snackBar.open('ERROR NO HA INCIADO SESION', 'ACEPTAR');
      });
    }
  }


  consultaApertura(cedulaUsuario: any, fechaActual: any) {
    this.cajaService.getApertura(cedulaUsuario, fechaActual).subscribe(value => {

      if (value.id == 0) {
        Swal.fire({
          title: 'Generar apertura de caja?',
          text: "Ingresa apertura para usar ventas",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Generar apertura!'
        }).then((result) => {
          if (result.isConfirmed) {

            Swal.fire({
              title: "Ingrese cantidad",
              input: "text",
              showCancelButton: true,
              confirmButtonText: "Guardar",
              cancelButtonText: "Cancelar",
              background: '#FFFFFF',
              confirmButtonColor: '#a01b20',
              backdrop: false
            })
              .then(resultado => {
                if (resultado.value) {

                  this.aperturaListaGuardar.cedulaUsuario = cedula.getCedula;
                  this.aperturaListaGuardar.saldoApertura = resultado.value;

                  this.cajaService.createApertura(this.aperturaListaGuardar).subscribe(value => {

                    idCaja.setIdCaja = value.id;

                    this._snackBar.open('Apertura Caja Creado', 'ACEPTAR');
                  }, error => {
                    this._snackBar.open(error.error.message, 'ACEPTAR');
                  })
                }
              });

          }
        })
      } else {
        idCaja.setIdCaja = value.id;
      }

    }, error => {
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })



  }

  logout(): void {
    sessionStorage.clear();
    localStorage.removeItem("personausuario");
    sessionStorage.setItem('personausuario', JSON.stringify(""));
    this.router.navigate(['auth/iniciosesion']).then(() => {
    });
    idCaja.setIdCaja = 0;
  }

  public capturafechaActual() {

    const fecha = new Date();
    const añoActual = fecha.getFullYear();
    var hoy2: String = String(fecha.getDate());
    var mesActual: String = String(fecha.getMonth() + 1);

    if (hoy2.length == 1) {
      hoy2 = "0" + hoy2;
    }

    if (mesActual.length == 1) {
      mesActual = "0" + mesActual;
    }
    fechaActual.setFechaActual = String(añoActual + "-" + mesActual + "-" + hoy2);
    this.aperturaListaGuardar.fechaActual = fechaActual.getFechaActual;
    console.info(fechaActual.getFechaActual);
  }

}
