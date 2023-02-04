export const NOTIFICATION_CODES = {
  success: '#ace1af',
  warning: '#ffcccb',
  error: '#eb2d17',
  info: '#2bb9e0',
};
export const FETCH_NEXT_PAGE_ITEMS = (items: any, page: number, perPage: number) => {
  if (items?.length > 0) {
    if (page == 1) {
      if ((page*perPage) <= items.length) {
        return items.slice(page-1, (page*perPage));
      } else {
        return items.slice(page-1, items.length);
      }
    } else {
      if ((page*perPage) <= items.length) {
        return items.slice((page*perPage) - perPage, (page*perPage));
      } else {
        return items.slice((page*perPage) - perPage, items.length);
      }
    }
  } else {
    return [];
  }
};

export const FAQS = [
  {
    active: false,
    header: 'What is Mini-Netflix?',
    content: 'Mini-Netflix is a Netflix clone application. With this app, users can view movie details like, the movie image, title, year of production, e.t.c.',
    content2: 'Users can also search for movies based on the movie title, add movies they like to their favourites list.',
    customStyle: {
      background: '#303030',
      'border-radius': '4px',
      'margin-bottom': '8px',
      border: '0px',
    }
  },
  {
    active: false,
    header: 'How do I add movies or TV shows to my favourites list?',
    content: 'Add movies or TV shows you like to your favourites list by clicking the heart icon on the movie details page.',
    customStyle: {
      background: '#303030',
      'border-radius': '4px',
      'margin-bottom': '8px',
      border: '0px',
    }
  },
  {
    active: false,
    header: 'How do I find my favourites movies?',
    content: 'The favourites page. All movies you like are added to your favourites list, which you will find them in the favourites page.',
    customStyle: {
      background: '#303030',
      'border-radius': '4px',
      'margin-bottom': '8px',
      border: '0px'
    }
  },
  {
    active: false,
    header: 'What kind of movies will I find in this Mini-Netflix?',
    content: 'Mini-Netflix has wide range of movies, TV shows, films, anime and more.',
    customStyle: {
      background: '#303030',
      'border-radius': '4px',
      'margin-bottom': '8px',
      border: '0px',
    }
  },
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];
