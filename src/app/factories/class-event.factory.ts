import { ClassEvent } from "../interfaces/class-event";

export class ClassEventFactory {
  public static fromObject(classEvent: any): ClassEvent {
    // 1) split title on commas, trim whitespace
    const segments: string[] = classEvent.title
      .split(',')
      .map((seg: string) => seg.trim());
    //console.log('Segments after split & trim:', segments);
    // ➜ ["Sonderlehrveranstaltung 2. Semester", "-", "Standardgruppe", "AP152.02.210 (AUD 2024)"]

    // 2) find the piece that has dots in it
    const codeWithAud: string = segments.find(seg => seg.includes('.')) || '';
    // ➜ "AP152.02.210 (AUD 2024)"x

    // 3) drop anything after the first space (removes "(AUD 2024)")
    const rawCode: string = codeWithAud.split(' ')[0];
    // ➜ "AP152.02.210"

    // 4) split on dots and re-join with spaces
    const parts: string[] = rawCode.split('.');
   // console.log('Split parts:', parts);
    // ➜ ["AP152", "02", "210"]
    const formatted: string = parts.join(' ');
    // ➜ "AP152 02 210"
    console.log('Result', parts, segments);
    // 5) return your ClassEvent, sticking the result into tmp
    return new class implements ClassEvent {
      color = classEvent.color;
      end   = classEvent.end;
      id    = classEvent.id;
      start = classEvent.start;
      title = classEvent.title;
      tmp   = rawCode;
      room   = parts[2];

    };
  }

  public static fromArray(classEvents: any[]): ClassEvent[] {
    return classEvents.map(ClassEventFactory.fromObject);
  }
}
