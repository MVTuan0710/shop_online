export default () => {
    return {
        node_env: 'local',
        port: 3020,
        // timezone: process.env.TIMEZONE || 'America/New_York',
        // log_file_path: process.env.LOG_FILE_PATH || 'logs/combined.log',
        database: {
            type:'postgres',
            host:'localhost',
            port: 5432,
            username: 'postgres',
            password: '123',
            db_name: 'test_db_shop_online'
        },
        jwt: {
            secret: 'secret_key',
            expires_in: '3h'
        }
    }
}