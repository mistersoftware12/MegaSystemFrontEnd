export class ProductoRequest {
    id?: any;
    nombre?: any;
    codigoBarra?: any;
    precioPrimeraCompra?: any;
    stock?: any;
    precioCompra?: any;
    iva?: any;
    precioVenta?: any;
    idEmpresa?: any;
    idCategoria?: any;
    idProveedor?: any;
    fechaPrimeraCompra?:any;
}

export class ProductoResponse1 {
    id?: any;
    nombre?: any;
    stock?: any;
    precioCompra?: any;
    precioVenta?: any;
    nombreCategoria?: any;
    nombreProveedor?: any;
}

export class ProductoResponse {
    id?: any;
    nombre?: any;
    codigoBarra?: any;
    stock?: any;
    precioCompra?: any;
    iva?: any;
    precioVenta?: any;
    idEmpresa?: any;
    idCategoria?: any;
    idProveedor?: any;
}

export class IngresoBajaProducto{
    id?: any;
    cantidad?: any;
    precioCompra?: any;
    fechaRegistro?: any;
    idProducto?: any;
    observacion?: any;
}