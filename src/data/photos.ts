export type PhotoTag = '35mm' | '120mm' | 'B/W' | 'Multi';

export interface Photo {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  tags: PhotoTag[];
}

export const photos: Photo[] = [
  { id: 1, src: '/web/CDMXtower-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W', 'Multi'] },
  { id: 18, src: '/web/hummingbird-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 31, src: '/web/prince-longexp.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 6, src: '/web/cabin-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 27, src: '/web/night-liquor-120.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['120mm', 'B/W'] },
  { id: 4, src: '/web/agave-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 34, src: '/web/statue-dream.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 2, src: '/web/LA-crosswalk.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 5, src: '/web/beach-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 24, src: '/web/me-myself-i-3.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 26, src: '/web/museo-thinker.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W'] },
  { id: 23, src: '/web/me-myself-i-2.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 7, src: '/web/cabin-fever.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 32, src: '/web/self-double-120.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['120mm', 'B/W'] },
  { id: 9, src: '/web/cliff-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 22, src: '/web/me-myself-I-1.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 30, src: '/web/prince-gargoyle.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 15, src: '/web/escondido-sunset.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 13, src: '/web/dream-building.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 16, src: '/web/friend-triple.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 10, src: '/web/concert-double.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'B/W', 'Multi'] },
  { id: 8, src: '/web/cabin-four.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 28, src: '/web/pool-roof.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
  { id: 35, src: '/web/sunset-meeting.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 19, src: '/web/la-man.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 12, src: '/web/dodger-champs.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 36, src: '/web/symmetry-ballast.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 37, src: '/web/the-boys.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 29, src: '/web/prince-couch.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 20, src: '/web/la-police.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 17, src: '/web/house-dusk.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm'] },
  { id: 3, src: '/web/abstract-self.jpeg', width: 1600, height: 1200, alt: 'Bad Alien Creative Work', tags: ['35mm', 'Multi'] },
];

export const photoFilters: (PhotoTag | 'All')[] = ['All', '35mm', '120mm', 'B/W', 'Multi'];
