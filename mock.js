export const comics = [
  {
    id: 'c1',
    title: '星际访客',
    author: '阿光',
    cover: 'https://picsum.photos/seed/c1-cover/300/420',
    price: 12,
    locked: true,
    pages: Array.from({ length: 12 }, (_, i) => i + 1),
  },
  {
    id: 'c2',
    title: '城市之光',
    author: '文川',
    cover: 'https://picsum.photos/seed/c2-cover/300/420',
    price: 9,
    locked: false,
    pages: Array.from({ length: 10 }, (_, i) => i + 1),
  },
  {
    id: 'c3',
    title: '森林秘闻',
    author: '木墨',
    cover: 'https://picsum.photos/seed/c3-cover/300/420',
    price: 15,
    locked: true,
    pages: Array.from({ length: 15 }, (_, i) => i + 1),
  },
]

export const dailyRecommendations = [comics[1]]