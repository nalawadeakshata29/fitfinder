const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'FitFinder API',
    version: '1.0.0',
    description:
      'Send body measurements and get the best size in each brand. Currently supports women\'s tops. ' +
      'Size data is collected from public marketplace size charts for demonstration and may differ from current brand charts.',
  },
  servers: [{ url: 'http://localhost:5000' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { 200: { description: 'Server is running' } },
      },
    },
    '/api/v1/brands': {
      get: {
        summary: 'List all brands',
        responses: { 200: { description: 'A list of brands' } },
      },
    },
    '/api/v1/brands/{slug}/charts': {
      get: {
        summary: 'Get the size charts of one brand',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'hm',
            description: 'Brand slug, for example allen-solly, biba, hm, levis, max-fashion, nike, vero-moda',
          },
        ],
        responses: {
          200: { description: 'The brand and its charts' },
          404: { description: 'Brand not found' },
        },
      },
    },
    '/api/v1/recommend': {
      post: {
        summary: 'Recommend a size in every brand',
        description:
          'Body charts are matched directly. Garment charts add extra room (ease) to your bust first. ' +
          'Confidence is high, medium or low.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['bust'],
                properties: {
                  bust: { type: 'number', example: 89, description: 'Bust in cm (60 to 160)' },
                  waist: { type: 'number', example: 70, description: 'Waist in cm (40 to 160), optional' },
                  hips: { type: 'number', example: 96, description: 'Hips in cm (60 to 180), optional' },
                  fit: { type: 'string', enum: ['snug', 'regular', 'loose'], example: 'regular' },
                  gender: { type: 'string', enum: ['women'], example: 'women' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'One recommendation per brand',
            content: {
              'application/json': {
                example: {
                  input: { gender: 'women', category: 'tops', bust: 89, waist: 70, fit: 'regular' },
                  results: [
                    {
                      brand: 'H&M',
                      slug: 'hm',
                      size: 'S',
                      confidence: 'high',
                      note: '',
                      chartType: 'body',
                    },
                  ],
                },
              },
            },
          },
          400: { description: 'Invalid input, with a list of errors' },
        },
      },
    },
  },
};

export default openapi;