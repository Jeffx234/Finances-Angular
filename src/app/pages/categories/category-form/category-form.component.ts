import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.module';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';
import { error, success } from "toastr";
import { of } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string | undefined;
  public categoryForm: FormGroup = new FormGroup({});
  public pageTitle: string | undefined;
  public serverErrorMessages: string[] = [];
  public submittingForm: boolean = false;
  public category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
  }


  // PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  loadCategory() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          if (params.get("id"))
            return this.categoryService.getById(+params.get("id")!)
          else
            return of(new Category())
        }
        )
      )
  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"
    else {
      const categoryName = this.category.name || "";
      this.pageTitle = `Editando Categoria: ${categoryName}`
    }
  }

  public createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(category: Category) {
   success("Solicita????o processada com sucesso!");

   // redirect/reload component page
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error: any) {
    error("Ocorreu um erro ao processar a sua solicita????o!");

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunica????o com o servidor. Por favor, tente mais tarde."]
  }
}
