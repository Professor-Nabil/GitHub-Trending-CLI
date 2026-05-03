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
      console.log(chalk.blue(`Found ${repos.length} trending repositories from the last ${duration}:`));
      
      repos.forEach((repo, index) => {
        console.log(`\n${index + 1}. ${chalk.bold.green(repo.name)}`);
        console.log(`   ${repo.description || 'No description'}`);
        console.log(`   ${chalk.yellow('★')} ${repo.stargazers_count} | ${chalk.cyan(repo.language || 'N/A')}`);
        console.log(`   ${chalk.underline(repo.html_url)}`);
      });
    } catch (error) {
      console.error(chalk.red('Error fetching data:'), error instanceof Error ? error.message : error);
    }
  });

program.parse();
