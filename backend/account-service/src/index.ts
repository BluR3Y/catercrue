import { ready, closeDBConnections } from './configs/database';
import expressInit from './configs/express';

ready
.then(() => expressInit())
.catch(async (err) => {
    console.error(`Error during app initialization:`, err);
    await closeDBConnections();
});