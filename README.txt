### Ironman Athlete Tracker Scraper

Logs an array of athlete objects taken from the Ironman athlete tracker in the form:

Athlete Object
```
{ 
  swimSplits: [ { slpit object } ],
  runSplits: [ { split object } ],
  bikeSplits: [ { split object } ],
  transitionSplits: [ { split object } ],
  name: 'Zachry, Woodie',
  href: 'newathlete.php?rid=2147483774&race=silverman70.3&bib=226&v=3.0&beta=&1444022100',
  country: 'USA',
  divRank: '49',
  overallRank: '429',
  swim: '00:42:27',
  bike: '03:25:05',
  run: '02:16:55',
  finish: '06:36:16'
}
```

Split Object:
```
{ 
  splitName: '1.1 mi',
  distance: '1.1 mi ',
  splitTime: '9:43',
  raceTime: '4:39:56',
  pace: '8:45/mi',
  divRank: '',
  genderRank: '',
  overallRank: ''
}
```

#### Getting Started

```
npm install --g babel
npm install
npm start
```

#### Known issues

- the first split in each array contains the header information
- some of the splits still have html tags
- ? (This is a hack, I'm sure plenty is broken)