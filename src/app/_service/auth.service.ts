import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';

// Add only those routes here which won't be allowed for `free` or `pro` users and shown `/upgrade` page instead.
enum DISABLED_ROUTES {
    free = <any>[],
    pro = <any>['/pages/products', '/pages/dashboard', '/pages/configure'],
    guru = <any>[],
}

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private af: AngularFireAuth, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.from(this.af.authState)
      .take(1)
      .map(stat => !!stat)
      .do(authenticated => {
        // if (!authenticated) this.router.navigate(['/login']);
        // verify the attempted URL
        const userId = firebase.auth().currentUser.uid;
        if (userId) {
          const userRef = firebase.database().ref(`users/${userId}`);
          userRef.once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data && data.plan && (DISABLED_ROUTES[data.plan] || <any>[]).indexOf(state.url) !== -1) {
              this.router.navigate(['/pages/upgrade']);
            }
          });
        }
      });
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }

}
