import { AppDataSource } from '../config/database';

async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Database connection initialized');

        // Run migrations
        await AppDataSource.runMigrations();
        console.log('Migrations completed successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
}

initializeDatabase(); 