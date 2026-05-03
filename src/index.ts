#!/usr/bin/env node
import { Command } from 'commander';
import { fetchTrendingRepos } from './github.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('trending-repos')
  .description('CLI to fetch trending GitHub repositories')
  .version('1.0.0')
  .option('-d, --duration <type>', 'time range (day, week, month, year)', 'week')
  .option('-l, --limit <number>', 'number of repositories to display', '10')
  .action(async (options) => {
    const { duration, limit } = options;
    
    if (!['day', 'week', 'month', 'year'].includes(duration)) {
      console.error(chalk.red('Error: Duration must be one of day, week, month, or year.'));
      process.exit(1);
    }

    try {
      const repos = await fetchTrendingRepos(duration, parseInt(limit, 10));
      const date = new Date();
      date.setDate(date.getDate() - (duration === 'day' ? 1 : duration === 'week' ? 7 : duration === 'month' ? 30 : 365));
      
      console.log(chalk.bold.blue(`\n🚀 Top ${repos.length} Trending GitHub Repositories (Since ${date.toISOString().split('T')[0]}):\n`));
      
      repos.forEach((repo, index) => {
        console.log(chalk.gray('────────────────────────────────────────────────────────────'));
        console.log(`[${index + 1}] ${chalk.yellow('⭐')} ${chalk.bold.white(`${repo.name}`)} ${chalk.dim(`(${repo.stargazers_count.toLocaleString()} stars)`)}`);
        console.log(`    ${chalk.cyan('Language:')}    ${repo.language || 'N/A'}`);
        console.log(`    ${chalk.cyan('URL:')}         ${chalk.underline(repo.html_url)}`);
        console.log(`    ${chalk.cyan('Description:')} ${(repo.description || 'No description').substring(0, 80)}${repo.description && repo.description.length > 80 ? '...' : ''}`);
      });
      console.log(chalk.gray('────────────────────────────────────────────────────────────\n'));
    } catch (error) {
      console.error(chalk.red('Error fetching data:'), error instanceof Error ? error.message : error);
    }
  });

program.parse();
