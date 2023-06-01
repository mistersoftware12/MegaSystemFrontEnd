
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cedula, fechaActual, idEmpresa } from 'src/environments/environment';


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




  public CategoriaListaGuardar: Categoria = new Categoria();

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private categoriaService: CategoriaService,
    private reporteService: ReporteService,
  ) {
  }
  
  public fechaActu;

  ngOnInit(): void {
    this.controlInicio();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;

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


  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracioncategoria']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    this.controlInfoProveedor = false;
  }


  public guardarInformacion() {
    this.loaderActualizar = true;

    this.CategoriaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.CategoriaListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    this.categoriaService.createCategoria(this.CategoriaListaGuardar).subscribe(value => {
      this._snackBar.open('Categoria registrado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }



  public fechacontrol() {
    this.controlFecha = true;
  }

  public guardarInformacionEditar() {
    this.loaderActualizar = true;

    this.CategoriaListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.CategoriaListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;

    this.categoriaService.putCategoria(this.CategoriaListaGuardar).subscribe(value => {
      this._snackBar.open('Categoria actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}