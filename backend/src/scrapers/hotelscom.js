import axios from 'axios';



export default class HotelscomScrap{

  constructor(identifier, competitorId, checkinDate, checkoutDate) {
    this.identifier = identifier;
    this.competitorId = competitorId;
    this.checkinDate = checkinDate;
    this.checkoutDate = checkoutDate;
  }

  async scrap(){
    try{
      let data = await axios.get(`https://www.hoteis.com/ho${this.identifier}-tr/reviews/?ajax=true&applyEmbargo=false&reviewOrder=date_newest_first`);
      // console.log(data.data.data.body.reviewContent.overall.rating)
      // console.log(data.data.data.body.reviewContent.overall.totalCount)
      let rate = data.data.data.body.reviewContent.overall.rating;
      rate = rate.replace(',','.');
      rate = Number(rate);
      return {total: data.data.data.body.reviewContent.overall.totalCount, rate};
    }catch(exp){
      return false;
    }

  
  }

  // async loadPage(){
   
  // }

  // async getReviewsData(){
  //   return await this.page.evaluate(()=>{
  //     return{
  //       totalReviews: B.env.hotelAction.showReviews,
  //       score: B.env.b_review_score_detailed
  //     } 
  //   })
  // }



}