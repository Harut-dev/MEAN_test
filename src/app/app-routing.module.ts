import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageUserDataComponent} from './manage-user-data/manage-user-data.component';


const routes: Routes = [
  {
    path: '',
    component: ManageUserDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
