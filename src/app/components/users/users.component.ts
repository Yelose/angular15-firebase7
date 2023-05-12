import { Component, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
export interface Book {
  author: string;
  genre: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  books$: Observable<Book[]>;
  bookCollection!: CollectionReference;
  constructor() {
    // get a reference to the user-profile collection
    const bookCollection = collection(this.firestore, 'books');

    // get documents (data) from the collection using collectionData
    this.books$ = collectionData(bookCollection) as Observable<Book[]>;
  }

  addBook(form: any) {
    addDoc(this.bookCollection, form.value)
      .then((documentReference: DocumentReference) => {
        console.log('Book added successfully!' + documentReference);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
