import { Database } from "bun:sqlite";
import {BikeStation} from "./types";
const dbPath = "hsl-himmeli.sqlite";
export const getDb = () => {
    return new Database(dbPath);
}

export const createTables = (db: Database) => {
    db.query(`
    CREATE TABLE IF NOT EXISTS STATION (
        stationId TEXT PRIMARY KEY,
        name TEXT,
        lat REAL,
        lon REAL
    );`).run();
    db.query(`
    CREATE TABLE IF NOT EXISTS AVAILABILITY (
        stationId TEXT,
        timestamp INTEGER,
        bikesAvailable INTEGER,
        FOREIGN KEY(stationId) REFERENCES STATION(stationId)
    );`).run();
}
export const addOrUpdateStation = async (db: Database, station: BikeStation) => {
    const sql = `
    INSERT INTO STATION (stationId, name, lat, lon)
    VALUES ($stationId, $name, $lat, $lon)
    ON CONFLICT(stationId) DO UPDATE SET
        name = $name,
        lat = $lat,
        lon = $lon
    `;
    const params = {
        $stationId: station.stationId,
        $name: station.name,
        $lat: station.lat,
        $lon: station.lon,
    };
    db.query(sql).run(params);
}

export const addAvailability = async (db: Database, station: BikeStation) => {
    const sql = `
    INSERT INTO AVAILABILITY (stationId, timestamp, bikesAvailable)
    VALUES ($stationId, $timestamp, $bikesAvailable)
    `;
    const params = {
        $stationId: station.stationId,
        $timestamp: Date.now(),
        $bikesAvailable: station.bikesAvailable,
    };
    db.query(sql).run(params);
}