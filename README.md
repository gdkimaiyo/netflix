# Netflix
A MiniNetflix web application developed with Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3.

## Installation

### Set up the project on your PC

- run **`git clone https://github.com/gdkimaiyo/netflix.git`** to clone the repository
- **`cd`** into the project and on root folder, run **`yarn install`** or **`npm install`** to install dependencies

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## TODO

### USer Story

**As a User:**
- [x] I should be able to view all movies: The Movie Image, Movie Title, and Year of Production. ( Use APIs e.g themoviedb API)
- [x] I should be able to search for movie title with specific words.
- [x] I should be able to click on a movie and it should display more details about the movie like Rated, Released,  - Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Awards any other you want to display.
- [x] I should be able to like movies / favourites and it should persist even if I refresh/reload the browser is (Use session storage)
- [x] I should see favorites page that shows my favorite movies
- [x] Show movie recomendations

- [x] Repeat above for TV Shows

**Bonus:**
- [ ] Implement authentication in express js where as a user, I can persist my favorite movies forever and remove movies from my favorites list. Use any DB of your choice.

## License

[MIT](https://github.com/gdkimaiyo/netflix/blob/master/LICENSE.md)
