/* City bike availability looks like this:
 {
    data: {
        bikeRentalStations: [
            {
                stationId: "701",
                name: "Gallen-Kallelan tie",
                bikesAvailable: 1,
                spacesAvailable: 9,
                lat: 60.206142,
                lon: 24.840699
            }, {
...
*/

export type BikeStation = {
    stationId: string;
    name: string;
    bikesAvailable: number;
    spacesAvailable: number;
    lat: number;
    lon: number;
}

export type BikeStationEntry = Omit<BikeStation, "bikesAvailable">;

export type BikeStationData = {
    data: {
        bikeRentalStations: BikeStation[];
    }
}

export type AvailabilityEntry = {
    stationId: string;
    timestamp: number;
    bikesAvailable: number;
}