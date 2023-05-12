# CrudFirebase Tutorial

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.2.
angularFire 7.5.0

## Create Angular Project

```
ng new firebase-crud
```

## Create Firebase Project

Go to https://console.firebase.google.com, if you don't have an account, register, and press "Go to console" up in the cortner.

Once you are in the console, create a new project.

## Starting with AngularFire

/src/environments/environment.ts does not exist
Before all, since Angular 15 no longer has the environment.ts file, we have to create it

```ts
export const environment = {
  production: false,
};
```

Install Firebase

```
npm i -g firebase-tools
firebase login
ng add @angular/fire
```

Using the arrow keys move up or down, and use space to select Firestore and unselect hosting option, press enter to continue

Select your firebase account

Select your project or create a new one from the console

You can create a new app inside firebase console, or do it now, choosing create new app

You can check that your environment.ts has changed

```ts
export const environment = {
  firebase: {
    projectId: "yourproject",
    appId: "xxxxxxxxxxxxxxxxxxxxxx",
    databaseURL: "xxxxxxxxxxxxxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxxxxxx",
    locationId: "europe-west",
    apiKey: "xxxxxxxxxxxxxxxxxx",
    authDomain: "xxxxxxxxxxxxx",
    messagingSenderId: "xxxxxxxx",
    measurementId: "xxxxxxxxxx",
  },
  production: false,
};
```

and your app.module.ts will look like this

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideFirestore(() => getFirestore())],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Let's create the html

app.component.html

```html
<body>
  <form #form="ngForm" (ngSubmit)="addTutorial(form)">
    <input type="text" name="title" ngModel />
    <input type="text" name="description" ngModel />
    <button type="submit">Save Data</button>
  </form>
  <ul>
    <li *ngFor="let data of tutorials$ | async">
      {{ data.title }} / {{ data.description }} / {{ data.id }}
      <button (click)="deleteTutorial(data.id)">Delete</button>
      <button (click)="getTutorial(data.id)">Check Tutorial</button>
    </li>
  </ul>
  <section *ngIf="tutorial$ | async as tutorial">
    <h2>{{ tutorial.title }}</h2>
    <form #edit="ngForm" (ngSubmit)="updateTutorial(tutorial.id, edit)">
      <input type="text" name="title" [(ngModel)]="tutorial.title" />
      <input type="text" name="description" [(ngModel)]="tutorial.description" />
      <button type="submit">Save Changes</button>
    </form>
  </section>
</body>
```

to avoid the problems in the terminal, I added the body tag, and I added it to app.

component.scss

```scss
body {
  width: 100%;
}
```

## Create the service

Create a service

```
ng g s crud
```

This service is reusable for any component, dbCollection is any collection you choose in your project, so you can inject this service anywhere.

```ts
import { Injectable } from "@angular/core";
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  constructor(private firestore: Firestore) {}

  addData(form: any, dbCollection: string) {
    const collectionInstance = collection(this.firestore, dbCollection);
    addDoc(collectionInstance, form.value)
      .then(() => {
        console.log("Data Saved Successfully");
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
        console.log("Data Updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteData(id: string, dbCollection: string) {
    const docInstance = doc(this.firestore, dbCollection, id);
    deleteDoc(docInstance)
      .then(() => {
        console.log("Data Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
```

## Add the methods to the ts file

app.component.ts

```ts
import { Component, inject } from "@angular/core";
import { Firestore, collection, collectionData, doc, CollectionReference, docData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { CrudService } from "./services/crud.service";
export interface Tutorial {
  title: string;
  description: string;
  id: string;
}
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  private firestore: Firestore = inject(Firestore); // inject Cloud Firestore
  tutorials$!: Observable<Tutorial[]>;
  tutorial$!: Observable<Tutorial>;
  tutorialsCollection!: CollectionReference;

  title = "crud-firebase";

  constructor(private crudService: CrudService) {
    const tutorialsCollection = collection(this.firestore, "tutorials");
    this.getData(tutorialsCollection);
  }

  getData(data: CollectionReference) {
    collectionData(data, { idField: "id" }).subscribe((val) => {
      console.log(val);
    });
    this.tutorials$ = collectionData(data, {
      idField: "id",
    }) as Observable<Tutorial[]>;
  }

  getTutorial(id: string) {
    const docInstance = doc(this.firestore, "tutorials", id);
    this.tutorial$ = docData(docInstance, {
      idField: "id",
    }) as Observable<Tutorial>;
  }

  addTutorial(form: any) {
    this.crudService.addData(form, "tutorials");
  }

  updateTutorial(id: string, form: any) {
    this.crudService.updateData(id, form, "tutorials");
  }

  deleteTutorial(id: string) {
    this.crudService.deleteData(id, "tutorials");
  }
}
```

I haven't found a way yet to make a getAll and get generic method for the crudService, so everytime you want to get data from a collection, you would have to add the getAll and get methods I left you abobe.

```
ng serve
```
