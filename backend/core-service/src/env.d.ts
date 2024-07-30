declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        MONGO_HOST: string;
        MONGO_ACCESS_USER: string;
        MONGO_ACCESS_PASSWORD: string;
        MONGO_PORT?: string;
        MONGO_DATABASE: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_ACCESS_USER?: string;
        REDIS_ACCESS_PASSWORD: string;
        REDIS_DB_INDEX?: string;
    }
}