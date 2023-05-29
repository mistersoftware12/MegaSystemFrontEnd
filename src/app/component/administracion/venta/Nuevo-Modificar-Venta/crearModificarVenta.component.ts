
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
import { VentaRequest } from 'src/app/models/venta';

export interface PeriodicElement {
  id: any;
  idProducto: any;
  tipo: any;
  nombre: any;
  cantidad: any;
  codigoBarra: any;
  precioUnitario: any;
  precioIva: any;
  precioTotal: any;
}

const ELEMENT_DATA: PeriodicElement[] = [

];


@Component({
  selector: 'app-crearModificarVenta.component',
  templateUrl: './crearModificarVenta.component.html',
  styleUrls: ['./crearModificarVenta.component.css'],


})

export class CrearModificarVentaComponent implements OnInit {


  public botonParaGuardar: Boolean = false;
  botonParaActualizar: Boolean = false;

  public idProductoArticulo = [];

  public controlInfoProveedor: Boolean = false;


  public numeroControl: number = 1;

  loaderActualizar: boolean;
  loaderActualizarCedula: boolean;

  loaderCargaDatos: boolean;
  public controlArticulos: Boolean = false;
  public controlProduccion: Boolean = false;
  loaderActualizarTablam2: boolean;

  formGrupos = new FormGroup({
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    codigobarra: new FormControl<String>('', [Validators.required]),
  })

  formCliente = new FormGroup({
    cedula: new FormControl<String>('', [Validators.required]),
    nombre: new FormControl<String>('', [Validators.required, Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]),
    direccion: new FormControl<String>('', [Validators.required]),
    correo: new FormControl<String>('', [Validators.required]),
    telefono: new FormControl<String>('', [Validators.required]),
  })



  forGrupoProducto = new FormGroup({
    producto: new FormControl<String>('',),
    cantidad: new FormControl<Number>(1, [Validators.required]),
    precio: new FormControl<any>(null, [Validators.required]),
  })

  forGrupoProduccion = new FormGroup({
    productop: new FormControl<String>('',),
    cantidadp: new FormControl<Number>(1, [Validators.required]),
    preciop: new FormControl<any>(null, [Validators.required]),
  })

  formGrupoCodigoProducto = new FormGroup({
    codigopt: new FormControl<String>('',),
  })


  public categoriaLista: Categoria[] = [];

  public productoLista: ProductoResponse1[] = [];
  public produccionLista: ProduccionRequest[] = [];
  public contenidoProduccionLista: ContenidoProduccion[] = [];

  public contenidoVentaLista: VentaRequest[] = [];

  //aQUI

  public produccionListaGuardar: ProduccionRequest = new ProduccionRequest();
  public contenidoProduccionListaGuardar: ContenidoProduccion = new ContenidoProduccion();

  displayedColumns1: string[] = ['codigo', 'tipo', 'descripcion', 'unitario', 'iva', 'cantidad', 'total', 'weight'];
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
    this.listarProductos();
    this.listarProduccion();
    this.controlInicio();

  }

  public controlFecha: Boolean = false;


  public controlInicio() {

    if (idUniversal.getIdUniversal == 0) {
      this.botonParaGuardar = true;
      this.botonParaActualizar = false;
      this.vaciarFormulario();

      this.formCliente.setValue({
        cedula: '9999999999',
        correo: '',
        direccion: '',
        nombre: '',
        telefono: '',
      })

      this.buscarCliente();

    }

  }

  onSearchChange(): void {

    this.forGrupoProducto.setValue({
      producto: Object.values(this.formGrupoCodigoProducto.getRawValue())[0],
      cantidad: 1,
      precio: 0,
    })

    this.productoService.getProductoCodigoBarra(Object.values(this.forGrupoProducto.getRawValue())[0]).subscribe(value3 => {

      this.forGrupoProducto.setValue({
        producto: value3.codigoBarra,
        cantidad: 1,
        precio: value3.precioVenta.toFixed(2),
      })

      this.idProducto = value3.id;
      this.precioUnitario = value3.precioVenta;
      this.iva = value3.iva;
      this.stock = value3.stock;
      this.nombre = value3.nombre;

      this.loaderActualizarCedula = false;

      this.calculartotalArticulo(1);
    }, error => {
      this.loaderActualizar = false;
      this.loaderActualizarCedula = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })

  }

  onSearchChangeProduccion(): void {

    this.forGrupoProduccion.setValue({
      productop: Object.values(this.formGrupoCodigoProducto.getRawValue())[0],
      cantidadp: 1,
      preciop: 0,
    })

    this.produccionService.getProductoCodigoBarra(Object.values(this.forGrupoProduccion.getRawValue())[0]).subscribe(value3 => {

      this.forGrupoProduccion.setValue({
        productop: value3.codigoBarra,
        cantidadp: 1,
        preciop: value3.precioVenta.toFixed(2),
      })

      this.idProducto = value3.id;
      this.precioUnitario = value3.precioVenta;
      this.iva = value3.iva;
      // this.stock = value3.stock;
      this.nombre = value3.nombre;


      this.loaderActualizarCedula = false;

      this.calculartotalProduccion(2);
    }, error => {
      this.loaderActualizar = false;
      this.loaderActualizarCedula = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })

  }


  public buscarCliente() {

    this.loaderActualizarCedula = true;
    this.usuarioService.getClienteForCedula(Object.values(this.formCliente.getRawValue())[0]).subscribe(value3 => {
      this.formCliente.setValue({
        cedula: value3.cedula,
        nombre: value3.nombres + " " + value3.apellidos,
        correo: value3.email,
        direccion: value3.email,
        telefono: value3.telefono
      })
      this.loaderActualizarCedula = false;
    }, error => {
      this.loaderActualizar = false;
      this.loaderActualizarCedula = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })

  }


  public listarProductos() {
    this.productoService.getAlProdducto(idEmpresa.getIdEmpresa).subscribe(value3 => {
      this.productoLista = value3;
    })


  }

  public listarProduccion() {
    this.produccionService.getAlProdducto(idEmpresa.getIdEmpresa).subscribe(value3 => {
      this.produccionLista = value3;
    })


  }

  public botonCancelarRegistro() {
    this.router.navigate(['/panel/biblioteca/administracionProduccion']);
    idUniversal.setIdUniversal = 0;
  }

  vaciarFormulario() {
    //this.controlInfoProveedor = false;

   


  }

  public apreciocosto: any;
  public aiva: any;
  public aprecioiva: any;
  public apreciofinal: any;

  public preiva: any;
  public prefiniva: any;
  public preprodu: any;
  public preventa: any;


  public idProducto: any;
  public precioUnitario: any;
  public iva: any;
  public stock: any;
  public nombre: any;

  productoAgregar() {
    this.loaderActualizarCedula = true;
    this.productoService.getProductoCodigoBarra(Object.values(this.forGrupoProducto.getRawValue())[0]).subscribe(value3 => {
      this.forGrupoProducto.setValue({
        producto: value3.codigoBarra,
        cantidad: 1,
        precio: value3.precioVenta.toFixed(2),
      })

      this.idProducto = value3.id;
      this.precioUnitario = value3.precioVenta;
      this.iva = value3.iva;
      this.stock = value3.stock;
      this.nombre = value3.nombre;

      this.loaderActualizarCedula = false;
    }, error => {
      this.loaderActualizar = false;
      this.loaderActualizarCedula = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })

    this.controlArticulos = true;

  }

  produccionAgregar() {
    this.loaderActualizarCedula = true;
    this.produccionService.getProductoCodigoBarra(Object.values(this.forGrupoProduccion.getRawValue())[0]).subscribe(value3 => {
      console.info(value3);


      this.forGrupoProduccion.setValue({
        productop: value3.codigoBarra,
        cantidadp: 1,
        preciop: value3.precioVenta.toFixed(2),
      })

      this.idProducto = value3.id;
      this.precioUnitario = value3.precioVenta;
      this.iva = value3.iva;
      //this.stock = value3.stock;
      this.nombre = value3.nombre;

      this.loaderActualizarCedula = false;
    }, error => {
      this.loaderActualizar = false;
      this.loaderActualizarCedula = false;
      this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
    })

    this.controlProduccion = true;

  }

  public subtotalTabla:any =0;
  public ivaTabla:any =0;
  public descuentoTabla:any =0;
  public totalTabla:any =0;


  public calcularValorTabla() {

    this.subtotalTabla =0;
    this.ivaTabla=0;
    this.descuentoTabla=0;
    this.totalTabla=0;

    this.contenidoVentaLista = this.dataSource1;
    
    for (var i = 0; i < this.contenidoVentaLista.length; i++) {
      this.totalTabla = (Number(this.totalTabla) + Number(this.contenidoVentaLista[i].precioTotal)).toFixed(2);
      this.subtotalTabla = (Number(this.subtotalTabla) + (Number(this.contenidoVentaLista[i].precioUnitario) * Number(this.contenidoVentaLista[i].cantidad))).toFixed(2);

      if (this.contenidoVentaLista[i].precioIva != 0) {
        this.ivaTabla = ((Number(this.ivaTabla) + Number(this.contenidoVentaLista[i].precioIva)) * Number(this.contenidoVentaLista[i].cantidad)).toFixed(2);
      }

    }

  

  }


  public guardarInformacion() {
    this.loaderActualizar = true;

/*

    this.produccionListaGuardar.idEmpresa = idEmpresa.getIdEmpresa;
    this.produccionListaGuardar.nombre = Object.values(this.formGrupos.getRawValue())[0];
    this.produccionListaGuardar.codigoBarra = Object.values(this.formGrupos.getRawValue())[1];
    this.produccionListaGuardar.iva = Object.values(this.formGrupoPrecio.getRawValue())[0];
    this.produccionListaGuardar.precioVenta = Object.values(this.formGrupoPrecio.getRawValue())[1];


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
    })*/
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


  public calculartotalArticulo(tipo: any) {
    var control: Number = 1;
    var tipow: Number = tipo;
    var cati = Number(Object.values(this.forGrupoProducto.getRawValue())[1]);
    var codigoBarra = Object.values(this.forGrupoProducto.getRawValue())[0]


    if (this.stock >= cati) {
      if (this.dataSource1.length != 0) {
        for (var i = 0; i < this.dataSource1.length; i++) {
          if (codigoBarra == this.dataSource1[i].codigoBarra) {

            if (this.stock >= Number(this.dataSource1[i].cantidad) + cati) {
              this.dataSource1[i].cantidad = Number(this.dataSource1[i].cantidad) + cati;
              this.dataSource1[i].precioTotal = ((Number(this.dataSource1[i].precioUnitario) + Number(this.dataSource1[i].precioIva)) * this.dataSource1[i].cantidad).toFixed(2);

            } else {
              this._snackBar.open('La cantidad debe ser menor a ' + this.stock, 'ACEPTAR');
            }
            control = 0;
          }
        }
      }

      if (control == 1) {

        this.precioUnitario = Object.values(this.forGrupoProducto.getRawValue())[2];
        this.preiva = ((this.iva / 100) * this.precioUnitario).toFixed(2);
        this.precioUnitario = (Number(this.precioUnitario) - Number(this.preiva));
        var totoal = (((this.precioUnitario) + Number(this.preiva)) * Number(cati)).toFixed(2);

        this.dataSource1.push({
          id: 0,
          idProducto: this.idProducto,
          codigoBarra: codigoBarra,
          tipo: tipow,
          nombre: this.nombre,
          cantidad: cati,
          precioUnitario: this.precioUnitario,
          precioIva: this.preiva,
          precioTotal: totoal,
        });

        this.table.renderRows();

      }

      this.forGrupoProducto.setValue({
        producto: "",
        cantidad: 0,
        precio: 0,

      })

      this.controlArticulos = false;

      this.formGrupoCodigoProducto.setValue({
        codigopt: "",
      })

    } else {
      this._snackBar.open('La cantidad debe ser menor a ' + this.stock, 'ACEPTAR');
    }

    this.calcularValorTabla();
  }


  public calculartotalProduccion(tipo: any) {
    var control: Number = 1;
    var tipow: Number = tipo;
    var cati = Number(Object.values(this.forGrupoProduccion.getRawValue())[1]);
    var codigoBarra = Object.values(this.forGrupoProduccion.getRawValue())[0]


    if (this.dataSource1.length != 0) {
      for (var i = 0; i < this.dataSource1.length; i++) {
        if (codigoBarra == this.dataSource1[i].codigoBarra) {
          this.dataSource1[i].cantidad = Number(this.dataSource1[i].cantidad) + cati;
          this.dataSource1[i].precioTotal = ((Number(this.dataSource1[i].precioUnitario) + Number(this.dataSource1[i].precioIva)) * this.dataSource1[i].cantidad).toFixed(2);
          control = 0;
        }
      }
    }

    if (control == 1) {

      this.precioUnitario = Object.values(this.forGrupoProduccion.getRawValue())[2];
      this.preiva = ((this.iva / 100) * this.precioUnitario).toFixed(2);
      this.precioUnitario = (Number(this.precioUnitario) - Number(this.preiva));
      var totoal = (((this.precioUnitario) + Number(this.preiva)) * Number(cati)).toFixed(2);

      this.dataSource1.push({
        id: 0,
        idProducto: this.idProducto,
        codigoBarra: codigoBarra,
        tipo: tipow,
        nombre: this.nombre,
        cantidad: cati,
        precioUnitario: this.precioUnitario,
        precioIva: this.preiva,
        precioTotal: totoal,
      });
      this.calcularValorTabla();

      this.table.renderRows();

    }

    this.forGrupoProduccion.setValue({
      productop: "",
      cantidadp: 0,
      preciop: 0,

    })

    this.controlArticulos = false;

    this.formGrupoCodigoProducto.setValue({
      codigopt: "",
    })

    this.calcularValorTabla();
  }


  removeData(codigoba: any, id: any) {

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
        this.dataSource1 = this.dataSource1.filter((item) => item.codigoBarra !== codigoba);
        this.table.renderRows();
        this.calcularValorTabla();

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


  

}