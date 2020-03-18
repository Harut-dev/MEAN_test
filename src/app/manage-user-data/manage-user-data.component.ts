import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import { AddUserComponent } from '@app/add-user/add-user.component';
import { EditUserComponent } from '@app/edit-user/edit-user.component';
import { User } from '@app/models';
import { UserService, ROLES } from '@app/services';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-manage-user-data',
  styleUrls: ['manage-user-data.component.css'],
  templateUrl: 'manage-user-data.component.html',
})
export class ManageUserDataComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];
  data: User[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  totalArtists = 0;
  totalDesigners = 0;

  pageSize = 10;
  roles = [
    {
      value: 'all',
      title: 'All',
    },
    ...ROLES
  ];

  roleTitles = {
    artist: 'Artist',
    designer: 'Designer',
    art_manager: 'Art Manager',
  };

  filters = {
    role: new FormControl('all'),
    search: new FormControl(''),
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _userService: UserService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._userService.getUserList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.pageSize,
            this.filters.role.value,
            this.filters.search.value);
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalCount;
          this.totalArtists = data.totalArtists;
          this.totalDesigners = data.totalDesigners;

          return data.users;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);

    this.filters.search.valueChanges.subscribe(() => {
      this._refreshData();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '650px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this._refreshData();
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '650px',
      data: user,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this._refreshData();
    });
  }

  deleteUser(id: string): void {
    this._userService.deleteUser(id).subscribe((result) => {
      this._refreshData();
    });
  }

  roleChanged(): void {
    this._refreshData();
  }

  private _refreshData(): void {
    this._userService.getUserList(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.pageSize,
      this.filters.role.value,
      this.filters.search.value)
      .pipe(map((data) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.totalCount;
        this.totalArtists = data.totalArtists;
        this.totalDesigners = data.totalDesigners;

        return data.users;
      })).subscribe(data => this.data = data);
  }
}
