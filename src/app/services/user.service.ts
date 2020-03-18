import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '@env/environment';

import { User, UsersListApi } from '@app/models';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }


  updateUser(updateUserInfo) {
    return this.http.put<{success: boolean, error: any, _id: string|undefined}>(`${environment.apiUrl}/users`, updateUserInfo)
      .pipe(map(user => {
        return user;
      }));
  }

  isEmailAvailable(email) {
    return this.http.get<string>(`${environment.apiUrl}/users/isEmailAvailable/?email=${email}`);
  }

  createUser(user: User) {
    return this.http.post<{success: boolean, error: any, _id: string|undefined}>(`${environment.apiUrl}/users`, user);
  }

  getUserList(sort: string, order: string, page: number, pageSize: number, role: string, search: string): Observable<UsersListApi> {
    const requestUrl =
      `${environment.apiUrl}/users/?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&role=${role}&search=${search}`;

    return this.http.get<UsersListApi>(requestUrl);
  }

  deleteUser(_id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/users/?id=${_id}`);
  }
}
