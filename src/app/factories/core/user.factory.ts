import {User} from '../../interfaces/core/user';


export class UserFactory {

  /**
   *
   * @param user
   */
  public static fromObject(user: any): User {
    return new class implements User {
      id: number = user.id;
      name: string = user.name;
      email: string = user.email;
      firstName: string = user.first_name;
      lastName: string = user.last_name;
      country: string = user.country;
      route: string = user.route;
      locality: string = user.locality;
      streetNumber: string = user.street_number;
      postalCode: string = user.postal_code;
      createdAt: string = user.created_at;
      updatedAt: string = user.updated_at;
      phoneNumberCompany: string = user.phone_number_company;
      phoneNumberMobile: string = user.phone_number_mobile;
      phoneNumberPrivate: string = user.phone_number_private;
    };
  }

  /**
   *
   * @param users
   */
  public static fromArray(users: any[]): User[] {
    return users.map(_user => UserFactory.fromObject(_user));
  }
}
