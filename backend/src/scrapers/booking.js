import puppeteer from 'puppeteer';
import request from 'request';



export default class BookingScrap{

  constructor(identifier, competitorId, checkinDate, checkoutDate) {
    this.identifier = identifier;
    this.competitorId = competitorId;
    this.checkinDate = checkinDate;
    this.checkoutDate = checkoutDate;
  }

  async scrap(){
    this.browser = await puppeteer.launch({ headless: false});
    // this.browser = await puppeteer.launch({args: ['--no-sandbox']  });
    this.page = await this.browser.newPage();
    await this.page.setViewport({width: 1920, height: 926});
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      if(['image', 'stylesheet', 'font','script'].indexOf(req.resourceType()) !== -1){
        req.abort();
      }else{
        req.continue();
      }
    })
    try{
      await this.loadPage();
      let teste = await this.getReviewsData();
      // console.log(teste);
      await this.browser.close();
  
      return teste;
    }catch(err){
      return false;
    }
   

  
  }

  async loadPage(){
    await this.page.goto(`https://www.booking.com/hotel/br/${this.identifier}.pt-br.html`);
  }

  async getReviewsData(){
    return await this.page.evaluate(()=>{
      return{
        total: B.env.hotelAction.showReviews,
        rate: B.env.b_review_score_detailed
      } 
    })
  }



}