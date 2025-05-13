import {Injectable} from '@angular/core';
import {VoiceRecorder} from 'capacitor-voice-recorder';
import {FilesystemService} from './filesystem.service';


@Injectable({
  providedIn: 'root'
})
export class VoiceRecorderService {
  constructor(private filesystemService: FilesystemService) {
  }

  /**
   *
   */
  public async startRecording(): Promise<void> {
    if(await VoiceRecorder.hasAudioRecordingPermission()) {
      await VoiceRecorder.requestAudioRecordingPermission();
    }
    await VoiceRecorder.startRecording();
  }

  /**
   *
   */
  public async stopRecording(): Promise<void> {
    const data = await VoiceRecorder.stopRecording();
    console.log(data);
  }

}
