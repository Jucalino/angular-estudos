import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private service: CoursesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      _id: [course._id],
      name: [course.name, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      category: [course.category, [Validators.required]]
    });
    console.log(course)
  }

  onSubmit() {
    this.service.save(this.form.value).subscribe(
      (data) => this.onSucess(),
      (error) => this.onError()
    );
  }

  onCancel() {
    this.location.back();
  }

  private onSucess() {
    this.snackBar.open('Curso Salvo com Sucesso', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso.', '', { duration: 5000 });
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if(field?.hasError('required')) {
      return 'Campo Obrigatorio'
    }

    if(field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 3
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`
    }

    if(field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 200
      return `Tamanho máximo execido de ${requiredLength} caracteres`
    }
    return 'Campo Invalido'
  }
}
