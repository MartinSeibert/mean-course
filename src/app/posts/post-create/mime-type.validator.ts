import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  // string filepaths will always be valid
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;

  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    // this event fires the function passed in as a parameter when the fileReader is done loading a file
    fileReader.addEventListener('loadend', () => {
      // access the portion of the file that has the MIME type
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
// tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        // convert to hexadecimal
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: false});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });

  return frObs;
};
