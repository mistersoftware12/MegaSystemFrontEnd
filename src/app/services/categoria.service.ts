import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormControl, ɵFormGroupRawValue, ɵTypedOrUntyped } from "@angular/forms";
import { map, Observable } from "rxjs";;
import { PersonaUsuario } from "../models/personaUsuario";
import { Proveedor, Usuario } from '../models/persona';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlEndPoint = environment.URL_APP;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JSON.parse(sessionStorage["personausuario"]).token
  })

  constructor(private http: HttpClient) {
  }

  
  createCategoria(data: Categoria): Observable<Categoria> {
    return this.http.post(environment.URL_APP + "/categoria/registrarCategoria", data, { headers: this.httpHeaders })
  }

  getAlCategoria(idEmpresa: any): Observable<Categoria[]> {
    return this.http.get(this.urlEndPoint + "/categoria/allCategorias/" + idEmpresa, { headers: this.httpHeaders }).pipe(map(Response => Response as Categoria[]))
  }

  getCategoriaId(id: any): Observable<Categoria> {
    return this.http.get(environment.URL_APP + "/categoria/categoria/" + id, { headers: this.httpHeaders }).pipe(map(Response => Response as Categoria))
  }

  putCategoria(info: Usuario): Observable<Categoria> {
    return this.http.put(environment.URL_APP + "/categoria/updateCategoria", info, { headers: this.httpHeaders })
  }

}
