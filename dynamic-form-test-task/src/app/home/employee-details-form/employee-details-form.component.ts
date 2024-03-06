import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { FormDataServiceService } from 'src/app/services/form-data-service.service';

@Component({
  selector: 'app-employee-details-form',
  templateUrl: './employee-details-form.component.html',
  styleUrls: ['./employee-details-form.component.scss'],
})
export class EmployeeDetailsFormComponent implements OnInit {
  employeeDetailsForm: FormGroup;
  public formDataStructure: any;
  public arr: any = [];
  isFormCreated: boolean = false;
  date: any;
  checkboxValueArray: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private fromDataService: FormDataServiceService,
    private router: Router,
    private toastController: ToastController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.fromDataService.getFormDataStructure().subscribe((data) => {
      this.formDataStructure = JSON.parse(JSON.stringify(data));
      this.formDataStructure.formFields.forEach((ele, i) => {
        this.formDataStructure.formFields[i]['formattedLabel'] = ele['label']
          .toLowerCase()
          .split(' ')
          .join('_');
      });
      this.buildForm();
    });
  }

  buildForm() {
    let finalFormGroup = {};
    this.formDataStructure.formFields.forEach((fg) => {
      let eachFormGroup = {};
      fg.fields.forEach((fc) => {
        let controlValidators = [];
        if (fc.validations) {
          Object.keys(fc.validations).forEach((validation) => {
            if (
              validation === 'isRequired' &&
              fc.validations['isRequired'] === true
            )
              controlValidators.push(Validators.required);
            if (validation === 'pattern')
              controlValidators.push(
                Validators.pattern(fc.validations.pattern)
              );
          });
        }
        eachFormGroup[fc.name] = ['', controlValidators];
      });
      finalFormGroup[fg.formattedLabel] = this.formBuilder.group(eachFormGroup);
    });
    this.employeeDetailsForm = this.formBuilder.group(finalFormGroup);
    this.fromDataService.employeeDetailsFormData =
      this.employeeDetailsForm.value;
    this.isFormCreated = true;
  }

  submitForm() {
    if (this.employeeDetailsForm.valid) {
      this.fromDataService.employeeDetailsFormData =
        this.employeeDetailsForm.value;
      this.formatFormData();
      this.displayToast('Form data captured! Check console', 'info');
    } else {
      this.displayToast('Form is missing some mandatory values!', 'error');
      this.employeeDetailsForm.markAllAsTouched();
    }
  }

  displayStuff(val: any) {
    return JSON.stringify(val);
  }

  isInvalid(control, section) {
    let formControl = this.employeeDetailsForm
      .get(section.formattedLabel)
      .get(control.name);
    if (formControl.touched && formControl.invalid) {
      return true;
    }
    return false;
  }

  getErrorMessages(control, section) {
    let formControl = this.employeeDetailsForm
      .get(section.formattedLabel)
      .get(control.name);
    if (formControl.touched && formControl.invalid) {
      let controlErrors = formControl.errors;
      let errorMessageList = ['Error'];
      if (Object.keys(controlErrors).length > 0) {
        errorMessageList = [];
      }
      for (let prop in controlErrors) {
        if (prop === 'required') {
          errorMessageList.push('Field is mandatory');
        }
        if (prop === 'pattern') {
          errorMessageList.push('Invalid characters should not be included');
        }
      }
      return errorMessageList;
    }
    return [''];
  }

  displayToast(message, type = 'info') {
    let toastClass =
      type === 'info' ? 'toast-info-custom-class' : 'toast-error-custom-class';
    this.toastController
      .create({
        message: message,
        position: 'top',
        cssClass: toastClass,
        duration: 5000,
        buttons: [
          {
            side: 'end',
            icon: 'close',
            handler: () => {},
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }

  formatFormData() {
    this.formDataStructure.formFields.forEach((fg) => {
      fg.fields.forEach((fc) => {
        if (fc.type === 'checkbox') {
          let checkBoxControls = document.getElementsByName(fc.name);
          let val = [];
          checkBoxControls.forEach((cb) => {
            if (cb['checked']) {
              val.push(cb['id']);
            }
          });
          this.fromDataService.employeeDetailsFormData[fg.formattedLabel][
            fc.name
          ] = val.join(',');
        }
      });
    });
    console.log(
      'Form Data Captured: \n' +
        JSON.stringify(this.fromDataService.employeeDetailsFormData, null, 2)
    );
  }
}
