/**
 * @author johnworth, sriram
 *
 * Returns a list of recent analyses.
 *
 * @module analyses/recent
 */

import logger from "../logging";
import { validateLimit } from "../util";
import axios from "axios";
import * as config from "../configuration";

export const getData = async (username, limit) => {
    try {
        const { data } = await axios.get(
            `${
                config.appsURL
            }/analyses?sort-field=startdate&limit=${limit}&sort-dir=DESC&user=${
                username?.split("@")[0]
            }`
        );
        logger.info(
            "Recent analyses for user " + username + ": " + JSON.stringify(data)
        );
        return data;
    } catch (e) {
        throw new Error(e);
    }
};

const getHandler = () => async (req, res) => {
    try {
        const limit = validateLimit(req?.query?.limit) ?? 10;
        const username = req?.params?.username;
        const rows = await getData(username, limit);
        res.status(200).json(rows);
    } catch (e) {
        logger.error(e);
        res.status(500).send(e.message);
    }
};

export default getHandler;
