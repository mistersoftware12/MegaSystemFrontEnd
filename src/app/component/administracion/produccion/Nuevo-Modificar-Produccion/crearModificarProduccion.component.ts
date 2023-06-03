
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fechaActual, idEmpresa } from 'src/environments/environment';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { idUniversal } from 'src/environments/environment';
import { Proveedor, Usuario } from 'src/app/models/persona';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { ContenidoProduccion, ProductoRequest, ProductoResponse1 } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ProduccionRequest } from 'src/app/models/produccion';
import { ProduccionService } from 'src/app/services/produccion.service';

export interface PeriodicElement {
  id: any;
  idProducto: any;
  nombre: any;
  cantidad: any;
  precioCompra: any;
  precioVenta: any;
}

const ELEMENT_DATA: PeriodicElement[] = [

];


@Component({
  selector: 'app-crearModificarProduccion.component',
  templateUrl: './crearModificarProduccion.component.html',
  styleUrls: ['./crearModificarProduccion.component.css'],


})

export class CrearModificarProduccionComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;

  public idProductoArticulo = [];

  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;

  loaderCargaDatos: boolean;
  public controlArticulos: Boolean = false;
  loaderActualizarTablam2: boolean;

  formGrupos = new FormGroup({
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    codigobarra: new FormControl<String>('', [Validators.required]),
  })

  formGrupoPrecio = new FormGroup({

    iva: new FormControl<String>('', [Validators.required]),
    preciofinal: new FormControl<String>('', [Validators.required]),
    precioinicial: new FormControl<String>('', [Validators.required]),
  })

  forGrupoProducto = new FormGroup({
    producto: new FormControl<String>('', [Validators.required]),
    cantidad: new FormControl<Number>(1, [Validators.required]),
  })

  public proveedorLista: Proveedor[] = [];
  public categoriaLista: Categoria[] = [];

  public productoLista: ProductoResponse1[] = [];
  public contenidoProduccionLista: ContenidoProduccion[] = [];

  //aQUI

  public produccionListaGuardar: ProduccionRequest = new ProduccionRequest();
  public contenidoProduccionListaGuardar: ContenidoProduccion = new ContenidoProduccion();

  displayedColumns1: string[] = ['id', 'codigo', 'nombre', 'cantidad', 'preciocostounitario', 'weight'];
  dataSource1 = [...ELEMENT_DATA];
  @ViewChild(MatTable) table: MatTable<PeriodicElement>;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private produccionService: ProduccionService,
  ) {

  }

  ngOnInit(): void {
    this.listarCategorias();
    this.listarProveedores();
    this.listarProductos();
    this.controlInicio();

  }

  public controlFecha: Boolean = false;


  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;
      this.vaciarFormulario();


    } else {

      this.loaderCargaDatos = true;


      this.produccionService.getProduccionId(idUniversal.getIdUniversal).subscribe(value => {

        var quesirva = JSON.stringify(Object.values(value)[0])
        var coche = JSON.parse(quesirva);

        this.dataSource1 = coche;
        this.table.renderRows();

        this.produccionListaGuardar.id = value.id;
        this.contenidoProduccionListaGuardar.idProduccion = value.id;
        this.formGrupos.setValue({
          nombre: value.nombre,
          codigobarra: value.codigoBarra,
        })

        this.formGrupoPrecio.setValue({
          iva: value.iva,
          preciofinal: value.precioVenta.toFixed(2),
          precioinicial: value.precioCompra.toFixed(2),
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

  public listarProductos() {
    this.productoService.getAlProdducto(idEmpresa.getIdEmpresa).subscribe(value3 => {
      this.productoLista = value3;
    })


  }

  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionProduccion']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    //this.controlInfoProveedor = false;

    this.formGrupoPrecio.setValue({
      iva: "0",
      preciofinal: "0",
      precioinicial: "0",
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


  articuloAgregar() {
    this.controlArticulos = true;
  }



  public calcularValorTabla(condicion: any) {


    this.apreciocosto = Number(Object.values(this.formGrupoPrecio.getRawValue())[0]);
    this.aiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[1]);
    this.aprecioiva = Number(Object.values(this.formGrupoPrecio.getRawValue())[2]);
    this.apreciofinal = Number(Object.values(this.formGrupoPrecio.getRawValue())[3]);

    if (condicion == 1) {
      this.preiva = (this.apreciocosto * (this.aiva / 100));
      this.prefiniva = this.preiva + this.apreciocosto;

      this.formGrupoPrecio.setValue({
        iva: this.aiva,
        preciofinal: this.prefiniva.toFixed(2),
        precioinicial: Object.values(this.formGrupoPrecio.getRawValue())[2],
      })

    }



  }


  public guardarInformacion() {
    this.loaderActualizar = true;



    this.produccionListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;
    this.produccionListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.produccionListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
    this.produccionListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[0];
    this.produccionListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[1];
    this.produccionListaGuardar.precioCompra = Object.values(this.formGrupoPrecio.getRawValue())[2];


    this.produccionService.createProducto(this.produccionListaGuardar).subscribe(value => {
      this._snackBar.open('Producto registrado', 'ACEPTAR');
      this.contenidoProduccionListaGuardar.idProduccion = value.id;
      this.guardarContenido();
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }


  guardarContenido() {


    this.contenidoProduccionLista = [];
    this.contenidoProduccionLista = this.dataSource1;

    for (let i = 0; i < this.contenidoProduccionLista.length; i++) {
      this.contenidoProduccionListaGuardar.id = this.contenidoProduccionLista[i].id;
      this.contenidoProduccionListaGuardar.cantidad = this.contenidoProduccionLista[i].cantidad;
      this.contenidoProduccionListaGuardar.idProducto = this.contenidoProduccionLista[i].idProducto;

      if (this.contenidoProduccionListaGuardar.id == 0) {
        this.produccionService.createContenidoProducto(this.contenidoProduccionListaGuardar).subscribe(value => {
        }, error => {
          this._snackBar.open(error.error.message + ' OCURRIO UN ERROR AL AGREGAR ARTICULO', 'ACEPTAR');

        })
      } else {
        this.produccionService.putContendidoProduccion(this.contenidoProduccionListaGuardar).subscribe(
          Response => {
          }, error => {
            this._snackBar.open(error.error.message + ' OCURRIO UN ERROR ', 'ACEPTAR');
          }

        )

      }


    }

  }


  guardarContendio2() {

  }


  public fechacontrol() {
    this.controlFecha = true;
  }


  public calculartotalArticulo() {


    var control: Number = 1;

    var cati = Number(Object.values(this.forGrupoProducto.getRawValue())[1]);
    var idArti = Object.values(this.forGrupoProducto.getRawValue())[0];

    if (this.dataSource1.length != 0) {
      for (var i = 0; i < this.dataSource1.length; i++) {
        if (idArti == this.dataSource1[i].idProducto) {
          this.dataSource1[i].cantidad = Number(this.dataSource1[i].cantidad) + cati;
          control = 0;
        }

      }

    }


    if (control == 1) {

      this.productoService.getProductoId(Object.values(this.forGrupoProducto.getRawValue())[0]).subscribe(value => {
        this.dataSource1.push({
          id: 0,
          idProducto: value.id,
          nombre: value.nombre,
          cantidad: cati,
          precioCompra: value.precioCompra,
          precioVenta: value.precioVenta,
        });

        this.table.renderRows();


      })

    }

    this.forGrupoProducto.setValue({
      producto: "",
      cantidad: 0,

    })

    this.controlArticulos = false;
  }




  removeData(idArti: any, id: any) {

    Swal.fire({
      title: 'Estas seguro?',
      text: "No podrás revertir esto.!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource1 = this.dataSource1.filter((item) => item.idProducto !== idArti);
        this.table.renderRows();


        if (id != 0) {
          this.idProductoArticulo.push(id);
        }

      }


    })



  }

  public dialogoEditarPrecioProveedor: boolean;
  public idArticulo: any;

  formGroupPrecioProveedor = new FormGroup({
    proveedor: new FormControl<any>('', [Validators.required]),
    precio: new FormControl<any>('', [Validators.required, Validators.max(500)]),
  })


  abrirEditarPrecio(idArt: any, nombrePro: any) {

    this.dialogoEditarPrecioProveedor = true;
    this.idArticulo = idArt;
    this.formGroupPrecioProveedor.setValue({
      proveedor: nombrePro,
      precio: "",

    })
  }

  guardarEditar() {

    var cati = Number(Object.values(this.formGroupPrecioProveedor.getRawValue())[1]);
    if (this.dataSource1.length != 0) {
      for (var i = 0; i < this.dataSource1.length; i++) {
        if (this.idArticulo == this.dataSource1[i].idProducto) {
          this.dataSource1[i].cantidad = cati;
        }

      }

    }


  }


  public guardarInformacionEditar() {
    this.loaderActualizar = true;


    this.produccionListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;
    this.produccionListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.produccionListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
    this.produccionListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[0];
    this.produccionListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[1];
    this.produccionListaGuardar.precioCompra = Object.values(this.formGrupoPrecio.getRawValue())[2];
    this.produccionService.putProduccion(this.produccionListaGuardar).subscribe(value => {
      this._snackBar.open('Producto actualizado', 'ACEPTAR');
      this.guardarContenido();
      this.vaciarFormulario();
      this.botonCancelarRegistro();
      this.loaderActualizar = false;
    }, error => {
      this.loaderActualizar = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })
  }

}