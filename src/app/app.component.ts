import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  CollectionReference,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CrudService } from './services/crud.service';
export interface Tutorial {
  title: string;
  description: string;
  id: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  tutorials$!: Observable<Tutorial[]>;
  tutorial$!: Observable<Tutorial>;
  tutorialsCollection!: CollectionReference;

  title = 'crud-firebase';

  constructor(private crudService: CrudService) {
    const tutorialsCollection = collection(this.firestore, 'tutorials');
    this.getData(tutorialsCollection);
  }

  getData(data: CollectionReference) {
    collectionData(data, { idField: 'id' }).subscribe((val) => {
      console.log(val);
    });
    this.tutorials$ = collectionData(data, {
      idField: 'id',
    }) as Observable<Tutorial[]>;
  }

  getTutorial(id: string) {
    const docInstance = doc(this.firestore, 'tutorials', id);
    this.tutorial$ = docData(docInstance, {
      idField: 'id',
    }) as Observable<Tutorial>;
  }

  addTutorial(form: any) {
    this.crudService.addData(form, 'tutorials');
  }

  updateTutorial(id: string, form: any) {
    this.crudService.updateData(id, form, 'tutorials');
  }

  deleteTutorial(id: string) {
    this.crudService.deleteData(id, 'tutorials');
  }
}
