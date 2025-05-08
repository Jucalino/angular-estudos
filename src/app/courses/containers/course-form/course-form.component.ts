import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder,
    private service: CoursesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {
    this.form = this.formBuilder.group({
      name: [''],
      category: ['']
    })
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course']
    this.form.setValue({name: course.name, category: course.category})
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(data => this.onSucess(), error => this.onError())
  }

  onCancel() {
    this.location.back()
  }

  private onSucess(){
    this.snackBar.open('Curso Salvo com Sucesso', '', {duration: 5000});
    this.onCancel()
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso.', '', { duration: 5000 });
  }

}
