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
      console.log(`\n${chalk.bgBlue.white.bold(' 🚀 GitHub Trending Repositories ')}`);
      console.log(chalk.gray(`Duration: ${duration} | Limit: ${limit}\n`));
      
      repos.forEach((repo, index) => {
        console.log(chalk.dim('─'.repeat(50)));
        console.log(`${chalk.yellow(index + 1)}. ${chalk.bold.green(repo.name)}`);
        console.log(chalk.white(repo.description || 'No description available.'));
        console.log(
          `${chalk.yellow('★')} ${repo.stargazers_count.toLocaleString()} ` +
          `${chalk.dim('•')} ${chalk.cyan(repo.language || 'Unknown')}`
        );
        console.log(chalk.blue.underline(repo.html_url));
      });
      console.log(chalk.dim('─'.repeat(50)) + '\n');
    } catch (error) {
      console.error(chalk.red('Error fetching data:'), error instanceof Error ? error.message : error);
    }
  });

program.parse();
