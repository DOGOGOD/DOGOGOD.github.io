export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// Northern-hemisphere calendar seasons, matching the blog's seasonal greeting.
export function getSeason(date = new Date()): Season {
  return (['winter', 'spring', 'summer', 'autumn'] as const)[Math.floor((date.getMonth() + 1) % 12 / 3)];
}

export const seasonalGreetings = {
  zh: {
    spring: { title: '春日安好', message: '愿新一季的阅读，带来清醒与从容。' },
    summer: { title: '盛夏安好', message: '愿你在漫长白昼里，读到片刻清凉。' },
    autumn: { title: '新秋安好', message: '愿每一次翻页，都有所收获。' },
    winter: { title: '冬日安好', message: '愿灯下的文字，带来一点温暖。' },
  },
  en: {
    spring: { title: 'Spring greetings', message: 'May the new season bring clear and thoughtful reading.' },
    summer: { title: 'High summer greetings', message: 'May these pages offer a quiet pause in the long daylight.' },
    autumn: { title: 'Autumn greetings', message: 'May every page leave something worth keeping.' },
    winter: { title: 'Winter greetings', message: 'May these words bring a little warmth to the reading hour.' },
  },
} as const;
