import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: Firestore) {}

  addData(form: any, dbCollection: string) {
    const collectionInstance = collection(this.firestore, dbCollection);
    addDoc(collectionInstance, form.value)
      .then(() => {
        console.log('Data Saved Successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateData(id: string, form: any, dbCollection: string) {
    const docInstance = doc(this.firestore, dbCollection, id);
    const updateData = form.value;
    updateDoc(docInstance, updateData)
      .then(() => {
        console.log('Data Updated');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteData(id: string, dbCollection: string) {
    const docInstance = doc(this.firestore, dbCollection, id);
    deleteDoc(docInstance)
      .then(() => {
        console.log('Data Deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
