export interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export async function fetchTrendingRepos(
  duration: 'day' | 'week' | 'month' | 'year',
  limit: number = 10
): Promise<Repository[]> {
  const date = new Date();
  switch (duration) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
  }

  const dateString = date.toISOString().split('T')[0];
  const query = `created:>${dateString}`;
  
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items;
}
