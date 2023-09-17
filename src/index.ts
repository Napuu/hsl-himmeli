import {BikeStationData} from "./types";
import {addAvailability, addOrUpdateStation, createTables, getDb} from "./db";
import * as fs from "fs";

const useMockData = false;

const DIGITRANSIT_APIKEY_FILE = process.env.DIGITRANSIT_APIKEY_FILE;
const DIGITRANSIT_APIKEY_VARIABLE = process.env.DIGITRANSIT_APIKEY;
const DIGITRANSIT_APIKEY = DIGITRANSIT_APIKEY_FILE?.length > 0 ?
    fs.readFileSync(DIGITRANSIT_APIKEY_FILE, "utf-8") :
    DIGITRANSIT_APIKEY_VARIABLE;
// Function that fetches city bike availability data from HSL API
// (https://digitransit.fi/en/developers/apis/1-routing-api/bicycling/)
// API uses graphql, so we need to use a graphql client to fetch the data
const fetchCityBikeAvailability = async (): Promise<BikeStationData> => {
    const query = `
    {
        bikeRentalStations {
            stationId
            name
            bikesAvailable
            spacesAvailable
            lat
            lon
        }
    }
    `;

    const url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";

    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/graphql",
            "digitransit-subscription-key": DIGITRANSIT_APIKEY,
        },
        body: query,
    };

    const json =
        useMockData ?
            (await import("../mocks/bikeRentalStations")).default :
            await (await fetch(url, opts)).json();

    if (!json.data) {
        throw new Error("No data returned from API");
    }
    return json;
}

// Function that is run periodically to fetch city bike availability data
// and store it to the database. If new stations are found, they are added
// to STATION table. Info about availability is stored to AVAILABILITY table.

const run = async () => {
    const db = getDb();
    createTables(db);
    const response = await fetchCityBikeAvailability();
    const stations = response.data.bikeRentalStations;
    for (const station of stations) {
        await addOrUpdateStation(db, station);
        await addAvailability(db, station);
    }
}

const serve = () => {
    Bun.serve({
        fetch(req) {
            return new Response("Hello world!");
            // TODO
        },
    });
}

(() => {
    if (process.argv[2] === "scrape") {
        run().then(() => console.log("Done!")).catch(e => console.log(e))
    } else if (process.argv[2] === "serve") {
        serve();
    } else {
        console.log("Usage: ts-node src/index.ts [scrape|serve]");
    }
})()