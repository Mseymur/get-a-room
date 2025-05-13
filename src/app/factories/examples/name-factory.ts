import {Name} from '../../interfaces/examples/name';
import {Gender} from '../../interfaces/examples/gender';


export class NameFactory {
  public static fromObject(name: any): Name {
    return new class implements Name {
      age: number = name.age;
      createdAt: string = name.created_at;
      email: string = name.email;
      firstName: string = name.first_name;
      gender: Gender = name.gender;
      genderId: number = name.gender_id;
      id: number = name.id;
      isConfirmed: string = name.is_confirmed;
      lastName: string = name.last_name;
      phoneNumber: string = name.phone_number;
      updateAt: string = name.update_at;
    };
  }
}
