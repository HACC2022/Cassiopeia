import axios from 'axios';

const scrapeMeasures = async (year, mt) => {
  const request = await axios.get(`/api/scrapeMeasures/${year}/${mt}`);
  return request.data;
};

const scrapeUpcomingHearings = async () => {
  const request = await axios.get('/api/scrapeUpcomingHearings');
  return request.data;
};

const scrapeBillDetails = async (bt, bn, year) => {
  const request = await axios.get(`/api/scrapeBillDetails/${bt}/${bn}/${year}`);
  return request.data;
};

export default { scrapeMeasures, scrapeUpcomingHearings, scrapeBillDetails };
