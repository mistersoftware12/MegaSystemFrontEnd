import { Injectable } from '@angular/core';
import { environment, idEmpresa } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped } from "@angular/forms";
import { map, Observable } from "rxjs";;
import { PersonaUsuario } from "../models/personaUsuario";
import { Proveedor, Usuario } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  getAllUsuarios(idEmpresa: any): Observable<PersonaUsuario[]> {
    return this.http.get(this.urlEndPoint + "/persona/allUsuarios/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as PersonaUsuario[]))
  }


  /////////////////////////////////

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post(environment.URL_APP + "/persona/registrarUsuario", usuario, { headers: this.httpHeaders })
  }

  putUsuario(info: Usuario): Observable<Usuario> {
    return this.http.put(environment.URL_APP + "/persona/updateUsuario", info, { headers: this.httpHeaders })
  }


  getUsuarioId(id: any): Observable<Usuario> {
    return this.http.get(environment.URL_APP + "/persona/usuario/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Usuario))
  }

  /////////////////////////////////////////////
  createCliente(usuario: Usuario): Observable<Usuario> {
    return this.http.post(environment.URL_APP + "/persona/registrarCliente", usuario, { headers: this.httpHeaders })
  }

  getAlClientes(idEmpresa: any): Observable<PersonaUsuario[]> {
    return this.http.get(this.urlEndPoint + "/persona/allClientes/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as PersonaUsuario[]))
  }

  getClienteId(id: any): Observable<Usuario> {
    return this.http.get(environment.URL_APP + "/persona/cliente/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Usuario))
  }

  getClienteForCedula(cedula: any): Observable<Usuario> {
    return this.http.get(environment.URL_APP + "/persona/clientepersona/" + cedula+"/"+idEmpresa.getIdEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as Usuario))
  }

  putCliente(info: Usuario): Observable<Usuario> {
    return this.http.put(environment.URL_APP + "/persona/updateCliente", info, { headers: this.httpHeaders })
  }

  /////////////////////////////////////////
  createProveedor(data: Proveedor): Observable<Proveedor> {
    return this.http.post(environment.URL_APP + "/persona/registrarProveedor", data, { headers: this.httpHeaders })
  }

  getAlProveedor(idEmpresa: any): Observable<Proveedor[]> {
    return this.http.get(this.urlEndPoint + "/persona/allProveedores/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as Proveedor[]))
  }

  getProveedorId(id: any): Observable<Proveedor> {
    return this.http.get(environment.URL_APP + "/persona/proveedor/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Proveedor))
  }

  putProveedor(info: Usuario): Observable<Proveedor> {
    return this.http.put(environment.URL_APP + "/persona/updateProveedor", info, { headers: this.httpHeaders })
  }

}
