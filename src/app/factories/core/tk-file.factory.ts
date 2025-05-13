import {TkFile} from '../../interfaces/core/tk-file';
import {Photo} from '@capacitor/camera';

export class TkFileFactory {

  /**
   *
   */
  public static new(): TkFile {
    return new class implements TkFile {
      id: number = null;
      filepath: string = null;
      webviewPath: string = null;
      format: string = null;
      loaded: boolean = false;
    };
  }

  /**
   *
   * @param photo
   */
  public static fromPhoto(photo: Photo): TkFile {
    return new class implements TkFile {
      id: number = null;
      filepath: string = photo.path;
      webviewPath: string = photo.webPath;
      format: string = photo.format;
      loaded: boolean = true;
    }
  }

}
