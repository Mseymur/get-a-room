import {AuthToken} from '../../interfaces/core/auth-token';

export class AuthTokenFactory {
  public static fromObject(authToken: any): AuthToken {
    return new class implements AuthToken {
      token: string = authToken.token;
      validTo: string = authToken.valid_to;
    };
  }
}
