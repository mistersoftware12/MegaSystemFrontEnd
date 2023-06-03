import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsuarioService } from 'src/app/services/usuario.service';
import { Cliente } from 'src/app/models/cliente';
import { Usuario } from 'src/app/models/persona';
import { Sucursal } from 'src/app/models/sucursal';
import { cedula, fechaActual, idUniversal } from 'src/environments/environment';
import { idEmpresa } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { ProductoRequest } from 'src/app/models/producto';


@Component({
  selector: 'app-listar-subidaData.component',
  templateUrl: './listar-subidaData.component.html',
  styleUrls: ['./listar-subidaData.component.css'],
})

export class ListaSubidaDataComponent implements OnInit {

  loaderActualizar: boolean;

  public UsuarioLista: Usuario[] = [];

  public productoLista: ProductoRequest[] = [];
  public productoListaGuardar: ProductoRequest = new ProductoRequest();


  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'telefono', 'documento', 'categoria', 'proveedor', 'empresa'];
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private router: Router,
    private produccionService: ProduccionService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {


  }

  public mostrarNuevo() {
    if (this.productoLista.length != 0) {

      for (var i = 0; i < this.productoLista.length; i++) {
        this.loaderActualizar = true;

        this.productoListaGuardar.nombre = this.productoLista[i].nombre;
        this.productoListaGuardar.codigoBarra = this.productoLista[i].codigoBarra;
        this.productoListaGuardar.idCategoria = this.productoLista[i].idCategoria;
        this.productoListaGuardar.idProveedor = this.productoLista[i].idProveedor
        this.productoListaGuardar.precioPrimeraCompra = this.productoLista[i].precioPrimeraCompra;
        this.productoListaGuardar.stock = this.productoLista[i].stock;
        this.productoListaGuardar.idEmpresa = this.productoLista[i].idEmpresa;

        this.productoListaGuardar.precioCompra = this.productoLista[i].precioCompra
        this.productoListaGuardar.iva = this.productoLista[i].iva;
        this.productoListaGuardar.precioVenta = this.productoLista[i].precioVenta
        this.productoListaGuardar.fechaPrimeraCompra = fechaActual.getFechaActual;


        this.productoService.createProducto(this.productoListaGuardar).subscribe(value => {
          this._snackBar.open('Producto registrado', 'ACEPTAR');
          this.loaderActualizar = false;
        }, error => {
          this.loaderActualizar = false;
          this._snackBar.open(error.error.message + ' OCURRIO UN ERROR', 'ACEPTAR');
        })
      }

    } else {
      this._snackBar.open('EL DOCUMENTO NO CONTIENE INFORMACIÓN', 'ACEPTAR');
    }
  }



  //LISTAR





  public ReadExcel(event: any) {

    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);


    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNamer = workBook.SheetNames;
      this.productoLista = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNamer[0]])
      console.info(this.productoLista);

      this.dataSource = new MatTableDataSource(this.productoLista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }


  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  ////Editar

  editarInformacion(id: any) {
    idUniversal.setIdUniversal = id;

    this.router.navigate(['/panel/biblioteca/creaModificarProduccion']);
  }

  //Exportaciones de documento

  exportToExcel(): void {
    let element = document.getElementById('table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, 'Lista de Productos.xlsx');
  }


  //Generar PDF
  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        // @ts-ignore
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }


  generatePDF() {
    this.loaderActualizar = true
    var pipe: DatePipe = new DatePipe('es')
    var dia: String = new Date().toISOString();

    this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(value => {

      this.usuarioService.getAllUsuarios(idEmpresa.getIdEmpresa).subscribe(async valueb => {

        const pdfDefinition: any = {

          footer: function (currentPage, pageCount) { return '.   Pagina ' + currentPage.toString() + ' de ' + pageCount; },
          header: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element

            /*
            return [
              { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
              { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
            ]*/
          },

          content: [
            { image: await this.getBase64ImageFromURL('assets/images/kadapaLogo.png'), width: 100 },
            {
              text: '_________________________________________________________________________________________',
              alignment: 'center'
            },
            // @ts-ignore
            { text: pipe.transform(dia, ' d  MMMM  y'), alignment: 'right' },
            { text: 'CLIENTES REGISTRADOS', fontSize: 15, bold: true, alignment: 'center' },
            //{ text: 'Usuarios registrados en la Empresa  ', fontSize: 15, margin: [0, 0, 20, 0] },
            { text: '    ' },
            {
              table: {
                headerRows: 1,
                widths: ['7%', '10%', '19%', '19%', '11%', '23%', '10%'],
                body: [
                  ['ID', 'CEDULA', 'NOMBRES', 'APELLIDOS', 'ROL', 'CORREO', 'TELEFONO'],
                  [value.map(function (item) {
                    return { text: item.id + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.cedula + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombres + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.apellidos + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.nombreRol + '', fontSize: 11 }
                  }),

                  value.map(function (item) {
                    return { text: item.email + '', fontSize: 11 }
                  }),
                  value.map(function (item) {
                    return { text: item.telefono + '', fontSize: 11 }
                  })
                  ],

                ]
              }

            },
            { text: '    ' },
            { text: '    ' },


            {
              table: {
                headerRows: 1,
                widths: ['100%'],
                heights: 20,
                body: [
                  ['USUARIO/A: ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().nombres + ' ' + valueb.filter(value1 => value1.cedula == cedula.getCedula).pop().apellidos],

                ]
              },
            },

          ],

          pageOrientation: 'landscape',
        }


        this.loaderActualizar = false
        const pdf = pdfMake.createPdf(pdfDefinition);
        pdf.open();
      })
    })
  }


}