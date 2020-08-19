import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default class ExpediaScrap {
	constructor(identifier, competitorId, checkinDate, checkoutDate) {
		this.identifier = identifier;
		this.competitorId = competitorId;
		this.checkinDate = checkinDate;
		this.checkoutDate = checkoutDate;
		this.axiosExpedia = new axios.create({});

		this.axiosExpedia.defaults.headers.post['content-type'] =
			'application/json';
		this.axiosExpedia.defaults.headers.post['user-agent'] =
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
		this.axiosExpedia.defaults.headers.post['accept'] = '*/*';
		this.axiosExpedia.defaults.headers.post['accept-encoding'] =
			'gzip, deflate, br';
		this.axiosExpedia.defaults.headers.post['accept-language'] =
			'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7';
		this.axiosExpedia.defaults.headers.post['cache-control'] = 'no-cache';
		this.axiosExpedia.defaults.headers.post['client-info'] =
			'shopping-pwa,unknown,unknown';
		this.axiosExpedia.defaults.headers.post['device-user-agent-id'] = uuidv4();
		this.axiosExpedia.defaults.headers.post['credentials'] = 'same-origin';
		this.axiosExpedia.defaults.headers.post['origin'] =
			'https://www.expedia.com.br';
		this.axiosExpedia.defaults.headers.post['pragma'] = 'no-cache';
		this.axiosExpedia.defaults.headers.post['referer'] =
			'https://www.expedia.com.br/';
		this.axiosExpedia.defaults.headers.post['sec-fetch-mode'] = 'cors';
    this.axiosExpedia.defaults.headers.post['sec-fetch-site'] = 'same-origin';
    this.uuid = uuidv4();
	}

	async scrap() {
		try{
			let data = await this.axiosExpedia.post(
				`https://www.expedia.com.br:443/graphql`,
				{
				operationName: 'Reviews',
				query:
					'\n        query Reviews($context: ContextInput!, $propertyId: String!, $pagination: PaginationInput!, $sortBy: PropertyReviewSort!, $filters: PropertyReviewFiltersInput!) {\n    propertyInfo(propertyId: $propertyId,  context: $context) {\n        reviewInfo(sortBy: $sortBy, pagination: $pagination, filters: $filters) {\n     summary{\n  totalCount\n {\n raw\n }\n averageOverallRating {\n raw\n }\n }\n }\n    }\n}\n\n    ',
				variables: {
					context: {
						siteId: 69,
						locale: 'pt_BR',
						device: { type: 'DESKTOP' },
						identity: {
							duaid: this.uuid,
							expUserId: '-1',
							tuid: '-1',
							authState: 'ANONYMOUS'
						},
						debugContext: { abacusOverrides: [], alterMode: 'RELEASED' }
					},
					propertyId: this.identifier,
					sortBy: 'NEWEST_TO_OLDEST',
					filters: {
						includeRecentReviews: true,
						includeRatingsOnlyReviews: true
					},
					pagination: { startingIndex: 0, size: 1 }
				}
			})
	
			return {
				total: data.data.data.propertyInfo.reviewInfo.summary.totalCount.raw,
				rate: data.data.data.propertyInfo.reviewInfo.summary.averageOverallRating.raw
			};
		}catch(exp){
			return false;
		}
	
	}

}
