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

  save(course: any): Observable<any> {
    const cursosSalvos = JSON.parse(localStorage.getItem('cursos') || '[]');
    course._id = String(Date.now()); // gera ID simples
    cursosSalvos.push(course);
    localStorage.setItem('cursos', JSON.stringify(cursosSalvos));
    return of(course); // retorna como se fosse uma resposta do servidor
  }

}
