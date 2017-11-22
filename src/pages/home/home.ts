import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//Extra Libraries, Need to install
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  uri:any;
  fileName:any;
  uploadStatus:any;
  uploadMessage:any;

  constructor(public navCtrl: NavController,
              private transfer: FileTransfer,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,private fileChooser: FileChooser,private filePath: FilePath) {}

  uploadFile() {
    //Choose the file using filechoose library
    this.fileChooser.open()
        .then(uri => {
          this.uri=uri;
          return uri;
        })
        //Get filename using filepath library
        .then(uri=>this.filePath.resolveNativePath(uri))
        .then(filePath => {
          let filename:any = filePath.split('/');
          filename = filename[filename.length - 1];
          return(filename)
        })
        //Start Transfering using file transfer plugin
        .then(filename=>{
          this.fileName=filename;
          let loader = this.loadingCtrl.create({
            content: "Uploading..."
          });
          loader.present();
          const fileTransfer: FileTransferObject = this.transfer.create();
          let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: filename,
            chunkedMode: false,
            headers: {}
          }
          fileTransfer.upload(this.uri, 'http://192.168.12.194:8080/upload', options)
              .then((data) => {
                this.uploadStatus=data.responseCode;
                this.uploadMessage=JSON.stringify(data.response);
                console.log(data+" Uploaded Successfully");
                alert(JSON.stringify(data.response));
                loader.dismiss();
                this.presentToast("Image uploaded successfully");
              }, (err) => {
                console.log(err);
                loader.dismiss();
                this.presentToast(err);
              });
        })
        .catch(err => alert(err));
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}