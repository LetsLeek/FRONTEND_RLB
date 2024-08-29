import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should activate if the user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    
    const route = {} as ActivatedRouteSnapshot; // Mock route object
    const state = {} as RouterStateSnapshot;    // Mock state object
    
    expect(authGuard.canActivate(route, state)).toBe(true);
  });

  it('should not activate if the user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    
    const navigateSpy = spyOn(router, 'navigate');
    const route = {} as ActivatedRouteSnapshot; // Mock route object
    const state = {} as RouterStateSnapshot;    // Mock state object
    
    expect(authGuard.canActivate(route, state)).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
