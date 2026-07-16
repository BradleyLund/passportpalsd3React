# PassportPals

An app to compare visa requirements and see which countries you can travel to
with friends from other countries! Live at
[passportpalsmap.com](https://passportpalsmap.com/).

Pick everyone's passports and the map colours each country by the toughest
visa requirement anyone in the group would face — blue means you can all just
go, red means someone needs a visa, amber marks your own passports. A
selection is shareable via the query string (e.g.
[`?p=USA,ZAF`](https://passportpalsmap.com/?p=USA,ZAF)).

## Development

```sh
npm install
npm start        # dev server on localhost:3000
npm run build    # production build
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the app and publishes it to the `gh-pages` branch, served at
passportpalsmap.com via GitHub Pages.

## Data

Visa requirement data comes from
[imorte/passport-index-data](https://github.com/imorte/passport-index-data),
a maintained fork of
[ilyankou/passport-index-dataset](https://github.com/ilyankou/passport-index-dataset)
(both scraped from the [Passport Index](https://www.passportindex.org/)).

The data is refreshed automatically: a scheduled workflow
([`.github/workflows/update-data.yml`](.github/workflows/update-data.yml))
runs every Monday, downloads the latest `passport-index-tidy-iso3.csv`, and —
only if the content changed — commits it together with the last-updated date
in [`public/data-meta.json`](public/data-meta.json) (shown in the site
footer), then triggers a redeploy. It can also be run manually from the
Actions tab ("Update visa data" → "Run workflow").

Country boundaries come from `countries-land-10km.geo.json`
([simonepri/geo-maps](https://github.com/simonepri/geo-maps)).
