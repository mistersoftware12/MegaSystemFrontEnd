export const environment = {
  //URL_APP: 'http://localhost:8080/api',
  URL_APP: 'https://backendkadapa.herokuapp.com/api',
  production: true
};

export const cedula = {
  // data property
  cedula: '0000000000',

  // accessor property(getter)
  get getCedula() {
    return this.cedula;
  },

  //accessor property(setter)
  set setcedula(newCedula) {
    this.cedula = newCedula;
  }
}

export const idRol = {

  idRol: '0',

  get getIdRol() {
    return this.idRol;
  },

  set setidRol(newIdRol) {
    this.idRol = newIdRol;
  }

}

export const idSucursal = {
  idSucursal: '0',

  get getIdSucursal() {
    return this.idSucursal;
  },

  set setIdSucursal(newIdSucursal) {
    this.idSucursal = newIdSucursal;
  }
}

export const idUniversal = {
  idUniversal: '0',

  get getIdUniversal() {
    return this.idUniversal;
  },

  set setIdUniversal(newIdUniversal) {
    this.idUniversal = newIdUniversal;
  }
}

export const idEmpresa = {
  idEmpresa: '0',

  get getIdEmpresa() {
    return this.idEmpresa;
  },

  set setIdEmpresa(newIdEmpresa) {
    this.idEmpresa = newIdEmpresa;
  }
}

export const fechaActual = {
  
  fechaActual:'0',

  get getFechaActual() {
      return this.fechaActual;
  },

  set setFechaActual(newFecha) {
      this.fechaActual = newFecha;
  }
  
}

export const idCaja = {
  idCaja: 0,

  get getIdCaja() {
    return this.idCaja;
  },

  set setIdCaja(newIdCaja) {
    this.idCaja = newIdCaja;
  }
}