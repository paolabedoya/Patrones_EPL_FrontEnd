import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {UploadFilesService} from "../services/upload-files.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { ViewChild } from '@angular/core';
import { ElementRef, Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']

})
export class FileComponent implements OnInit {

  selectedFiles: FileList;

  progressInfo = [];

  message = '';

  filename = '';

  filesToForm = [];

  fileInfos: Observable<any>;

  //public fileXML: File;


  constructor(private uploadFileService: UploadFilesService, private http: HttpClient) {
  }

  //
  ngOnInit(): void {

  }

  showFileContent(file: any): void{
    console.log(      "file:///"+file.filePath)
    window.open(
      "file:///"+file.filePath,
      '_blank'
    );
  }


/*
   fileValidation(){
    const fileInput = document.getElementById('file');
    const filePath = fileInput.nodeValue;
    const allowedExtensions = /(.xml|.XML)$/i;
    if(!allowedExtensions.exec(filePath)){
      alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
      fileInput.nodeValue = '';
      return false;
    }else{
      //Image preview
      if (fileInput. && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'"/>';
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    }
  }
*/

  selectFiles(event) {
    console.log('seleccionando archivos', event.target.files);
    this.progressInfo = [];
      event.target.files.length == 1 ? this.filename = event.target.files[0].name : this.filename = event.target.files.length + "Archivos"
      this.selectedFiles = event.target.files;
    }


  uploadFiles() {
    this.message = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  @ViewChild('pdf', {static: true}) pdf:ElementRef;
  upload(index, file) {
    console.log( "archivo a cargar: "+ file.name);
    this.progressInfo[index] = {value: 0, filename: file.name}
    this.uploadFileService.upload(file).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfo[index].value = Math.round(100 * event.loaded / event.total)
        } else if (event instanceof HttpResponse) {
          this.fileInfos = event.body;

          this.fileInfos.forEach(element => {
            let aux = element.split('\\')
            this.filesToForm.push({fileName: aux[aux.length -1], filePath: element });
            setTimeout(() => {
              document.getElementById("txtVisor").setAttribute("src", element);

            }, 500);

          });

          console.log(" Archivo cargado correctamente  " , this.fileInfos);
          //this.message = " Archivo cargado correctamente  " + file.name;
        }
      },
      err => {
        this.progressInfo[index].value = 0;
        this.message = "No se puede subir el archivo  " + file.name;
      });
  }
}
