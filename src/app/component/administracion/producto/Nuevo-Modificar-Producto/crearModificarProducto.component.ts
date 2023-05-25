
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { idEmpresa } from 'src/environments/environment';


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


@Component({
  selector: 'app-crearModificarProducto.component',
  templateUrl: './crearModificarProducto.component.html',
  styleUrls: ['./crearModificarProducto.component.css'],


})

export class CrearModificarProductoComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;


  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;


  formGrupos = new FormGroup({
    propietario: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    comercial: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    email: new FormControl<String>('', [Validators.required, Validators.email]),
    telefono: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
  })


  public UsuarioListaGuardar: Usuario = new Usuario();
  public ProveedorListaGuardar: Proveedor = new Proveedor();

  public proveedorLista: Proveedor[] = [];
  public categoriaLista: Categoria[] = [];


  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
  ) {
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarProveedores();
    this.controlInicio();

  }
  public fechaNacimiento: any;
  public controlFecha: Boolean = false;

  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;

    } else {

      this.loaderCargaDatos = true;



      this.usuarioService.getProveedorId(idUniversal.getIdUniversal).subscribe(value => {
        this.ProveedorListaGuardar.id = value.id;

        this.formGrupos.setValue({
          propietario: value.propietario,
          comercial: value.nombreComercial,
          email: value.email,
          telefono: value.telefono,
        })

        this.loaderCargaDatos = false;
      })

      this.botonParaGuardar = false;
      this.botonParaActualizar = true;

    }

  }

  public listarCategorias() {
    this.categoriaService.getAlCategoria(idEmpresa.getIdEmpresa).subscribe(value3 => {
      this.categoriaLista = value3;
    })


  }

  public listarProveedores() {
    this.usuarioService.getAlProveedor(idEmpresa.getIdEmpresa).subscribe(value3 => {
      this.proveedorLista = value3;
    })


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

    this.ProveedorListaGuardar.propietario = Object.values(this.formGrupos.getRawValue())[0];
    this.ProveedorListaGuardar.nombreComercial = Object.values(this.formGrupos.getRawValue())[1];
    this.ProveedorListaGuardar.email = Object.values(this.formGrupos.getRawValue())[2];
    this.ProveedorListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.ProveedorListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;


    this.usuarioService.createProveedor(this.ProveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Proveedor registrado', 'ACEPTAR');
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


    this.ProveedorListaGuardar.propietario = Object.values(this.formGrupos.getRawValue())[0];
    this.ProveedorListaGuardar.nombreComercial = Object.values(this.formGrupos.getRawValue())[1];
    this.ProveedorListaGuardar.email = Object.values(this.formGrupos.getRawValue())[2];
    this.ProveedorListaGuardar.telefono = Object.values(this.formGrupos.getRawValue())[3];
    this.ProveedorListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;



    this.usuarioService.putProveedor(this.ProveedorListaGuardar).subscribe(value => {
      this._snackBar.open('Proveedor actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}