
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
import { IngresoBajaProducto } from 'src/app/models/producto';
import { IngresoBajaProductoService } from 'src/app/services/ingresoBajaProducto.service';


@Component({
  selector: 'app-crearModificarBajaProducto.component.',
  templateUrl: './crearModificarBajaProducto.component.html',
  styleUrls: ['./crearModificarBajaProducto.component.css'],


})

export class CrearModificarBajaProductoComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;


  formGrupos = new FormGroup({
    cantidad: new FormControl<String>('', [Validators.required]),
    precio: new FormControl<String>('', [Validators.required]),
    observacion: new FormControl<String>('', [Validators.required]),
  })



  public CategoriaListaGuardar: Categoria = new Categoria();

  public IngresoBajaListaGuardar: IngresoBajaProducto = new IngresoBajaProducto();

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private categoriaService: CategoriaService,
    private ingresoBajaProductoService: IngresoBajaProductoService
  ) {
  }

  ngOnInit(): void {
    this.controlInicio();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;

  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;
      this.botonCancelarRegistro();

    } else {
      this.botonParaGuardar = true;
    }

  }


  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionProducto']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    this.controlInfoProveedor = false;
  }


  public guardarInformacion() {
    this.loaderActualizar = true;


    this.IngresoBajaListaGuardar.cantidad = Object.values(this.formGrupos.getRawValue())[0];
    this.IngresoBajaListaGuardar.precioCompra = Object.values(this.formGrupos.getRawValue())[1];
    this.IngresoBajaListaGuardar.fechaRegistro = fechaActual.getFechaActual;
    this.IngresoBajaListaGuardar.idProducto = idUniversal.getIdUniversal;
    this.IngresoBajaListaGuardar.observacion = Object.values(this.formGrupos.getRawValue())[2];
    this.IngresoBajaListaGuardar.cedulaUsuario = cedula.getCedula;

    this.ingresoBajaProductoService.createIngresoBajaProducto(this.IngresoBajaListaGuardar, 2).subscribe(value => {
      this._snackBar.open('Baja producto registrado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }



}