import ky from 'ky'
import { config } from '@/shared/constants/config'

export const apiClient = ky.create({
  prefixUrl: config.apiUrl,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        console.debug('[API Request]', request.method, request.url)
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error
        
        if (response) {
          const body = (await response.json().catch(() => ({}))) as { message?: string }
          error.message = body.message || error.message || 'An error occurred'
        }
        
        return error
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        console.debug('[API Response]', response.status, request.url)
        return response
      },
    ],
  },
})
