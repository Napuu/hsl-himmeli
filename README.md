# hsl-himmeli

Fetches HSL city bike station data and stores it to a sqlite database.


### Usage

Following command runs the script in a docker container. It assumes that sqlite db is located at `./hsl-himmeli.db`.
At least file must exist so docker mount works. So run `touch hsl-himmeli.db` before running the script.
```bash
docker compose run hsl-himmeli
```