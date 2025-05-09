import { CoursesService } from '../../services/courses.service';
import { Component, OnInit } from '@angular/core';
import { Course } from '../../model/course';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | null = null

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.refresh()
  }

  refresh(){
    this.courses$ = this.coursesService.list().pipe(
      catchError(error => {
        this.onError('Erro ao carregar!')
        return of([])
      })
    )
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {
  }


  onAdd(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], {relativeTo: this.route})
  }

  onDelete(course: Course){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover este curso?'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result) {
        this.refresh
        this.snackBar.open('Curso Removido com Sucesso', 'X', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        catchError(error => {
          this.onError('Erro ao Deletar')
          return of([])
        })
      }
    });
  }
  }


