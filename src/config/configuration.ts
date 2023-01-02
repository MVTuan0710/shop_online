export default () => {
    return {
        node_env: 'local',
        port: 3020,
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