import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TMDB_API_KEY, OMDB_API } from 'src/secrets.config';

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
  popularTV: string = 'https://api.themoviedb.org/3/tv/popular';

  constructor(private http: HttpClient) { }

  /**
   * Movies
   */
  getMovies(page: number): Observable<any> {
    return this.http.get(`${this.popular}?api_key=${TMDB_API_KEY}&page=${page}`);
  }

  getMovieById(id: number): Observable<any> {
    return this.http.get(`${this.movie}/${id}?api_key=${TMDB_API_KEY}`);
  }

  // getMovieRecommendations(id: number): Observable<any> {
  //   return this.http.get(`${this.movie}/${id}/recommendations?api_key=${TMDB_API_KEY}`);
  // }

  getMovieByTitle(title: string, page: number): Observable<any> {
    return this.http.get(`${this.search}?api_key=${TMDB_API_KEY}&query=${title}&page=${page}`);
  }

  getOMDb(id: string): Observable<any> {
    return this.http.get(`${this.OMDb}/?apikey=${OMDB_API}&i=${id}`);
  }

  /**
   * TV Shows
   */
  getShows(page: number): Observable<any> {
    return this.http.get(`${this.popularTV}?api_key=${TMDB_API_KEY}&page=${page}`);
  }

  getShowById(id: number): Observable<any> {
    return this.http.get(`${this.show}/${id}?api_key=${TMDB_API_KEY}`);
  }
}
