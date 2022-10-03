import {Router} from 'express';
import { createLink, getLinks, getLink, removeLink } from '../controllers/link.controller.js';
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLinkValidator, paramLinkValidator } from '../middlewares/validatorManager.js';

const router = Router();

//GET           /api/v1/links       all links
//GET           /api/v1/links/:id   single link
//POST          /api/v1/links       create link
//PATCH/PUT     /api/v1/links/:id   update link

router.get('/', requireToken, getLinks);
router.get('/:id', requireToken, paramLinkValidator, getLink);
router.post('/', requireToken, bodyLinkValidator,createLink);
router.delete('/:id', requireToken, paramLinkValidator, removeLink);
export default router;