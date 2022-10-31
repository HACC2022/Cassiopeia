import axios from 'axios';

const scrapeAll = async (year, mt) => {
  try {
    const request = await axios.get(`/api/scrapeAll/${year}/${mt}`);
    return request.data;
  } catch {
    // eslint-disable-next-line no-console
    console.log('error: please use year and measure type as params');
    return null;
  }
};

const scrapeUpcomingHearings = async () => {
  try {
    const request = await axios.get('/api/scrapeUpcomingHearings');
    return request.data;
  } catch {
    console.log('error!');
    return null;
  }
};

const scrapeBillDetails = async (bt, bn, year) => {
  try {
    const request = await axios.get(`/api/scrapeBillDetails/${bt}/${bn}/${year}`);
    return request.data;
  } catch {
    return (() => console.log('error! invalid request'));
  }
};

export default { scrapeAll, scrapeUpcomingHearings, scrapeBillDetails };
