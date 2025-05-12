import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';

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
      name: [course.name,[Validators.required,Validators.minLength(3),Validators.maxLength(100)],
      ],
      category: [course.category, [Validators.required]],
      lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required),
    });
    console.log(this.form);
    console.log(this.form.value);
  }

  private retrieveLessons(course: Course) {
    const lessons = [];
    if (course?.lessons) {
      course.lessons.forEach((lesson) =>
        lessons.push(this.creatLesson(lesson))
      );
    } else {
      lessons.push(this.creatLesson());
    }
    return lessons;
  }

  private creatLesson(lesson: Lesson = { id: '', name: '', youtubeUrl: '' }) {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [Validators.required,Validators.minLength(10),Validators.maxLength(11),]],
      youtubeUrl: [lesson.youtubeUrl],
    });
  }

  getLessonsFormArray(): FormArray {
    return this.form.get('lessons') as FormArray
  }

  addNewLesson() {
    const lessons = this.form.get('lessons') as FormArray;
    lessons.push(this.creatLesson());
  }

  removeLesson(index: number) {
    const lessons = this.form.get('lessons') as FormArray;
    lessons.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value).subscribe(
        (data) => this.onSucess(),
        (error) => this.onError()
      );
    } else {
      alert ('form invalido')
    }
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

    if (field?.hasError('required')) {
      return 'Campo Obrigatorio';
    }

    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors
        ? field.errors['minlength']['requiredLength']
        : 3;
      return `Tamanho mínimo precisa ser de ${requiredLength} caracteres`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors
        ? field.errors['maxlength']['requiredLength']
        : 200;
      return `Tamanho máximo execido de ${requiredLength} caracteres`;
    }
    return 'Campo Invalido';
  }

  isFormArrayRequired(){
    const lessons = this.form.get('lessons') as FormArray;
    return !lessons.valid && lessons.hasError('required') && lessons.touched
  }
}
