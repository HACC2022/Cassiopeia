import { WebApp } from 'meteor/webapp';
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const MEASURE_TYPE = ['hb', 'sb', 'hr', 'sr', 'hcr', 'scr', 'gm'];
/*
 *   mandatory parameters:
 *
 *      year:        2017 (goes back to 2009 as earliest date)
 *      report:      deadline
 *      active:      true (necessary only if measuretype is hb or sb)
 *      rpt_type:
 *      measuretype: [hb|sb|hr|sr|hcr|scr|gm]
 *
 *   Measure Type:
 *      hb:  House Bills
 *      sb:  Senate Bills
 *      hr:  House Resos
 *      sr:  Senate Resos
 *      hcr: House Concurrent Resos
 *      scr: Senate Concurrent Resos
 *      gm:  Governer's Messages
 */

// eslint-disable-next-line consistent-return
app.get('/api/scrapeMeasures/:year/:mt', async (req, res) => {
  try {
    const year = req.params.year;
    const mt = req.params.mt;
    if (year < 2010 || year > new Date().getFullYear || !MEASURE_TYPE.includes(mt)) {
      console.log('Error: invalid parameters');
      throw new Error('Your year or measure type is invalid');
    }
    const url = `https://www.capitol.hawaii.gov/advreports/advreport.aspx?year=${year}&report=deadline&active=true&rpt_type=&measuretype=${mt}`;
    // connects to page
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const scrapedData = [];
    let index = 0;
    // if it's less than 10, add a zero in front to conform with format
    const getIndex = (num) => (num < 10 ? `0${index}` : index);

    $('tr', html).each(function () {
      index += 1;

      const code = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_HyperLink1`)
        .text();
      const measurePdfUrl = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_HyperLink2`)
        .attr('href');
      const measureArchiveUrl = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_HyperLink1`)
        .attr('href');
      const measureTitle = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label7`)
        .text();
      const reportTitle = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label1`)
        .text();
      const description = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label2`)
        .text();
      const statusHorS = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label3`)
        .text();
      const statusDescription = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label4`)
        .text();
      const statusDate = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label5`)
        .text();
      const introducer = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label27`)
        .text();
      const currentReferral = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label9`)
        .text();
      const companion = $(this)
        .find(`#GridViewReports_ctl${getIndex(index)}_Label6`)
        .find('a')
        .text();

      if (`${code}`.length !== 0) {
        // eslint-disable-next-line no-console
        scrapedData.push({
          code: `${code}`,
          measurePdfUrl: `${measurePdfUrl}`,
          measureArchiveUrl: `${measureArchiveUrl}`,
          measureTitle: `${measureTitle}`,
          reportTitle: `${reportTitle}`,
          description: `${description}`,
          statusHorS: `${statusHorS}`,
          statusDescription: `${statusDescription}`,
          statusDate: `${statusDate}`,
          introducer: `${introducer}`,
          currentReferral: `${currentReferral}`,
          companion: `${companion}`,
        });
      }
    });
    if (scrapedData.length === 0) {
      // eslint-disable-next-line no-console
      throw new Error('invalid page');
    }
    res.status(200).json({ scrapedData });
  } catch (error) {
    res.status(404).json({ error: 'Invalid year or measure type' });
  }
});

app.get('/api/scrapeUpcomingHearings', async (req, res) => {
  const url = 'https://www.capitol.hawaii.gov/upcominghearings.aspx';
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const upcomingHearings = [];
  let index = 1;

  const getIndex = (num) => (num < 10 ? `0${index}` : index);

  const convertDate = (dateStr) => {
    // split by space
    const splitDateAndTime = dateStr.split(/\s+/ig);
    // replace '/' with space and split again
    const tempDate = splitDateAndTime[0].replace(/\//ig, ' ').split(/\s+/ig);
    // add the the year to the front of first array item
    tempDate.unshift(tempDate[tempDate.length - 1]);
    // remove year from the back
    tempDate.pop();
    // edge cases if month/day is single digits
    const date = tempDate.map(d => (d.length < 2 ? `0${d}` : d)).join('-');
    // get the time and check if it's PM or AM
    const tempTime = splitDateAndTime[1]
      .replace(/:/ig, ' ')
      .split(/\s+/ig)
      .map(d => (d.length < 2 ? `0${d}` : d));
    // if the time is PM, add 12 hours to it
    if (splitDateAndTime[2] === 'PM') {
      if (tempTime[0] !== '12') {
        tempTime[0] = (parseInt(tempTime[0], 10) + 12).toString();
      }
    }
    if (splitDateAndTime[2] === 'AM' && tempTime[0] === '12') {
      tempTime[0] = '00';
    }
    // add colon back and join date and time with T
    const time = tempTime.join(':');
    return [date, time].join('T');
  };

  $('table#ctl00_ContentPlaceHolderCol1_GridView1 > tbody > tr', html)
    .has('td') // checks if 'td' element is inside of 'tr' element
    .each(function () {
      index += 1;

      const committee = $(this)
        .find(`span#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_Label17`)
        .first()
        .text();
      const measure = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_HyperLink`)
        .text();
      const dateTime = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_Label27`)
        .first()
        .text();
      const room = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_Label27`)
        .last()
        .text();
      const noticeURL = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_HyperLink2`)
        .attr('href');
      const noticePdfURL = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_HyperLink3`)
        .attr('href');
      const youtubeURL = $(this)
        .find(`#ctl00_ContentPlaceHolderCol1_GridView1_ctl${getIndex(index)}_streamLink`)
        .attr('href');
      if (dateTime.length !== 0) {
        upcomingHearings.push({
          committee: committee,
          dateTime: convertDate(dateTime),
          room: room,
          measure: measure,
          noticeURL: noticeURL,
          noticePdfURL: noticePdfURL,
          youtubeURL: youtubeURL,
        });
      }
    });
  res.status(200).json({ upcomingHearings });

});

/* ************************************************************************************* */
// gets the bill details via url
app.get('/api/scrapeBillDetails/:bt/:bn/:year', async (req, res) => {
  try {
    const bt = req.params.bt;
    const bn = req.params.bn;
    const year = req.params.year;
    const url = `https://www.capitol.hawaii.gov/measure_indiv.aspx?billtype=${bt}&billnumber=${bn}&year=${year}`;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let index = 1;
    const lastStatusTextData = [];
    const billDetails = {
      initialDate: '',
      lastStatusText: '',
      measureVersions: [],
      committeeReports: [],
      testimonies: [],
      hearingNotices: [],
    };

    // if it's less than 10, add a zero in front to conform with format
    const getIndex = (num) => (num < 10 ? `0${index}` : index);

    // last status
    $('table#ctl00_ContentPlaceHolderCol1_GridViewStatus > tbody > tr', html).each(function () {
      const lastStatusText = $(this)
        .find('td')
        .append(' ')
        .text();
      lastStatusTextData.push({
        lastStatusText: lastStatusText,
      });
    });
    billDetails.lastStatusText = `${lastStatusTextData.pop().lastStatusText.trim()}`;
    billDetails.initialDate = `${lastStatusTextData[1].lastStatusText.split(' ')[0]}`;

    $('table#ctl00_ContentPlaceHolder1_GridViewVersions > tbody > tr', html).has('a').each(function () {
      index += 1;

      const measureVersionsText = $(this)
        .find('td > a')
        .text();
      const measureVersionsUrl = $(this)
        .find('td > a')
        .attr('href');
      const measureVersionsPdf = $(`#ctl00_ContentPlaceHolder1_GridViewVersions_ctl${getIndex(index)}_PdfLink`)
        .attr('href');
      billDetails.measureVersions.push({
        measureVersionsText: measureVersionsText,
        measureVersionsUrl: measureVersionsUrl,
        measureVersionsPdf: measureVersionsPdf,
      });
    });
    index = 1; // reset index

    $('table#ctl00_ContentPlaceHolder1_GridViewCommRpt > tbody > tr', html).has('a').each(function () {
      index += 1;
      const committeeReportsText = $(this)
        .find('td > a')
        .text();
      const committeeReportsUrl = $(this)
        .find('td > a')
        .attr('href');
      const committeeReportsPdf = $(this)
        .find(`#ctl00_ContentPlaceHolder1_GridViewCommRpt_ctl${getIndex(index)}_PdfLink`)
        .attr('href');

      billDetails.committeeReports.push({
        committeeReportsText: committeeReportsText,
        committeeReportsUrl: committeeReportsUrl,
        committeeReportsPdf: committeeReportsPdf,
      });
    });

    $('table#ctl00_ContentPlaceHolder1_GridViewTestimony > tbody > tr').has('a').each(function () {
      const testimonyText = $(this)
        .find('a')
        .text();
      const testimonyUrl = $(this)
        .find('a')
        .attr('href');
      billDetails.testimonies.push({
        testimonyText: testimonyText,
        testimonyUrl: testimonyUrl,
      });
    });
    index = 1;

    $('table#ctl00_ContentPlaceHolder1_GridView1 > tbody > tr', html).has('a').each(function () {
      index += 1;
      const committee = $(this)
        .find(`#ctl00_ContentPlaceHolder1_GridView1_ctl${getIndex(index)}_Label17 > b`)
        .text();

      const dateTime = $(this)
        .find(`#ctl00_ContentPlaceHolder1_GridView1_ctl${getIndex(index)}_Label27`)
        .text();

      const room = $(this)
        .find(`span#ctl00_ContentPlaceHolder1_GridView1_ctl${getIndex(index)}_Label27`)
        .next()
        .next()
        .text();

      const youtubeUrl = $(this)
        .find(`#ctl00_ContentPlaceHolder1_GridView1_ctl${getIndex(index)}_streamLink`)
        .attr('href');

      billDetails.hearingNotices.push({
        committee: committee,
        dateTime: dateTime,
        room: room,
        youtubeUrl: youtubeUrl,
      });
    });
    res.status(200).json(billDetails);
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

WebApp.connectHandlers.use(app);
