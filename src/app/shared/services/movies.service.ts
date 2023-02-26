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
  searchTV: string = 'https://api.themoviedb.org/3/search/tv';
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

  getMovieRecommendations(id: number): Observable<any> {
    return this.http.get(`${this.movie}/${id}/recommendations?api_key=${TMDB_API_KEY}&page=1`);
  }

  // Search a Movie by Title / Query String
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

  // Search a TV Show by Title / Query String
  getTvShowByTitle(page: number, title: string): Observable<any> {
    return this.http.get(`${this.searchTV}?api_key=${TMDB_API_KEY}&page=${page}&query=${title}`);
    // https://api.themoviedb.org/3/search/tv?api_key=0518ef053229e44210fcc9955fdb7d2b&language=en-US&page=1&query=The%20Blacklist&include_adult=false
  }

  getShowRecommendations(id: number): Observable<any> {
    return this.http.get(`${this.show}/${id}/recommendations?api_key=${TMDB_API_KEY}&page=1`);
  }
}
