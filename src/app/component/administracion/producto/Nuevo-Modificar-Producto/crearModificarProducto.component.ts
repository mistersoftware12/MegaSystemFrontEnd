
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fechaActual, idEmpresa } from 'src/environments/environment';


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
import { ProductoRequest } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';


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
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    codigobarra: new FormControl<String>('', [Validators.required]),
    categoria: new FormControl<any>('', [Validators.required]),
    proveedor: new FormControl<String>('', [Validators.required, Validators.pattern("[0-9]+")]),
    preciocompra: new FormControl<String>('', [Validators.required]),
    stock: new FormControl<String>('', [Validators.required]),
  })

  formGrupoPrecio = new FormGroup({
    preciocosto: new FormControl<String>('', [Validators.required]),
    iva: new FormControl<String>('', [Validators.required]),
    preciofinal: new FormControl<String>('', [Validators.required]),
  })


  public proveedorLista: Proveedor[] = [];
  public categoriaLista: Categoria[] = [];

  //aQUI

  public productoListaGuardar: ProductoRequest = new ProductoRequest();

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
  ) {

  }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarProveedores();
    this.controlInicio();

  }

  public controlFecha: Boolean = false;
  public controlStock:Boolean = false;

  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;
      this.vaciarFormulario();
      this.controlStock = true;

    } else {

      this.loaderCargaDatos = true;
      this.controlStock = false;

      this.productoService.getProductoId(idUniversal.getIdUniversal).subscribe(value => {

        this.productoListaGuardar.id = value.id;;


        this.formGrupos.setValue({
          nombre: value.nombre,
          codigobarra: value.codigoBarra,
          categoria: value.idCategoria,
          proveedor: value.idProveedor,
          preciocompra: value.precioCompra.toFixed(2),
          stock: value.stock,
        })

        this.formGrupoPrecio.setValue({
          preciocosto: value.precioCompra.toFixed(2),
          iva: value.iva,
          preciofinal: value.precioVenta.toFixed(2),
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
    //this.controlInfoProveedor = false;

    this.formGrupoPrecio.setValue({
      preciocosto: "0",
      iva: "0",
      preciofinal: "0",
    })


  }

  public apreciocosto: any;
  public aiva: any;
  public aprecioiva: any;
  public apreciofinal: any;

  public preiva: any;
  public prefiniva: any;
  public preprodu: any;
  public preventa: any;


  public calcularValorTabla(condicion: any) {


    this.apreciocosto = Number(Object.values(this.formGrupoPrecio.getRawValue())[0]);
    this.aiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[1]);
    this.aprecioiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[2]);
    this.apreciofinal = Number(Object.values(this.formGrupoPrecio.getRawValue())[3]);

    if (condicion == 1) {
      this.preiva = (this.apreciocosto * (this.aiva / 100));
      this.prefiniva = this.preiva + this.apreciocosto;

      this.formGrupoPrecio.setValue({
        preciocosto: this.apreciocosto.toFixed(2),
        iva: this.aiva,
        preciofinal: this.prefiniva.toFixed(2),
      })

    }



  }


  public guardarInformacion() {
    this.loaderActualizar = true;

    this.productoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.productoListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
    this.productoListaGuardar.idCategoria = Object.values(this.formGrupos.getRawValue())[2];
    this.productoListaGuardar.idProveedor = Object.values(this.formGrupos.getRawValue())[3];
    this.productoListaGuardar.precioPrimeraCompra = Object.values(this.formGrupos.getRawValue())[4];
    this.productoListaGuardar.stock = Object.values(this.formGrupos.getRawValue())[5];
    this.productoListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;

    this.productoListaGuardar.precioCompra = Object.values(this.formGrupoPrecio.getRawValue())[0];
    this.productoListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
    this.productoListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[2];
    this.productoListaGuardar.fechaPrimeraCompra = fechaActual.getFechaActual;


    this.productoService.createProducto(this.productoListaGuardar).subscribe(value => {
      this._snackBar.open('Producto registrado', 'ACEPTAR');
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


    this.productoListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.productoListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
    this.productoListaGuardar.idCategoria = Object.values(this.formGrupos.getRawValue())[2];
    this.productoListaGuardar.idProveedor = Object.values(this.formGrupos.getRawValue())[3];
    this.productoListaGuardar.precioPrimeraCompra = Object.values(this.formGrupos.getRawValue())[4];
    this.productoListaGuardar.stock = Object.values(this.formGrupos.getRawValue())[5];
    this.productoListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;
    this.productoListaGuardar.precioCompra = Object.values(this.formGrupoPrecio.getRawValue())[0];
    this.productoListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[1];
    this.productoListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[2];


    this.productoService.putProducto(this.productoListaGuardar).subscribe(value => {
      this._snackBar.open('Producto actualizado', 'ACEPTAR');
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}