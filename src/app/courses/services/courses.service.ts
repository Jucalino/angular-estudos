import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { HttpClient } from '@angular/common/http'
import { delay, first, take, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/assets/courses.json'

  constructor(private httpClient: HttpClient) { }

  list(){
    return this.httpClient.get<Course[]>(this.API).pipe(
      first(),
      //delay(3000),
      tap(courses => console.log(courses))
    )
  }

  loadById(id:string){
    return this.httpClient.get<Course>(`${this.API}`)
  }

  save(record: Partial<Course>) {
    //console.log(record)
    if(record._id ){
      //console.log('update')
      return this.update(record)

    }
    //console.log('create')
    return this.create(record)
  }

  private create(record: Partial<Course>){
    const cursosSalvos = JSON.parse(localStorage.getItem('cursos') || '[]');
    record._id = String(Date.now()); // gera ID simples
    cursosSalvos.push(record);
    localStorage.setItem('cursos', JSON.stringify(cursosSalvos));
    return of(record); // retorna como se fosse uma resposta do servidor
  }

  private update(record: Partial<Course>){
    return this.httpClient.put<Course>(`${this.API}/${record}`, record).pipe(first())
  }

  remove(id:string){
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first())
  }


}
