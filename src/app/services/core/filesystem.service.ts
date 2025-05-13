import {Injectable} from '@angular/core';
import {DeleteFileOptions, Directory, Encoding, Filesystem, ReadFileResult} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {Platform} from "@ionic/angular";
import {Photo} from "@capacitor/camera";
import {TkFileFactory} from "../../factories/core/tk-file.factory";
import {TkFile} from '../../interfaces/core/tk-file';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  private readonly _path: string = 'tk/';

  constructor(private platform: Platform) {
  }

  /**
   *
   * @param tkFile
   */
  public async deleteFile(tkFile: TkFile): Promise<void> {
    if(tkFile.filepath) {
      const deleteFileOptions: DeleteFileOptions = { path: tkFile.filepath };
      if(!this.platform.is('hybrid')) {
        deleteFileOptions.directory = Directory.Data;
      }
      await Filesystem.deleteFile(deleteFileOptions);
    }
  }

  /**
   *
   * @param tkFile
   */
  public async readImage(tkFile: TkFile): Promise<TkFile> {
    if(!this.platform.is('hybrid')) {
      const readFile = await Filesystem.readFile({
        path: tkFile.filepath,
        directory: Directory.Data
      });
      tkFile.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
    return tkFile;
  }

  /**
   *
   * @param photo
   * @param path
   */
  public async savePhoto(photo: Photo, path: string = null): Promise<TkFile> {
    // Convert photo to base64 format, required by Filesystem API to save
    let tkFile = TkFileFactory.fromPhoto(photo);
    const base64Data = await this.readAsBase64(tkFile);

    // Write the file to the data directory
    const fileName = this.generatePath(path) + new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
      recursive: true
    });
    tkFile.format = 'jpeg';

    if(this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      tkFile.filepath = savedFile.uri;
      tkFile.webviewPath = Capacitor.convertFileSrc(savedFile.uri);
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      tkFile.filepath = fileName;
    }
    return tkFile;
  }

  /**
   *
   * @param tkFile
   */
  public async readFile(tkFile: TkFile): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: tkFile.filepath,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });
  }

  /**
   *
   * @param tkFile
   * @param data
   * @param path
   */
  public async writeFile(tkFile: TkFile, data: any, path: string = null): Promise<TkFile> {
    const fileName = this.generatePath(path) + new Date().getTime() + '.' + tkFile.format;
    const file = await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Data,
      recursive: true
    });

    if(this.platform.is('hybrid')) {
      tkFile.filepath = file.uri;
    }
    else {
      tkFile.filepath = fileName;
    }

    tkFile.loaded = true;
    return tkFile;
  }

  /**
   *
   * @param path
   */
  public async removeDirectory(path: string): Promise<void> {
    return Filesystem.rmdir({
      path: this.generatePath(path, true),
      directory: Directory.Data,
      recursive: true
    });
  }

  /**
   *
   */
  public async clear(): Promise<void> {
    await Filesystem.rmdir({
      path: this._path.replace('/', ''),
      directory: Directory.Data,
      recursive: true
    });
  }

  /**
   *
   * @param blob
   */
  public convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  /**
   *
   * @param tkFile
   * @private
   */
  private async readAsBase64(tkFile: TkFile) {
    // "hybrid" will detect Cordova or Capacitor
    if(this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: tkFile.filepath
      });
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(tkFile.webviewPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  /**
   *
   * @param path
   * @private
   */
  private trimPath(path: string): string {
    return path.replace(/^\/|\/$/g, '');
  }

  /**
   *
   * @param path
   * @param withoutPostfix
   * @private
   */
  private generatePath(path: string, withoutPostfix: boolean = false): string {
    const postfix: string = withoutPostfix ? '' : '/';
    if(path) {
      return this.trimPath(this._path + path) + postfix;
    }
    return this._path;
  }


}
