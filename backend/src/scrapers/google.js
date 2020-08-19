import axios from 'axios';


export default class GoogleScrap{

  constructor(identifier, competitorId) {
    this.identifier = identifier;
    this.competitorId = competitorId;
  }

  async scrap(){
    try{
      let data = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.identifier}&key=${process.env.GMAPS_KEY}`);
      return {total: data.data.result.user_ratings_total, rate: data.data.result.rating};
    }catch(exp){
      return false;
    }
  }




}