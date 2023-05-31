export class VentaEncabezadoRequest {
    id?: any;
    fechaEmision?: any;
    observacion?: any;
    //private String secuencia;
    subtotal?: any;
    iva?: any;
    descuento?: any;
    total?: any;
    idEmpresa?: any;
    idTipoPago?: any;
    idCliente?: any;
    cedulaUsuario?: any;
}

export class VentaContenidoRequest {
    id?: any;
    idProducto?: any;
    tipo?: any;
    nombre?: any;
    cantidad?: any;
    codigoBarra?: any;
    precioUnitario?: any;
    precioIva?: any;
    precioTotal?: any;
    ganancia?: any;
    //idVentaEncabezado;

}

