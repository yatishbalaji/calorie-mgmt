
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    AngularMaterialModule,
  ],
})

export class SharedModule { }