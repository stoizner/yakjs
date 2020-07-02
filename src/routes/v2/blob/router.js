import express from 'express';

import getSpacesRoute from './getSpacesRoute';
import getBlobsRoute from './getBlobsRoute';
import getBlobRoute from './getBlobRoute';
import postBlobRoute from './postBlobRoute';
import deleteBlobRoute from './deleteBlobRoute';

export const router = express.Router(); // eslint-disable-line new-cap

router.get('/blob/', getSpacesRoute);
router.get('/blob/:space/', getBlobsRoute);
router.get('/blob/:space/:name', getBlobRoute);
router.post('/blob/:space/:name', postBlobRoute);
router.delete('/blob/:space/:name', deleteBlobRoute);
