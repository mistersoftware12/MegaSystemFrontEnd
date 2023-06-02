
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cedula, fechaActual, idCaja, idEmpresa } from 'src/environments/environment';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { idUniversal } from 'src/environments/environment';
import { Proveedor, Usuario } from 'src/app/models/persona';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { ReporteService } from 'src/app/services/reporte.service';
import { CajaService } from 'src/app/services/caja.service';
import { CierreCaja } from 'src/app/models/caja';


@Component({
  selector: 'app-crearModificarCierreCaja.component',
  templateUrl: './crearModificarCierreCaja.component.html',
  styleUrls: ['./crearModificarCierreCaja.component.css'],


})

export class CrearModificarCierreCajaComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  loaderActualizar: boolean;

  loaderCargaDatos: boolean;

  public ventaEfectivo: any;
  public ventaCredito: any;
  public ventaCheque: any;
  public ventaBancaria: any;
  public ventaDebito: any;
  public ventaTotal: any;
  public cobroEfectivo: any;
  public cobroCredito: any;
  public cobroTotal: any;


  formGrupos = new FormGroup({
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),

  })




  public CierreListaGuardar: CierreCaja = new CierreCaja();

  public idCajaControl: any = 0;
  public estadoCierreCaja: any = false;

  constructor(
    private _snackBar: MatSnackBar,
    private reporteService: ReporteService,
    private cajaService: CajaService,
  ) {
  }

  public fechaActu;

  ngOnInit(): void {
    this.controlCaja();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;


  public controlCaja() {
    var fecha = new Date(fechaActual.getFechaActual);
    this.cajaService.getApertura(cedula.getCedula, fecha).subscribe(value => {
      this.idCajaControl = value.id;
      this.estadoCierreCaja = value.estado;

      this.controlInicio();
    })
  }

  public controlInicio() {

    this.fechaActu = fechaActual.getFechaActual;
    var fecha = new Date(fechaActual.getFechaActual);

    this.reporteService.getByReporteCierreCaja(cedula.getCedula, fecha).subscribe(value => {

      this.ventaEfectivo = value.ventaEfectivo.toFixed(2);
      this.ventaCredito = value.ventaCredito.toFixed(2);
      this.ventaCheque = value.ventaCheque.toFixed(2);
      this.ventaBancaria = value.ventaBancaria.toFixed(2);
      this.ventaDebito = value.ventaDebito.toFixed(2);
      this.ventaTotal = value.ventaTotal.toFixed(2);
      this.cobroEfectivo = value.cobroEfectivo.toFixed(2);
      this.cobroCredito = value.cobroCredito.toFixed(2);
      this.cobroTotal = value.cobroTotal.toFixed(2);

    })
    this.botonParaGuardar = false;
    this.botonParaActualizar = true;

  }

  public guardarInformacionEditar() {
    this.loaderActualizar = true;


    Swal.fire({
      title: 'Seguro que deseas cerrar caja?',
      text: "Una vez cerrado ya no podras continuar con ventas",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Generar apertura!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.CierreListaGuardar.id = idCaja.getIdCaja;
        this.CierreListaGuardar.totalEfectivo = this.cobroTotal;
        this.CierreListaGuardar.totalVenta = this.ventaTotal;
        this.cajaService.createCierreCaja(this.CierreListaGuardar).subscribe(value => {
          this._snackBar.open('Caja Cerrada', 'ACEPTAR');
          this.controlCaja();
          this.loaderActualizar = false;
        }, error => {
          this.loaderActualizar = false;
          this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
        })

      } else {
        this.loaderActualizar = false;
      }
    })





  }

}