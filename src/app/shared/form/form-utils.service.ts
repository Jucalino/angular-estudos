import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  validateAllFormFields(formGroup: FormGroup | FormArray){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field)

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      }else if (control instanceof FormGroup || control instanceof FormArray){
        control.markAsTouched({ onlySelf: true })
        this.validateAllFormFields(control)
      }
    })
  }

  getErrorMessage(formGroup: FormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as FormControl;
    return this.getErrorMessageFromField(field)
  }

    getErrorMessageFromField(field: FormControl) {
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

  getFormArrayFieldErrorMessage(formGroup: FormGroup, formArrayName: string,
    fieldName: string, index: number){
    const formArray = formGroup.get(formArrayName) as FormArray;
    const field = formArray.controls[index].get(fieldName) as FormControl
    return this.getErrorMessageFromField(field)
  }

  isFormArrayRequired(formGroup: FormGroup, formArrayName: string){
    const formArray = formGroup.get(formArrayName) as FormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched
  }

}
