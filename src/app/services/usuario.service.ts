import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped} from "@angular/forms";
import {map, Observable} from "rxjs";;
import {PersonaUsuario} from "../models/personaUsuario";
import { Usuario } from '../models/persona';

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

  getAllUsuarios(idEmpresa:any): Observable<PersonaUsuario[]> {
    return this.http.get(this.urlEndPoint + "/persona/allUsuarios/"+idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as PersonaUsuario[]))
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
  
}
