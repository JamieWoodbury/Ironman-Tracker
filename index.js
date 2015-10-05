import request from 'request';
import cheerio from 'cheerio';
import _ from 'lodash';

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200)
        resolve(html);
      else
        reject(error);
    })
  })
};

function getPagePromise(letter) {
  return requestPromise(`http://track.ironman.com/newsearch.php?y=2015&race=silverman70.3&v=3.0&letter=${letter}`)
    .then((html) => {
      const $ = cheerio.load(html);

      let athletes = $('tbody')
        .children()
        .toArray()
        .map((tr) => {
          let row = $(tr).children();

          let name = $(row[1]).find('a').html();;
          let href = $(row[1]).find('a').attr('href');
          let country = $(row[2]).html();
          let divRank = $(row[3]).html();
          let overallRank = $(row[4]).html();
          let swim = $(row[5]).html();
          let bike = $(row[6]).html();
          let run = $(row[7]).html();
          let finish = $(row[8]).html();
          
          return { name, href, country, divRank, overallRank, swim, bike, run, finish }
        });
        return athletes
    })
    .catch( err => console.error(err) )
};

function parseTable(table, $) {
  return table
    .toArray()
    .map((tr) => {
      let row = $(tr).children();

      let splitName = $(row[0]).html()
      let distance = $(row[1]).html()
      let splitTime = $(row[2]).html()
      let raceTime = $(row[3]).html()
      let pace = $(row[4]).html()
      let divRank = $(row[5]).html()
      let genderRank = $(row[6]).html()
      let overallRank = $(row[7]).html()
      
      return { splitName, distance, splitTime, raceTime, pace, divRank, genderRank, overallRank }
    })
}

function parseTransitionTable(table, $) {
  return table
    .toArray()
    .map((tr) => {
      let row = $(tr).children();

      let splitName = $(row[0]).html()
      let time = $(row[1]).html()
      
      return { splitName, time }
    })
}

function getAthletePagePromise(athlete){
  let url = `http://track.ironman.com/${athlete.href}`;
  
  return requestPromise(url)
    .then((html) => {
      const $ = cheerio.load(html);

      let eventTables = $('.athlete-table-details table')

      let swimTable = $(eventTables[0]).find('tr');
      let bikeTable = $(eventTables[1]).find('tr');
      let runTable = $(eventTables[2]).find('tr');
      let transitionTable = $(eventTables[3]).find('tr');

      let swimSplits = parseTable(swimTable, $);
      let bikeSplits = parseTable(bikeTable, $);
      let runSplits = parseTable(runTable, $);
      let transitionSplits = parseTransitionTable(transitionTable, $);
      
      return {swimSplits, runSplits, bikeSplits, transitionSplits};
    })
    .catch( err => console.error(err) )
}

// const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const alphabet = 'z'.split('');
const allPagePromises = alphabet.map((letter) => { return getPagePromise(letter) });

const enrichedPagesPromise = Promise.all(allPagePromises)
  .then((pages) => {

    const allAthletes = _.flatten(pages)
    let allAthletePagePromises = allAthletes.map( athlete => getAthletePagePromise(athlete) )

    return Promise.all(allAthletePagePromises)
      .then((pages) => {
        return pages.map( (page, i) => {
          return _.extend(page, allAthletes[i]) 
        })
      })
  })
  .then((athletes) => {
    console.log(athletes)
  })
  .catch( err => console.error(err) )