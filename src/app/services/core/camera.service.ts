import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {
  }

  public async takePhoto(option: {
    resultType?: CameraResultType,
    source?: CameraSource,
    allowEditing?: boolean,
    quality?: number
  } = {}): Promise<Photo> {

    const permission = await Camera.checkPermissions();
    if(permission.camera === 'denied' && option.source === CameraSource.Camera) {
      await Camera.requestPermissions();
    }

    if(permission.photos === 'denied' && option.source === CameraSource.Photos) {
      await Camera.requestPermissions();
    }

    option = {
      ...{
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        allowEditing: true,
        quality: 80
      }, ...option
    };

    return await Camera.getPhoto({
      resultType: option.resultType,
      source: option.source,
      quality: option.quality,
      saveToGallery: false
    });
  }

}
