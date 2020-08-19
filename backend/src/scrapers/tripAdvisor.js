import puppeteer from 'puppeteer';
import request from 'request';
import axios from 'axios';



export default class TripAdvisorScrap{

  constructor(identifier, competitorId, checkinDate, checkoutDate) {
    this.identifier = identifier;
    this.competitorId = competitorId;
    this.checkinDate = checkinDate;
    this.checkoutDate = checkoutDate;

    this.locationId = this.identifier.match(new RegExp(/(-d)([0-9]+)/g))[0].replace(/-d/g,'');
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
      this.cookies_security = await this.getCookieAndSecurity();
      // console.log(teste);
      await this.browser.close();
  
      return await this.getReviewsData();
    }catch(exp){
      return false;
    }


  
  }

  async loadPage(){
    await this.page.goto(this.identifier);
  }

  async getCookieAndSecurity(){
    return await this.page.evaluate( ()=>{
      let security_token = window.JS_SECURITY_TOKEN;
      window.getCookie = (name)=>{var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); if (match) return match[2]; }
      let taSession = window.getCookie('TASeesion');
      return {
        security_token,
        taSession
      }
    })
  }

  async getReviewsData(){
    const cookies = request.cookie('TASession='+ this.cookies_security.taSession +'l; path=/; domain=.tripadvisor.com.br;expires=' + new Date(new Date().getTime() + 86409000));
    let data = await axios.post("https://www.tripadvisor.com.br/data/graphql/batched",
    [
      {
        "operationName": "ReviewListQuery",
        "variables":
        {
          "locationId": this.locationId,
          "offset": 0,
          "filters": [],
          "prefs": null,
          "initialPrefs":
          {},
          "limit": 1,
          "filterCacheKey": "hotelReviewFilters",
          "prefsCacheKey": "hotelReviewPrefs",
          "needKeywords": false,
          "keywordVariant": "location_keywords_v2_llr_order_30_pt"
        },
        "query": "query ReviewListQuery($locationId: Int!, $offset: Int, $limit: Int, $filters: [FilterConditionInput!], $prefs: ReviewListPrefsInput, $initialPrefs: ReviewListPrefsInput, $filterCacheKey: String, $prefsCacheKey: String, $keywordVariant: String!, $needKeywords: Boolean = true) {\n  cachedFilters: personalCache(key: $filterCacheKey)\n  cachedPrefs: personalCache(key: $prefsCacheKey)\n  locations(locationIds: [$locationId]) {\n    locationId\n    parentGeoId\n    name\n    reviewSummary {\n      rating\n      count\n      __typename\n    }\n    keywords(variant: $keywordVariant) @include(if: $needKeywords) {\n      keywords {\n        keyword\n        __typename\n      }\n      __typename\n    }\n    ... on LocationInformation {\n      parentGeoId\n      __typename\n    }\n    ... on LocationInformation {\n      parentGeoId\n      __typename\n    }\n    ... on LocationInformation {\n      name\n      __typename\n    }\n    ... on LocationInformation {\n      locationId\n      parentGeoId\n      currentUserOwnerStatus {\n        isValid\n        __typename\n      }\n      __typename\n    }\n    reviewList(page: {offset: $offset, limit: $limit}, filters: $filters, prefs: $prefs, initialPrefs: $initialPrefs, filterCacheKey: $filterCacheKey, prefsCacheKey: $prefsCacheKey) {\n      totalCount\n      ratingCounts\n      languageCounts\n      reviews {\n        ... on Review {\n          id\n          url\n          location {\n            locationId\n            name\n            __typename\n          }\n          createdDate\n          publishedDate\n          userProfile {\n            id\n            userId: id\n            isMe\n            isVerified\n            displayName\n            username\n            avatar {\n              id\n              photoSizes {\n                url\n                width\n                height\n                __typename\n              }\n              __typename\n            }\n            route {\n              url\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          rating\n          publishedDate\n          publishPlatform\n          __typename\n        }\n        ... on Review {\n          title\n          language\n          url\n          __typename\n        }\n        ... on Review {\n          language\n          translationType\n          __typename\n        }\n        ... on Review {\n          roomTip\n          __typename\n        }\n        ... on Review {\n          tripInfo {\n            stayDate\n            __typename\n          }\n          location {\n            placeType\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          additionalRatings {\n            rating\n            ratingLabel\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          tripInfo {\n            tripType\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          language\n          translationType\n          mgmtResponse {\n            id\n            language\n            translationType\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          text\n          publishedDate\n          username\n          connectionToSubject\n          language\n          mgmtResponse {\n            id\n            text\n            language\n            publishedDate\n            username\n            connectionToSubject\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          id\n          locationId\n          title\n          text\n          rating\n          absoluteUrl\n          mcid\n          translationType\n          mtProviderId\n          photos {\n            id\n            photoSizes {\n              url\n              width\n              height\n              __typename\n            }\n            __typename\n          }\n          userProfile {\n            id\n            displayName\n            username\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          mgmtResponse {\n            id\n            __typename\n          }\n          provider {\n            isLocalProvider\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          translationType\n          location {\n            locationId\n            parentGeoId\n            __typename\n          }\n          provider {\n            isLocalProvider\n            isToolsProvider\n            __typename\n          }\n          original {\n            id\n            language\n            submissionDomain\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          locationId\n          mcid\n          attribution\n          __typename\n        }\n        ... on Review {\n          locationId\n          helpfulVotes\n          photoIds\n          route {\n            url\n            __typename\n          }\n          socialStatistics {\n            followCount\n            isFollowing\n            isLiked\n            isReposted\n            isSaved\n            likeCount\n            repostCount\n            tripCount\n            __typename\n          }\n          status\n          userId\n          userProfile {\n            id\n            displayName\n            __typename\n          }\n          location {\n            additionalNames {\n              normal\n              long\n              longOnlyParent\n              longParentAbbreviated\n              longOnlyParentAbbreviated\n              longParentStateAbbreviated\n              longOnlyParentStateAbbreviated\n              geo\n              abbreviated\n              abbreviatedRaw\n              abbreviatedStateTerritory\n              abbreviatedStateTerritoryRaw\n              __typename\n            }\n            parent {\n              additionalNames {\n                normal\n                long\n                longOnlyParent\n                longParentAbbreviated\n                longOnlyParentAbbreviated\n                longParentStateAbbreviated\n                longOnlyParentStateAbbreviated\n                geo\n                abbreviated\n                abbreviatedRaw\n                abbreviatedStateTerritory\n                abbreviatedStateTerritoryRaw\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        ... on Review {\n          text\n          language\n          __typename\n        }\n        ... on Review {\n          locationId\n          absoluteUrl\n          mcid\n          translationType\n          mtProviderId\n          originalLanguage\n          rating\n          __typename\n        }\n        ... on Review {\n          id\n          locationId\n          title\n          rating\n          absoluteUrl\n          mcid\n          translationType\n          mtProviderId\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
  }],
    {
      headers:{
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
        'Cookie':cookies,
        'X-Requested-by':this.cookies_security.security_token
      }
    })

    return {
      total: data.data[0].data.locations[0].reviewSummary.count,
      rate: data.data[0].data.locations[0].reviewSummary.rating
    }
  }



}