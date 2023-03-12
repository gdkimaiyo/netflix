import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TMDB_API_KEY, OMDB_API } from 'src/secrets.config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  OMDb: string = 'https://www.omdbapi.com';
  // Movies endpoints
  movie: string = 'https://api.themoviedb.org/3/movie';
  search: string = 'https://api.themoviedb.org/3/search/movie';
  popular: string = 'https://api.themoviedb.org/3/movie/popular';

  // TV Shows endpoints
  show: string = 'https://api.themoviedb.org/3/tv';
  searchTV: string = 'https://api.themoviedb.org/3/search/tv';
  popularTV: string = 'https://api.themoviedb.org/3/tv/popular';

  // Inject HttpBackend to dispatch requests directly to the backend, 
  // without going through the interceptor chain.
  private _http: HttpClient;

  constructor(private http: HttpClient, private http2: HttpBackend) {
    this._http = new HttpClient(http2);
  }

  /**
   * Movies
   */
  getMovies(page: number): Observable<any> {
    return this._http.get(`${this.popular}?api_key=${TMDB_API_KEY}&page=${page}`);
  }

  getMovieById(id: number): Observable<any> {
    return this._http.get(`${this.movie}/${id}?api_key=${TMDB_API_KEY}`);
  }

  getMovieRecommendations(id: number): Observable<any> {
    return this._http.get(`${this.movie}/${id}/recommendations?api_key=${TMDB_API_KEY}&page=1`);
  }

  // Search a Movie by Title / Query String
  getMovieByTitle(title: string, page: number): Observable<any> {
    return this._http.get(`${this.search}?api_key=${TMDB_API_KEY}&query=${title}&page=${page}`);
  }

  getOMDb(id: string): Observable<any> {
    return this._http.get(`${this.OMDb}/?apikey=${OMDB_API}&i=${id}`);
  }

  getFavMovies(): Observable<any> {
    return this.http.get(`${environment.backendApi}/api/v1/movies/favourites`);
  }

  getFavMovieById(id: number): Observable<any> {
    return this.http.get(`${environment.backendApi}/api/v1/movies/favourites/${id}`);
  }

  addFavMovie(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/movies/favourites`, payload, httpOptions);
  }

  removeFavMovie(id: number, payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/movies/favourites/${id}`, payload, httpOptions);
  }

  /**
   * TV Shows
   */
  getShows(page: number): Observable<any> {
    return this._http.get(`${this.popularTV}?api_key=${TMDB_API_KEY}&page=${page}`);
  }

  getShowById(id: number): Observable<any> {
    return this._http.get(`${this.show}/${id}?api_key=${TMDB_API_KEY}`);
  }

  // Search a TV Show by Title / Query String
  getTvShowByTitle(page: number, title: string): Observable<any> {
    return this._http.get(`${this.searchTV}?api_key=${TMDB_API_KEY}&page=${page}&query=${title}`);
    // https://api.themoviedb.org/3/search/tv?api_key=0518ef053229e44210fcc9955fdb7d2b&language=en-US&page=1&query=The%20Blacklist&include_adult=false
  }

  getShowRecommendations(id: number): Observable<any> {
    return this._http.get(`${this.show}/${id}/recommendations?api_key=${TMDB_API_KEY}&page=1`);
  }

  getFavShows(): Observable<any> {
    return this.http.get(`${environment.backendApi}/api/v1/shows/favourites`);
  }

  getFavShowById(id: number): Observable<any> {
    return this.http.get(`${environment.backendApi}/api/v1/shows/favourites/${id}`);
  }

  addFavShow(payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/shows/favourites`, payload, httpOptions);
  }

  removeFavShow(id: number, payload: any): Observable<any> {
    return this.http.post(`${environment.backendApi}/api/v1/shows/favourites/${id}`, payload, httpOptions);
  }
}
