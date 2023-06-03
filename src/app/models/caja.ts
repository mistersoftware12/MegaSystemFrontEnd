export class CajaRequest {
  id?: any;
  cedulaUsuario?: any;
  fechaActual?: any;
  saldoApertura?: any;
}

export class CierreCaja {
  id?: any;
  totalEfectivo?: any;
  totalVenta?: any;
}

export class CajaResponse {
  id?: any;
  nombreUsuario?: any;
  fechaCaja?: any;
  saldoApertura?: any;
  saltoEfectivo?: any;
}

export class CajaResponse1 {
  subotal?: any;
  descuento?: any;
  iva?: any;
  total?: any;

  entrada?: any;
  baja?: any;

  apertura?: any;
  cobrado?: any;
  porCobrar?: any;
  ganancia?: any;
}